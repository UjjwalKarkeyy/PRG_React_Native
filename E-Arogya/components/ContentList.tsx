import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import healthApi from '../services/healthApi';
import { ScrollView } from 'react-native';  // Add this to your existing imports

// Define the ContentItem interface
interface ContentItem {
  id: number;
  title: string;
  description: string;
  content_type: 'video' | 'article' | 'pdf' | 'audio';
  url: string;
  thumbnail_url?: string;
  duration?: string;
  author: string;
  source: string;
  tags: string[];
  is_featured: boolean;
  is_verified: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}

interface ContentListProps {
  categorySlug: string;
  color: string;
}

const ContentList: React.FC<ContentListProps> = ({ categorySlug, color }) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchContent = useCallback(async () => {
    console.log(`[ContentList] Fetching content for category: ${categorySlug}`);
    setLoading(true);
    setError(null);
    
    try {
      console.log('[ContentList] Calling healthApi.getCategoryContent...');
      const data = await healthApi.getCategoryContent(categorySlug);
      console.log(`[ContentList] Received ${data.length} items from API`);
      setContent(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? 
        (err as any).status === 404 ? 
          'Content not found for this category.' : 
          err.message 
        : 'An unknown error occurred';
        
      console.error('[ContentList] Error in fetchContent:', {
        error: err,
        message: errorMessage,
        categorySlug,
        time: new Date().toISOString()
      });
      
      // Only show error if the component is still mounted and category hasn't changed
      setError(`Failed to load content. ${errorMessage}`);
    } finally {
      // Only update loading state if the component is still mounted and category hasn't changed
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleContentPress = async (item: ContentItem) => {
    // Track the view
    await healthApi.incrementView(item.id);
    
    // Open the URL in the device's default browser
    if (item.url) {
      await Linking.openURL(item.url);
    }
  };

  const renderContentItem = ({ item }: { item: ContentItem }) => {
    const isVideo = item.content_type === 'video';
    const videoId = isVideo ? healthApi.getYouTubeVideoId(item.url) : null;
    const thumbnailUrl = isVideo && videoId 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : item.thumbnail_url;
    
    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
        onPress={() => handleContentPress(item)}
      >
        {thumbnailUrl && (
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: thumbnailUrl }} 
              style={styles.thumbnail}
              resizeMode="cover"
            />
            {isVideo && (
              <View style={styles.playIconContainer}>
                <MaterialIcons name="play-circle-filled" size={48} color="rgba(255,255,255,0.9)" />
              </View>
            )}
          </View>
        )}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]} numberOfLines={2}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={[styles.description, { color: isDark ? '#ccc' : '#555' }]} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.metaContainer}>
            {item.author && (
              <Text style={[styles.metaText, { color: color }]}>
                {item.author}
              </Text>
            )}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="visibility" size={16} color={isDark ? '#888' : '#666'} />
                <Text style={[styles.statText, { color: isDark ? '#888' : '#666' }]}>
                  {item.view_count || 0}
                </Text>
              </View>
              {item.is_verified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="#1E88E5" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color} />
        <Text style={[styles.loadingText, { color }]}>
          Loading {categorySlug.replace('-', ' ')} content...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ff4444" />
        <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: color }]}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchContent();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={content}
      renderItem={renderContentItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <MaterialIcons name="info-outline" size={48} color={isDark ? '#666' : '#999'} />
          <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
            No content available for this category yet.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 12,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#1E88E5',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ContentList;
