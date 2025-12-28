from rest_framework import serializers
from .models import UpcomingExhibition, PastPopup, EventGalleryImage


class UpcomingExhibitionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UpcomingExhibition
        fields = ['id', 'title', 'location', 'start_date', 'end_date', 'description', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PastPopupSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PastPopup
        fields = ['id', 'event_name', 'city', 'year', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class EventGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EventGalleryImage
        fields = ['id', 'image_url', 'alt_text', 'order']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
