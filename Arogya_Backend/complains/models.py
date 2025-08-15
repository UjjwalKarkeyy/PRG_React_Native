from django.db import models
from django.contrib import admin

# Create your models here.
class Complains(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    state = models.CharField(max_length=100, default="Unknown")
    district = models.CharField(max_length=100, default="Unknown")
    municipality = models.CharField(max_length=100, default="Unknown")
    ward_number = models.IntegerField(default=0)
    street_address = models.CharField(max_length=255, blank=True, null=True)   
    category = models.CharField(max_length=100, default="Unknown")
    subcategory = models.CharField(max_length=100, default="Unknown") 
    file = models.FileField(upload_to='complaint_files/', blank=True, null=True)
    image = models.ImageField(upload_to='complaint_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

admin.site.register(Complains)