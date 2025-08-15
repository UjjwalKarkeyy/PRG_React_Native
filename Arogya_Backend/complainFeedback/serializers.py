from rest_framework import serializers
from .models import Complains, ComplaintComment, ComplaintStatusHistory

class ComplaintCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = ComplaintComment
        fields = ['id', 'author_name', 'is_admin', 'text', 'parent', 'created_at', 'updated_at', 'replies']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return ComplaintCommentSerializer(obj.replies.all(), many=True).data
        return []

class ComplaintStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintStatusHistory
        fields = '__all__'

class ComplainsSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    status_history = ComplaintStatusHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Complains
        fields = '__all__'
    
    def get_comments(self, obj):
        # Only get top-level comments (parent=None), replies are nested
        top_level_comments = obj.comments.filter(parent=None)
        return ComplaintCommentSerializer(top_level_comments, many=True).data
