from django.db import models

class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Specialties"
        ordering = ['name']

    def __str__(self):
        return self.name

class Doctor(models.Model):
    name = models.CharField(max_length=200)
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name='doctors')
    phone = models.CharField(max_length=20, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    hospital = models.CharField(max_length=300, blank=True)
    opd_time = models.CharField(max_length=100, blank=True, default='Mon-Fri 9AM-5PM')
    qualifications = models.TextField(blank=True)
    languages = models.CharField(max_length=200, blank=True, default='English, Hindi')
    bio = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"Dr. {self.name} - {self.specialty.name}"
