from django.urls import path
from . import views
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView

# handler404 = views.handler404

urlpatterns = [
    path('', views.home, name='home'), 
    path('api/<int:id>/', views.api, name='goals-api'),
    path('login/', views.login, name='login'),
    path('login/<message>', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('register/<failed_form>', views.register, name='register'),
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('images/favicon.ico')))
]