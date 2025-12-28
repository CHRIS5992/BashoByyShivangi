from rest_framework import serializers
from .models import GalleryImage, TextTestimonial, VideoTestimonial, CustomerExperience


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = GalleryImage
        fields = ['id', 'image_url', 'category', 'category_display', 'order']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class TextTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextTestimonial
        fields = ['id', 'customer_name', 'location', 'quote', 'is_featured']


class VideoTestimonialSerializer(serializers.ModelSerializer):
    video_file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = VideoTestimonial
        fields = ['id', 'customer_name', 'location', 'description', 
                  'video_file_url', 'video_url', 'thumbnail_url', 'is_featured']
    
    def get_video_file_url(self, obj):
        if obj.video_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video_file.url)
            return obj.video_file.url
        return None
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class CustomerExperienceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerExperience
        fields = ['id', 'image_url', 'paragraph', 'customer_name', 'context']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
