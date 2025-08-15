from django.urls import path
from . import views

urlpatterns = [
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/available-slots/<int:doctor_id>/', views.available_slots, name='available-slots'),
]
