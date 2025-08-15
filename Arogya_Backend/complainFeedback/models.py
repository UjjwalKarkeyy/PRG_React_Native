from django.db import models

# Create your models here.
class Complains(models.Model):
    class Meta:
        app_label = 'complainFeedback'
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('seen', 'Seen'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class ComplaintComment(models.Model):
    complaint = models.ForeignKey(Complains, on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(max_length=100)  # For now, just store name as string
    is_admin = models.BooleanField(default=False)
    text = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
        app_label = 'complainFeedback'
    
    def __str__(self):
        return f"Comment by {self.author_name} on {self.complaint.title}"


class ComplaintStatusHistory(models.Model):
    complaint = models.ForeignKey(Complains, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Complains.STATUS_CHOICES)
    changed_by = models.CharField(max_length=100, default="System")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        app_label = 'complainFeedback'
    
    def __str__(self):
        return f"{self.complaint.title} - {self.status} at {self.created_at}"
