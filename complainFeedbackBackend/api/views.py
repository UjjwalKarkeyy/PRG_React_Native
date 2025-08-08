from rest_framework import viewsets
from .models import Complains
from .serializers import ComplainSerializer

class ComplainViewSet(viewsets.ModelViewSet):
    queryset = Complains.objects.all()
    serializer_class = ComplainSerializer