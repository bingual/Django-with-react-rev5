from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from instagram import views

router = DefaultRouter()
router.register('posts', views.PostViewSet)
router.register(r'posts/(?P<post_pk>\d+)/comments', views.CommentViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    re_path(r'^(?P<username>[\w.@+-]+)/$', views.UserPage.as_view(), name='user_page'),
    re_path(r'^(?P<username>[\w.@+-]+)/postList/$', views.UserPostList.as_view(), name='userPostList'),
]
