from django.urls import path
from .views import DoctorListView, SpecialtyListView, health_check

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('specialties/', SpecialtyListView.as_view(), name='specialty-list'),
    path('health/', health_check, name='health-check'),
]
