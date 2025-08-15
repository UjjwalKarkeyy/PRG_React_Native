from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Complains
from .serializers import ComplainsSerializer

class ComplainViewSet(viewsets.ModelViewSet):
    queryset = Complains.objects.all()
    serializer_class = ComplainsSerializer
    parser_classes = (MultiPartParser, FormParser)  # Required for image upload
