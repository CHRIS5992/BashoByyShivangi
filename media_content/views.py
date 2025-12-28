from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .models import GalleryImage, TextTestimonial, VideoTestimonial, CustomerExperience
from .serializers import (
    GalleryImageSerializer, 
    TextTestimonialSerializer, 
    VideoTestimonialSerializer,
    CustomerExperienceSerializer
)


class GalleryImageListView(generics.ListAPIView):
    """List all active gallery images, optionally filtered by category"""
    serializer_class = GalleryImageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
    
    def get_queryset(self):
        return GalleryImage.objects.filter(is_active=True)


class TextTestimonialListView(generics.ListAPIView):
    """List all active text testimonials"""
    serializer_class = TextTestimonialSerializer
    
    def get_queryset(self):
        return TextTestimonial.objects.filter(is_active=True)


class VideoTestimonialListView(generics.ListAPIView):
    """List all active video testimonials"""
    serializer_class = VideoTestimonialSerializer
    
    def get_queryset(self):
        return VideoTestimonial.objects.filter(is_active=True)


class CustomerExperienceListView(generics.ListAPIView):
    """List all active customer experiences"""
    serializer_class = CustomerExperienceSerializer
    
    def get_queryset(self):
        return CustomerExperience.objects.filter(is_active=True)
