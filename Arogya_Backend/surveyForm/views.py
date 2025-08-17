from rest_framework import viewsets
from .models import Survey, Question
from .serializers import SurveySerializer, QuestionSerializer

# Survey CRUD
class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


# Question CRUD
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer