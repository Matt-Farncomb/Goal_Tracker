from django.urls import path
from . import views

urlpatterns = [
    path('', views.goal, name='goals-goal'),
]