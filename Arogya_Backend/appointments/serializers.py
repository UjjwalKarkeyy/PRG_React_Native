from rest_framework import serializers
from .models import Appointment
from doctor.serializers import DoctorSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialty.name', read_only=True)
    appointment_time_display = serializers.CharField(source='get_appointment_time_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialty',
            'patient_name', 'patient_phone', 'patient_email', 'patient_age',
            'appointment_date', 'appointment_time', 'appointment_time_display',
            'reason', 'status', 'status_display', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'doctor', 'patient_name', 'patient_phone', 'patient_email', 
            'patient_age', 'appointment_date', 'appointment_time', 'reason'
        ]
    
    def validate(self, data):
        # Check if the appointment slot is already booked
        if Appointment.objects.filter(
            doctor=data['doctor'],
            appointment_date=data['appointment_date'],
            appointment_time=data['appointment_time'],
            status__in=['pending', 'confirmed']
        ).exists():
            raise serializers.ValidationError("This appointment slot is already booked.")
        return data
