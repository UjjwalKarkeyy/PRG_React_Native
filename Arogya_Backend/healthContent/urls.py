"""
URL configuration for health_content app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthCategoryViewSet, MediaContentViewSet, ContentRatingViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'categories', HealthCategoryViewSet, basename='healthcategory')
router.register(r'content', MediaContentViewSet, basename='mediacontent')
router.register(r'ratings', ContentRatingViewSet, basename='contentrating')

# Additional URL patterns
content_list = MediaContentViewSet.as_view({
    'get': 'list'
})

content_by_category = MediaContentViewSet.as_view({
    'get': 'by_category'
})

urlpatterns = [
    path('', include(router.urls)),
    # Additional endpoints
    path('categories/<str:category_slug>/content/', content_by_category, name='content-by-category'),
]