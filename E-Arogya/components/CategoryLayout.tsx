import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import healthApi from '../services/healthApi';

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

interface CategoryLayoutProps {
  categorySlug: string;
  title: string;
  color: string;
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({ categorySlug, title, color }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const fetchContent = useCallback(async () => {
    console.log(`[CategoryLayout] Fetching content for category: ${categorySlug}`);
    setLoading(true);
    setError(null);
    
    try {
      const data = await healthApi.getCategoryContent(categorySlug);
      console.log(`[CategoryLayout] Received ${data.length} items from API`);
      setContent(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? 
        (err as any).status === 404 ? 
          'Content not found for this category.' : 
          err.message 
        : 'An unknown error occurred';
        
      console.error('[CategoryLayout] Error in fetchContent:', {
        error: err,
        message: errorMessage,
        categorySlug,
        time: new Date().toISOString()
      });
      
      setError(`Failed to load content. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleBackPress = () => {
    router.back();
  };

  const handleContentPress = async (item: ContentItem) => {
    // Track the view
    await healthApi.incrementView(item.id);
    
    // Open the URL in the device's default browser
    if (item.url) {
      await Linking.openURL(item.url);
    }
  };

  const filteredContent = content.filter(item => {
    if (activeTab === 'articles') {
      return item.content_type === 'article' || item.content_type === 'pdf';
    } else {
      return item.content_type === 'video';
    }
  });

  const renderContentItem = ({ item }: { item: ContentItem }) => {
    const isVideo = item.content_type === 'video';
    const videoId = isVideo ? healthApi.getYouTubeVideoId(item.url) : null;
    const thumbnailUrl = isVideo && videoId 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : item.thumbnail_url;
    
    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: '#fff' }]}
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
          <Text style={[styles.title, { color: '#000' }]} numberOfLines={2}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={[styles.description, { color: '#555' }]} numberOfLines={2}>
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
                <MaterialIcons name="visibility" size={16} color="#666" />
                <Text style={[styles.statText, { color: '#666' }]}>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      {/* Header with back arrow - Clean minimalist design */}
      <View style={[styles.header, { 
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingTop: insets.top + 16
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#000' }]}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Container - Clean minimalist design */}
      <View style={[styles.tabContainer, { 
        backgroundColor: '#fff',
        borderBottomColor: 'rgba(0,0,0,0.1)'
      }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'articles' && { borderBottomColor: color, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('articles')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'articles' ? color : '#666' },
              activeTab === 'articles' && styles.activeTabText,
            ]}
          >
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'videos' && { borderBottomColor: color, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'videos' ? color : '#666' },
              activeTab === 'videos' && styles.activeTabText,
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color} />
          <Text style={[styles.loadingText, { color: color }]}>
            Loading {title.toLowerCase()} content...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ff4444" />
          <Text style={[styles.errorText, { color: '#000' }]}>{error}</Text>
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
      ) : (
        <FlatList
          data={filteredContent}
          renderItem={renderContentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="info-outline" size={48} color="#999" />
              <Text style={[styles.emptyText, { color: '#666' }]}>
                No {activeTab} available for {title.toLowerCase()} yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
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

export default CategoryLayout;
