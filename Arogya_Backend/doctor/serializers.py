from rest_framework import serializers
from .models import Doctor, Specialty

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name', 'description']

class DoctorSerializer(serializers.ModelSerializer):
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'specialty', 'specialty_name', 'price', 'phone', 
            'email', 'address', 'hospital', 'opd_time', 'qualifications', 
            'languages', 'bio', 'experience_years', 'rating', 'is_available', 
            'created_at', 'updated_at'
        ]
