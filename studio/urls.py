from django.urls import path
from . import views

urlpatterns = [
    path('studio/exhibitions/', views.UpcomingExhibitionListView.as_view(), name='studio-exhibitions'),
    path('studio/past-popups/', views.PastPopupListView.as_view(), name='studio-past-popups'),
    path('studio/gallery/', views.EventGalleryListView.as_view(), name='studio-gallery'),
]
