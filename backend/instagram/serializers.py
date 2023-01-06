import re
import json

from django.core import serializers as jsonSerializers
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404

from instagram.models import Post, Comment

User = get_user_model()


# 유저정보
class AuthorSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField("avatar_url_field")

    # 스킴, 호스트 자동화
    def avatar_url_field(self, author):
        if re.match(r"https?://", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()  # 호스트를 가져옴
            return scheme + "://" + host + author.avatar_url

    class Meta:
        model = User
        fields = ['username', 'name', 'avatar_url']


# 글 정보
class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    is_like = serializers.SerializerMethodField("is_like_field")
    tag_set = serializers.SerializerMethodField()
    caption_origin = serializers.SerializerMethodField()

    def is_like_field(self, post):
        if "request" in self.context:
            user = self.context["request"].user
            return post.like_user_set.filter(pk=user.pk).exists()
        return False

    def get_tag_set(self, post):
        tag = post.tag_set.all().values("name")
        tag_list = []
        for tags in tag:
            tag_list.append(tags.get("name"))
        return tag_list

    def get_caption_origin(self, post):
        caption = re.sub(r'#([(a-zA-Z\dㄱ-힣)]+)', "", post.caption).strip()
        post.caption = caption
        return post.caption

    class Meta:
        model = Post
        fields = ['id', 'author', 'created_at', 'photo', 'caption', 'caption_origin', 'location', 'tag_set', 'is_like']


# 댓글 정보
class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'messages', 'created_at']


# 프로필 정보
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(read_only=True)
    avatar_url = serializers.SerializerMethodField("avatar_url_field")
    post_list_count = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_follow = serializers.SerializerMethodField()

    def avatar_url_field(self, author):
        if re.match(r"https?://", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()  # 호스트를 가져옴
            return scheme + "://" + host + author.avatar_url

    # 팔로워 카운트
    def get_follower_count(self, username):
        page_user = get_object_or_404(User, username=username, is_active=True)
        follower_count = page_user.follower_set.count()
        return follower_count

    # 팔로우 카운트
    def get_following_count(self, username):
        page_user = get_object_or_404(User, username=username, is_active=True)
        following_count = page_user.following_set.count()
        return following_count

    # 게시글 카운트
    def get_post_list_count(self, username):
        page_user = get_object_or_404(User, username=username, is_active=True)
        post_list = Post.objects.filter(author=page_user)
        post_list_count = post_list.count()
        return post_list_count

    # 팔로우 체크
    def get_is_follow(self, username):
        if "request" in self.context:
            user = self.context["request"].user
            loginUser = get_object_or_404(User, username=user, is_active=True)
            is_follow = loginUser.following_set.filter(username=username).exists()
            return is_follow

    class Meta:
        model = User
        fields = ['username', 'avatar', 'avatar_url', 'first_name', 'last_name', 'website_url', 'bio', 'phone_number',
                  'gender', 'post_list_count', 'follower_count', 'following_count', 'is_follow']
