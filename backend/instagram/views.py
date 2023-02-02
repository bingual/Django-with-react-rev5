from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action, api_view
from rest_framework.filters import SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone

from instagram.models import Post, Comment
from instagram.serializers import PostSerializer, CommentSerializer, ProfileSerializer

User = get_user_model()


# 포스팅 관련
class PostViewSet(ModelViewSet):
    queryset = Post.objects.all() \
        .select_related('author') \
        .prefetch_related("tag_set", "like_user_set")  # 쿼리 최적화 처리
    serializer_class = PostSerializer

    # serializer에서 사용할 context 생성
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    # 쿼리셋 수정
    def get_queryset(self):
        # timesince = timezone.now() - timedelta(days=3)
        qs = super().get_queryset()
        qs = qs.filter(
            Q(author=self.request.user)
            | Q(author__in=self.request.user.following_set.all())
        )
        return qs

    # serializer의 값을 추가시키기 위해 사용
    def perform_create(self, serializer):
        author = self.request.user
        post = serializer.save(author=author)
        post.tag_set.add(*post.extract_tag_list())
        return super().perform_create(serializer)

    # 좋아요
    @action(detail=True, methods=["POST"])
    def like(self, request, pk):
        post = self.get_object()
        post.like_user_set.add(self.request.user)
        return Response(status.HTTP_201_CREATED)

    # 좋아요 취소
    @like.mapping.delete
    def unlike(self, request, pk):
        post = self.get_object()
        post.like_user_set.remove(self.request.user)
        return Response(status.HTTP_204_NO_CONTENT)


# 댓글 관련
class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(post__pk=self.kwargs['post_pk'])
        return qs

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs['post_pk'])
        serializer.save(author=self.request.user, post=post)
        return super().perform_create(serializer)


# 프로필 관련
class UserPage(RetrieveUpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = ProfileSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, username=self.kwargs['username'])  # 유저 가져오기: 유저 정보 보기 위해
        serializer = self.get_serializer(user)  # 시리얼라이저 가져오기: () 안에 유저 정보
        return Response(serializer.data)

    def update(self, request, username, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = get_object_or_404(User, username=self.kwargs['username'])
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


# 유저페이지 포스팅 목록
class UserPostList(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        page_user = get_object_or_404(User, username=self.kwargs['username'], is_active=True)
        qs = qs.filter(author=page_user)
        return qs
