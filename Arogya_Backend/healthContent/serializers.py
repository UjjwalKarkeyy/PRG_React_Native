"""
Serializers for E-Arogya Health Content API
"""
from rest_framework import serializers
from .models import HealthCategory, MediaContent, ContentRating, ContentView


class MediaContentListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing media content (minimal fields for performance)
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    tag_list = serializers.ReadOnlyField()
    
    class Meta:
        model = MediaContent
        fields = [
            'id', 'title', 'slug', 'description', 'content_type', 'url',
            'thumbnail_url', 'author', 'source', 'duration', 'difficulty_level',
            'target_age_group', 'is_featured', 'view_count', 'like_count',
            'published_date', 'category_name', 'category_slug', 'tag_list'
        ]
    
    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()


class MediaContentDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for individual media content
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    tag_list = serializers.ReadOnlyField()
    youtube_id = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaContent
        fields = [
            'id', 'title', 'slug', 'description', 'content_type', 'url',
            'thumbnail_url', 'embed_code', 'author', 'source', 'duration',
            'language', 'difficulty_level', 'target_age_group', 'is_featured',
            'is_verified', 'view_count', 'like_count', 'share_count',
            'tags', 'tag_list', 'meta_description', 'published_date',
            'created_at', 'updated_at', 'category_name', 'category_slug',
            'youtube_id', 'average_rating', 'total_ratings'
        ]
    
    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()
    
    def get_youtube_id(self, obj):
        return obj.get_youtube_id()
    
    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if ratings:
            return sum(r.rating for r in ratings) / len(ratings)
        return 0
    
    def get_total_ratings(self, obj):
        return obj.ratings.count()


class MediaContentCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating media content
    """
    class Meta:
        model = MediaContent
        fields = [
            'category', 'title', 'description', 'content_type', 'url',
            'thumbnail_url', 'embed_code', 'author', 'source', 'duration',
            'language', 'difficulty_level', 'target_age_group', 'is_featured',
            'is_verified', 'tags', 'meta_description'
        ]
    
    def validate_url(self, value):
        """Validate URL format"""
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value


class HealthCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for health categories with content counts
    """
    active_content_count = serializers.ReadOnlyField()
    video_count = serializers.ReadOnlyField()
    article_count = serializers.ReadOnlyField()
    
    class Meta:
        model = HealthCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color',
            'is_active', 'order', 'active_content_count', 'video_count',
            'article_count', 'created_at', 'updated_at'
        ]


class HealthCategoryWithContentSerializer(serializers.ModelSerializer):
    """
    Category serializer with associated media content
    """
    media_content = MediaContentListSerializer(many=True, read_only=True)
    active_content_count = serializers.ReadOnlyField()
    video_count = serializers.ReadOnlyField()
    article_count = serializers.ReadOnlyField()
    
    class Meta:
        model = HealthCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color',
            'is_active', 'order', 'media_content', 'active_content_count',
            'video_count', 'article_count', 'created_at', 'updated_at'
        ]


class ContentRatingSerializer(serializers.ModelSerializer):
    """
    Serializer for content ratings
    """
    class Meta:
        model = ContentRating
        fields = ['id', 'content', 'rating', 'comment', 'created_at']
        read_only_fields = ['user_ip']
    
    def create(self, validated_data):
        # Get user IP from request context
        request = self.context.get('request')
        if request:
            validated_data['user_ip'] = self.get_client_ip(request)
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ContentStatsSerializer(serializers.Serializer):
    """
    Serializer for content statistics
    """
    total_content = serializers.IntegerField()
    total_videos = serializers.IntegerField()
    total_articles = serializers.IntegerField()
    total_views = serializers.IntegerField()
    featured_content = serializers.IntegerField()
    categories_count = serializers.IntegerField()
    recent_content = MediaContentListSerializer(many=True)


class SearchResultSerializer(serializers.ModelSerializer):
    """
    Serializer for search results
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    relevance_score = serializers.FloatField(read_only=True)
    
    class Meta:
        model = MediaContent
        fields = [
            'id', 'title', 'slug', 'description', 'content_type', 'url',
            'thumbnail_url', 'author', 'duration', 'view_count',
            'category_name', 'relevance_score', 'published_date'
        ]
    
    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()