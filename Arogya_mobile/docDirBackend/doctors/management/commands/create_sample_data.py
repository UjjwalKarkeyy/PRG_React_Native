from django.core.management.base import BaseCommand
from doctors.models import Doctor, Specialty

class Command(BaseCommand):
    help = 'Create sample doctors and specialties data'

    def handle(self, *args, **options):
        # Create specialties
        specialties_data = [
            {'name': 'Cardiology', 'description': 'Heart and cardiovascular system'},
            {'name': 'Dermatology', 'description': 'Skin, hair, and nail conditions'},
            {'name': 'Neurology', 'description': 'Nervous system disorders'},
            {'name': 'Pediatrics', 'description': 'Medical care for children'},
            {'name': 'Orthopedics', 'description': 'Bones, joints, and muscles'},
            {'name': 'Psychiatry', 'description': 'Mental health disorders'},
            {'name': 'General Medicine', 'description': 'General medical care'},
        ]

        for specialty_data in specialties_data:
            specialty, created = Specialty.objects.get_or_create(
                name=specialty_data['name'],
                defaults={'description': specialty_data['description']}
            )
            if created:
                self.stdout.write(f'Created specialty: {specialty.name}')

        # Create doctors
        doctors_data = [
            {'name': 'John Smith', 'specialty': 'Cardiology', 'phone': '555-0101', 'email': 'john.smith@hospital.com', 'experience_years': 15, 'rating': 4.8},
            {'name': 'Sarah Johnson', 'specialty': 'Dermatology', 'phone': '555-0102', 'email': 'sarah.johnson@clinic.com', 'experience_years': 12, 'rating': 4.9},
            {'name': 'Michael Brown', 'specialty': 'Neurology', 'phone': '555-0103', 'email': 'michael.brown@medical.com', 'experience_years': 20, 'rating': 4.7},
            {'name': 'Emily Davis', 'specialty': 'Pediatrics', 'phone': '555-0104', 'email': 'emily.davis@children.com', 'experience_years': 8, 'rating': 4.9},
            {'name': 'David Wilson', 'specialty': 'Orthopedics', 'phone': '555-0105', 'email': 'david.wilson@ortho.com', 'experience_years': 18, 'rating': 4.6},
            {'name': 'Lisa Anderson', 'specialty': 'Psychiatry', 'phone': '555-0106', 'email': 'lisa.anderson@mental.com', 'experience_years': 14, 'rating': 4.8},
            {'name': 'Robert Taylor', 'specialty': 'General Medicine', 'phone': '555-0107', 'email': 'robert.taylor@general.com', 'experience_years': 10, 'rating': 4.5},
            {'name': 'Jennifer Martinez', 'specialty': 'Cardiology', 'phone': '555-0108', 'email': 'jennifer.martinez@heart.com', 'experience_years': 16, 'rating': 4.7},
        ]

        for doctor_data in doctors_data:
            specialty = Specialty.objects.get(name=doctor_data['specialty'])
            doctor, created = Doctor.objects.get_or_create(
                name=doctor_data['name'],
                specialty=specialty,
                defaults={
                    'phone': doctor_data['phone'],
                    'email': doctor_data['email'],
                    'experience_years': doctor_data['experience_years'],
                    'rating': doctor_data['rating'],
                    'address': f'{doctor_data["name"]} Medical Office, 123 Health St',
                }
            )
            if created:
                self.stdout.write(f'Created doctor: Dr. {doctor.name}')

        self.stdout.write(self.style.SUCCESS('Successfully created sample data!'))
