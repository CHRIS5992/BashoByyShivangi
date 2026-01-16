from rest_framework import serializers
from .models import Creation


class CreationSerializer(serializers.ModelSerializer):
    """
    Serializer for Creation model.
    Returns the full absolute URL for the image field.
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Creation
        fields = ['id', 'image_url', 'url', 'height', 'order', 'alt_text']

    def get_image_url(self, obj):
        """Return full absolute URL for the image."""
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None
