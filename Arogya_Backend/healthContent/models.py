"""
Models for E-Arogya Health Content Management System
"""
from django.db import models
from django.utils.text import slugify
from django.core.validators import URLValidator
from django.utils import timezone


class HealthCategory(models.Model):
    """
    Health categories for organizing content (nutrition, hygiene, etc.)
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name for frontend display")
    color = models.CharField(max_length=7, default="#4CAF50", help_text="Hex color code for category")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Health Category"
        verbose_name_plural = "Health Categories"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def active_content_count(self):
        return self.media_content.filter(is_active=True).count()
    
    @property
    def video_count(self):
        return self.media_content.filter(is_active=True, content_type='video').count()
    
    @property
    def article_count(self):
        return self.media_content.filter(is_active=True, content_type='article').count()


class MediaContent(models.Model):
    """
    Media content (videos, articles, PDFs, etc.) for health education
    """
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('article', 'Article'),
        ('pdf', 'PDF Document'),
        ('audio', 'Audio'),
        ('infographic', 'Infographic'),
        ('interactive', 'Interactive Content'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('all', 'All Levels'),
    ]
    
    AGE_GROUPS = [
        ('children', 'Children (0-12)'),
        ('teens', 'Teens (13-17)'),
        ('adults', 'Adults (18-64)'),
        ('seniors', 'Seniors (65+)'),
        ('all_ages', 'All Ages'),
    ]
    
    # Basic Information
    category = models.ForeignKey(
        HealthCategory, 
        on_delete=models.CASCADE, 
        related_name='media_content'
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)
    description = models.TextField()
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    
    # URLs and Media
    url = models.URLField(validators=[URLValidator()], help_text="Main content URL")
    thumbnail_url = models.URLField(blank=True, help_text="Thumbnail/preview image URL")
    embed_code = models.TextField(blank=True, help_text="HTML embed code if applicable")
    
    # Metadata
    author = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=100, blank=True, help_text="Source organization/website")
    duration = models.CharField(max_length=20, blank=True, help_text="Duration for videos/audio")
    language = models.CharField(max_length=10, default='en', help_text="Content language code")
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='all')
    target_age_group = models.CharField(max_length=20, choices=AGE_GROUPS, default='all_ages')
    
    # Content Management
    is_featured = models.BooleanField(default=False, help_text="Show on homepage/featured sections")
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False, help_text="Content verified by medical professionals")
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    
    # SEO and Tags
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    meta_description = models.CharField(max_length=160, blank=True)
    
    # Timestamps
    published_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_date', '-created_at']
        verbose_name = "Media Content"
        verbose_name_plural = "Media Content"
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['content_type', 'is_active']),
            models.Index(fields=['is_featured', 'is_active']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} ({self.content_type})"
    
    @property
    def tag_list(self):
        """Return tags as a list"""
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
    
    def increment_view_count(self):
        """Increment view count"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def get_youtube_id(self):
        """Extract YouTube video ID from URL"""
        if 'youtube.com' in self.url or 'youtu.be' in self.url:
            if 'youtube.com/watch?v=' in self.url:
                return self.url.split('v=')[1].split('&')[0]
            elif 'youtu.be/' in self.url:
                return self.url.split('/')[-1].split('?')[0]
        return None
    
    def get_thumbnail_url(self):
        """Get thumbnail URL, generate from YouTube if needed"""
        if self.thumbnail_url:
            return self.thumbnail_url
        
        youtube_id = self.get_youtube_id()
        if youtube_id:
            return f"https://img.youtube.com/vi/{youtube_id}/maxresdefault.jpg"
        
        return None


class ContentRating(models.Model):
    """
    User ratings for content
    """
    content = models.ForeignKey(MediaContent, on_delete=models.CASCADE, related_name='ratings')
    user_ip = models.GenericIPAddressField()  # Simple tracking without user accounts
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['content', 'user_ip']
        verbose_name = "Content Rating"
        verbose_name_plural = "Content Ratings"
    
    def __str__(self):
        return f"{self.content.title} - {self.rating} stars"


class ContentView(models.Model):
    """
    Track content views for analytics
    """
    content = models.ForeignKey(MediaContent, on_delete=models.CASCADE, related_name='views')
    user_ip = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Content View"
        verbose_name_plural = "Content Views"
        indexes = [
            models.Index(fields=['content', 'viewed_at']),
        ]
    
    def __str__(self):
        return f"{self.content.title} viewed at {self.viewed_at}"