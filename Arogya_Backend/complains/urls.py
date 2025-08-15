from django.urls import path
from . import views

urlpatterns = [
    path('complains/', views.complains, name='complains'),
]