from django.db import models

# Survey Model
class Survey(models.Model):
    name = models.CharField(max_length=100) 
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# Question Model
class Question(models.Model):
    QUESTION_TYPES = [
        ('text', 'Text'),
        ('number', 'Number'),
        ('choice', 'Multiple Choice'),
    ]

    survey = models.ForeignKey(Survey, related_name="questions", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='text')
    required = models.BooleanField(default=False)

    def __str__(self):
        return self.title
