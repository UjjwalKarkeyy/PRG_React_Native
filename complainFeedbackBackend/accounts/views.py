from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import SignupSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message":"User registerest successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                'message':'Login Successful',
                'token':{
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)