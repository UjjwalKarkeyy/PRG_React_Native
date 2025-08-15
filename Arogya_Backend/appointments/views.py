from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateSerializer

class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            response_serializer = AppointmentSerializer(appointment)
            return Response({
                'success': True,
                'message': 'Appointment booked successfully!',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Failed to book appointment',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

@api_view(['GET'])
def available_slots(request, doctor_id):
    """Get available appointment slots for a doctor on a specific date"""
    date_str = request.GET.get('date')
    if not date_str:
        return Response({
            'success': False,
            'message': 'Date parameter is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({
            'success': False,
            'message': 'Invalid date format. Use YYYY-MM-DD'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get all time slots
    all_slots = [slot[0] for slot in Appointment.TIME_SLOTS]
    
    # Get booked slots for this doctor on this date
    booked_slots = Appointment.objects.filter(
        doctor_id=doctor_id,
        appointment_date=appointment_date,
        status__in=['pending', 'confirmed']
    ).values_list('appointment_time', flat=True)
    
    # Calculate available slots
    available_slots = [slot for slot in all_slots if slot not in booked_slots]
    
    # Format slots with display names
    formatted_slots = []
    for slot in available_slots:
        display_name = dict(Appointment.TIME_SLOTS)[slot]
        formatted_slots.append({
            'value': slot,
            'label': display_name
        })
    
    return Response({
        'success': True,
        'data': {
            'date': date_str,
            'available_slots': formatted_slots
        }
    })
