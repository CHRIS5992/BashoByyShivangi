from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import UserProfile, Order
from .user_serializers import UserProfileSerializer, UserOrderSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user profiles
    - POST /api/user-profiles/ : Create/update user profile
    - GET /api/user-profiles/{firebase_uid}/ : Get user profile
    - GET /api/user-profiles/{firebase_uid}/orders/ : Get user's orders
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]  # You may want to add Firebase token authentication later
    lookup_field = 'firebase_uid'
    
    def create(self, request, *args, **kwargs):
        """Create or update user profile"""
        firebase_uid = request.data.get('firebase_uid')
        
        if not firebase_uid:
            return Response(
                {'error': 'firebase_uid is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if profile already exists
        try:
            profile = UserProfile.objects.get(firebase_uid=firebase_uid)
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            # Create new profile
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def orders(self, request, firebase_uid=None):
        """Get all orders for a specific user"""
        profile = get_object_or_404(UserProfile, firebase_uid=firebase_uid)
        orders = Order.objects.filter(user_profile=profile).order_by('-created_at')
        serializer = UserOrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_last_login(self, request, firebase_uid=None):
        """Update last login timestamp"""
        profile = get_object_or_404(UserProfile, firebase_uid=firebase_uid)
        from django.utils import timezone
        profile.last_login = timezone.now()
        profile.save()
        return Response({'status': 'last_login updated'})
