from django.contrib import admin
from .models import Survey, Question

# Inline Question Editing inside Survey
class QuestionInline(admin.TabularInline):   # or use StackedInline for bigger forms
    model = Question
    extra = 1   # number of empty question forms shown
    fields = ('title', 'description', 'question_type', 'required')
    show_change_link = True


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'survey', 'question_type', 'required')
    search_fields = ('title', 'description')
    list_filter = ('question_type', 'required', 'survey')
