from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from .models import Doctor, Specialty
from .serializers import DoctorSerializer, SpecialtySerializer

class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    
    def get_queryset(self):
        queryset = Doctor.objects.filter(is_available=True)
        search = self.request.query_params.get('search', None)
        specialty = self.request.query_params.get('specialty', None)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(specialty__name__icontains=search)
            )
        
        if specialty and specialty != 'All':
            queryset = queryset.filter(specialty__name__icontains=specialty)
            
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': {
                'doctors': serializer.data,
                'total': len(serializer.data)
            }
        })

class SpecialtyListView(generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': {
                'specialties': serializer.data,
                'total': len(serializer.data)
            }
        })

@api_view(['GET'])
def health_check(request):
    return Response({
        'success': True,
        'message': 'Django Doctor Directory API is running',
        'status': 'healthy'
    })
