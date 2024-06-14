from django.urls import path
from . import views
from .views import process_frames

urlpatterns = [
    
    path('', views.index, name='index'),
    path('process_frames/', process_frames, name='process_frames'),
]