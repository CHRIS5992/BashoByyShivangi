from rest_framework import generics
from .models import UpcomingExhibition, PastPopup, EventGalleryImage
from .serializers import (
    UpcomingExhibitionSerializer, 
    PastPopupSerializer, 
    EventGalleryImageSerializer
)


class UpcomingExhibitionListView(generics.ListAPIView):
    """List all active upcoming exhibitions"""
    serializer_class = UpcomingExhibitionSerializer
    
    def get_queryset(self):
        return UpcomingExhibition.objects.filter(is_active=True)


class PastPopupListView(generics.ListAPIView):
    """List all past pop-ups"""
    queryset = PastPopup.objects.all()
    serializer_class = PastPopupSerializer


class EventGalleryListView(generics.ListAPIView):
    """List all event gallery images"""
    queryset = EventGalleryImage.objects.all()
    serializer_class = EventGalleryImageSerializer
