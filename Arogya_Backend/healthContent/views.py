"""
Views for E-Arogya Health Content API
"""
from django.db.models import Q, Count, Avg
from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import HealthCategory, MediaContent, ContentRating, ContentView
from .serializers import (
    HealthCategorySerializer, HealthCategoryWithContentSerializer,
    MediaContentListSerializer, MediaContentDetailSerializer,
    MediaContentCreateUpdateSerializer, ContentRatingSerializer,
    ContentStatsSerializer, SearchResultSerializer
)


class HealthCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for health categories
    """
    queryset = HealthCategory.objects.filter(is_active=True)
    serializer_class = HealthCategorySerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return HealthCategoryWithContentSerializer
        return HealthCategorySerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'retrieve':
            # Prefetch related content for detail view
            queryset = queryset.prefetch_related(
                'media_content__ratings'
            ).select_related()
        return queryset
    
    @action(detail=True, methods=['get'])
    def content(self, request, slug=None):
        """Get all content for a specific category"""
        category = self.get_object()
        content_type = request.query_params.get('type', None)
        difficulty = request.query_params.get('difficulty', None)
        age_group = request.query_params.get('age_group', None)
        featured_only = request.query_params.get('featured', None)
        
        queryset = category.media_content.filter(is_active=True)
        
        # Apply filters
        if content_type:
            queryset = queryset.filter(content_type=content_type)
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
        if age_group:
            queryset = queryset.filter(target_age_group=age_group)
        if featured_only == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Order by featured first, then by published date
        queryset = queryset.order_by('-is_featured', '-published_date')
        
        serializer = MediaContentListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get categories with featured content"""
        categories = self.get_queryset().filter(
            media_content__is_featured=True,
            media_content__is_active=True
        ).distinct()
        
        serializer = HealthCategoryWithContentSerializer(categories, many=True)
        return Response(serializer.data)


class MediaContentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for media content with full CRUD operations
    """
    queryset = MediaContent.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'content_type', 'difficulty_level', 'target_age_group', 'is_featured']
    search_fields = ['title', 'description', 'author', 'tags']
    ordering_fields = ['published_date', 'view_count', 'like_count', 'created_at']
    ordering = ['-published_date']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MediaContentListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return MediaContentCreateUpdateSerializer
        return MediaContentDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'retrieve':
            # Prefetch ratings for detail view
            queryset = queryset.prefetch_related('ratings').select_related('category')
        return queryset
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Increment view count and track view"""
        content = self.get_object()
        
        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            user_ip = x_forwarded_for.split(',')[0]
        else:
            user_ip = request.META.get('REMOTE_ADDR')
        
        # Track view
        ContentView.objects.create(
            content=content,
            user_ip=user_ip,
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Increment view count
        content.increment_view_count()
        
        return Response({'view_count': content.view_count})
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Increment like count"""
        content = self.get_object()
        content.like_count += 1
        content.save(update_fields=['like_count'])
        return Response({'like_count': content.like_count})
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Increment share count"""
        content = self.get_object()
        content.share_count += 1
        content.save(update_fields=['share_count'])
        return Response({'share_count': content.share_count})
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured content across all categories
        """
        featured = self.get_queryset().filter(is_featured=True).order_by('-published_date')[:10]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def by_category(self, request, category_slug=None):
        """
        Get content filtered by category slug
        """
        if not category_slug:
            return Response(
                {'error': 'Category slug is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Get the category to ensure it exists
            category = HealthCategory.objects.get(slug=category_slug, is_active=True)
            
            # Get content for this category
            content = self.get_queryset().filter(category=category)
            
            # Apply pagination if needed
            page = self.paginate_queryset(content)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
                
            serializer = self.get_serializer(content, many=True)
            return Response(serializer.data)
            
        except HealthCategory.DoesNotExist:
            return Response(
                {'error': f'Category with slug {category_slug} not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular content based on views and likes"""
        queryset = self.get_queryset().order_by('-view_count', '-like_count')[:20]
        serializer = MediaContentListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently added content"""
        queryset = self.get_queryset().order_by('-created_at')[:20]
        serializer = MediaContentListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search with relevance scoring"""
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', '')
        content_type = request.query_params.get('type', '')
        
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Build search query
        search_query = Q(title__icontains=query) | Q(description__icontains=query) | Q(tags__icontains=query)
        
        queryset = self.get_queryset().filter(search_query)
        
        # Apply additional filters
        if category:
            queryset = queryset.filter(category__slug=category)
        if content_type:
            queryset = queryset.filter(content_type=content_type)
        
        # Simple relevance scoring (can be enhanced)
        for item in queryset:
            score = 0
            if query.lower() in item.title.lower():
                score += 3
            if query.lower() in item.description.lower():
                score += 2
            if query.lower() in item.tags.lower():
                score += 1
            item.relevance_score = score
        
        # Sort by relevance
        queryset = sorted(queryset, key=lambda x: x.relevance_score, reverse=True)
        
        serializer = SearchResultSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get content statistics"""
        total_content = MediaContent.objects.filter(is_active=True).count()
        total_videos = MediaContent.objects.filter(is_active=True, content_type='video').count()
        total_articles = MediaContent.objects.filter(is_active=True, content_type='article').count()
        total_views = MediaContent.objects.filter(is_active=True).aggregate(
            total=models.Sum('view_count')
        )['total'] or 0
        featured_content = MediaContent.objects.filter(is_active=True, is_featured=True).count()
        categories_count = HealthCategory.objects.filter(is_active=True).count()
        recent_content = MediaContent.objects.filter(is_active=True).order_by('-created_at')[:5]
        
        stats_data = {
            'total_content': total_content,
            'total_videos': total_videos,
            'total_articles': total_articles,
            'total_views': total_views,
            'featured_content': featured_content,
            'categories_count': categories_count,
            'recent_content': recent_content
        }
        
        serializer = ContentStatsSerializer(stats_data)
        return Response(serializer.data)


class ContentRatingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for content ratings
    """
    queryset = ContentRating.objects.all()
    serializer_class = ContentRatingSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        content_id = self.request.query_params.get('content_id')
        if content_id:
            return self.queryset.filter(content_id=content_id)
        return self.queryset
    
    def perform_create(self, serializer):
        # Get client IP
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            user_ip = x_forwarded_for.split(',')[0]
        else:
            user_ip = self.request.META.get('REMOTE_ADDR')
        
        serializer.save(user_ip=user_ip)