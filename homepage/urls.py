from django.urls import path
from .views import CreationsListView, StudioDuoView

urlpatterns = [
    path('creations/', CreationsListView.as_view(), name='creations-list'),
    path('duo/', StudioDuoView.as_view(), name='studio-duo'),
]
