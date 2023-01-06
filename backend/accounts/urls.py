from django.urls import path
from rest_framework_simplejwt.views import token_obtain_pair, token_refresh, token_verify

from accounts import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('suggestions/', views.SuggestionListAPIView.as_view(), name='suggestions_user_list'),

    path('token/', views.MyTokenObtainPairView.as_view()),
    path('token/refresh', token_refresh),
    path('token/verify', token_verify),

    path('follow/', views.user_follow, name='user_follow'),
    path('unfollow/', views.user_unfollow, name='user_unfollow'),

    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
]
