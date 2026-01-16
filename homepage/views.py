from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from products.models import Product
from workshops.models import Workshop
from .models import Creation
from .serializers import CreationSerializer


class CreationsListView(ListAPIView):
    """
    API endpoint that returns all active creations for the masonry gallery.
    Returns JSON array of creation items with full image URLs.
    
    GET /api/creations/
    """
    serializer_class = CreationSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all items without pagination

    def get_queryset(self):
        """Return only active creations, ordered by the order field."""
        return Creation.objects.filter(is_active=True).order_by('order', '-created_at')


class StudioDuoView(APIView):
    """
    API endpoint for the Studio Duo section (Products & Workshops).
    Returns top 3 recent products and top 3 active workshops.
    
    GET /api/homepage/duo/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch 2 latest products
        products = Product.objects.filter(in_stock=True).order_by('-created_at')[:2]
        products_data = []
        for p in products:
            img_url = None
            if p.image:
                img_url = request.build_absolute_uri(p.image.url)
            elif p.image_url:
                img_url = p.image_url
            
            products_data.append({
                'id': p.id,
                'name': p.name,
                'image': img_url,
                'image_url_full': img_url,
                'price': p.price,
                'short_description': p.short_description,
                'category': p.category,
                'tags': p.get_tags(),
                'is_bestseller': p.is_bestseller,
                'is_featured': p.is_featured
            })

        # Fetch 2 active workshops
        workshops = Workshop.objects.filter(is_active=True).order_by('-is_popular')[:2]
        workshops_data = []
        for w in workshops:
            img_url = None
            if w.image:
                img_url = request.build_absolute_uri(w.image.url)
            elif w.image_url:
                img_url = w.image_url
                
            workshops_data.append({
                'id': w.id,
                'name': w.name,
                'image_url': img_url,
                'price': w.price,
                'workshop_type': w.workshop_type,
                'workshop_type_display': w.get_workshop_type_display(),
                'short_description': w.short_description,
                'duration_hours': w.duration_hours,
                'difficulty_level_display': w.get_difficulty_level_display(),
                'max_participants': w.max_participants,
                'available_slots': w.available_slots,
                'is_featured': w.is_featured,
                'is_popular': w.is_popular
            })

        return Response({
            'products': products_data,
            'workshops': workshops_data
        })
