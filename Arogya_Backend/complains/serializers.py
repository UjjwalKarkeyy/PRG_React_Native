from rest_framework import serializers
from .models import Complains

class ComplainsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complains
        fields = '__all__'
