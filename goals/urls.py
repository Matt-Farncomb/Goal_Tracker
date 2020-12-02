from django.urls import path
from . import views

urlpatterns = [
    path('', views.goal, name='goals-goal'), 
    path('api/<int:id>/', views.api, name='goals-api') 
]