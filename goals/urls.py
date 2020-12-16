from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), 
    path('api/<int:id>/', views.api, name='goals-api'),
    path('login/', views.login, name='login'),
    path('login/<message>', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register')
]