from django.contrib import admin
from complainFeedback.models import Complains
from healthContent.models import HealthCategory, MediaContent, ContentRating, ContentView

# Register your models here.
admin.site.register(Complains)
admin.site.register(HealthCategory)
admin.site.register(MediaContent)
admin.site.register(ContentRating)
admin.site.register(ContentView)