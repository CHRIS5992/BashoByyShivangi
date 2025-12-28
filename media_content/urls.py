from django.urls import path
from . import views

urlpatterns = [
    path('media/gallery/', views.GalleryImageListView.as_view(), name='media-gallery'),
    path('media/testimonials/text/', views.TextTestimonialListView.as_view(), name='media-text-testimonials'),
    path('media/testimonials/video/', views.VideoTestimonialListView.as_view(), name='media-video-testimonials'),
    path('media/experiences/', views.CustomerExperienceListView.as_view(), name='media-experiences'),
]
