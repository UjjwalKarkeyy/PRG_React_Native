# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from complainFeedback.views import ComplainViewSet, ComplaintCommentViewSet
from healthContent.views import HealthCategoryViewSet, MediaContentViewSet, ContentRatingViewSet

router = DefaultRouter()
router.register(r'complains', ComplainViewSet)
router.register(r'comments', ComplaintCommentViewSet)
router.register(r'categories', HealthCategoryViewSet, basename='healthcategory')
router.register(r'content', MediaContentViewSet, basename='mediacontent')
router.register(r'ratings', ContentRatingViewSet, basename='contentrating')

urlpatterns = [
    path('', include(router.urls)),  # Removed 'api/'
]
