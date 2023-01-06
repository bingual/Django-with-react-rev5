import json

from django.contrib.auth import get_user_model
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import SignupSerializer, SuggestionUserSerializer, ChangePasswordSerializer

User = get_user_model()


# 회원가입
class SignupView(CreateAPIView):
    model = User
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]


# 추천 유저목록
class SuggestionListAPIView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = SuggestionUserSerializer

    def get_queryset(self):
        qs = (
            super().get_queryset() \
                .exclude(pk=self.request.user.pk) \
                .exclude(pk__in=self.request.user.following_set.all())
        )
        return qs


# 팔로우
@api_view(['POST'])
def user_follow(request):
    username = request.data["username"]
    follow_user = get_object_or_404(User, username=username, is_active=True)
    request.user.following_set.add(follow_user)
    follow_user.follower_set.add(request.user)
    return Response(status.HTTP_204_NO_CONTENT)


# 팔로우 취소
@api_view(['POST'])
def user_unfollow(request):
    username = request.data["username"]
    follow_user = get_object_or_404(User, username=username, is_active=True)
    request.user.following_set.remove(follow_user)
    follow_user.follower_set.remove(request.user)
    return Response(status.HTTP_204_NO_CONTENT)


# 토큰 커스텀
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # 유효성 검사
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        # response에 추가하고 싶은 key값들 추가
        data['username'] = self.user.username
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['success'] = True

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


# 비밀번호 변경
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # 기존 암호 체크
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["기존 암호와 일치하지않습니다."]}, status=status.HTTP_400_BAD_REQUEST)

            # 새로운 암호 체크
            if serializer.data.get("new_password") != serializer.data.get("new_password2"):
                return Response({"new_password2": ["새로운 암호와 일치하지않습니다."]}, status=status.HTTP_400_BAD_REQUEST)

            # 비밀번호 암호화후 재설정
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': '비밀번호가 변경되었습니다.',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
