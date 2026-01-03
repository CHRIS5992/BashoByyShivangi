# Basho Products - URL Configuration (REST API)
#
# Maps URLs to API views for React frontend

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'products'

# REST API Router
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'custom-orders', views.CustomOrderViewSet, basename='customorder')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    # REST API endpoints
    path('', include(router.urls)),
    
    # User creation endpoint
    path('create-user/', views.create_user, name='create_user'),
    
    # Shipping calculator
    path('calculate-shipping/', views.calculate_shipping, name='calculate_shipping'),
]
