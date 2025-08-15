from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ComplainViewSet, ComplaintCommentViewSet

router = DefaultRouter()
router.register(r'complains', ComplainViewSet)
router.register(r'comments', ComplaintCommentViewSet)
urlpatterns = [
    
]
