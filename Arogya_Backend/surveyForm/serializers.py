from rest_framework import serializers
from .models import Survey, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class SurveySerializer(serializers.ModelSerializer):
    # include questions inside survey
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Survey
        fields = '__all__'