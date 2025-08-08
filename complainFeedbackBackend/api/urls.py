from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplainViewSet

router = DefaultRouter()
router.register(r'complains', ComplainViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
