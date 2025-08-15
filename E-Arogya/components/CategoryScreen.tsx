import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { fetchArticlesByCategory, fetchVideosByCategory, Article, Video } from '../services/api';

interface CategoryScreenProps {
  category: string;
  title: string;
  color: string;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, title, color }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, [category, activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'articles') {
        const articlesData = await fetchArticlesByCategory(category);
        setArticles(articlesData);
      } else {
        const videosData = await fetchVideosByCategory(category);
        setVideos(videosData);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (videoUrl: string) => {
    Linking.openURL(videoUrl);
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderArticleCard = (article: Article) => (
    <View key={article.id} style={styles.contentCard}>
      <Image
        source={{ uri: article.imageUrl || 'https://via.placeholder.com/300x200' }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{article.title}</Text>
        <Text style={styles.cardDescription}>{article.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.publishDate}>{article.publishedDate}</Text>
          <TouchableOpacity style={[styles.readMoreButton, { backgroundColor: color }]}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderVideoCard = (video: Video) => (
    <TouchableOpacity
      key={video.id}
      style={styles.contentCard}
      onPress={() => handleVideoPress(video.videoUrl)}
    >
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{ uri: video.thumbnailUrl || 'https://via.placeholder.com/300x200' }}
          style={styles.cardImage}
        />
        <View style={styles.playButton}>
          <Ionicons name="play" size={24} color="white" />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{video.title}</Text>
        <Text style={styles.cardDescription}>{video.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.publishDate}>{video.publishedDate}</Text>
          <Text style={styles.duration}>{video.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'articles' && { ...styles.activeTab, borderBottomColor: color },
          ]}
          onPress={() => setActiveTab('articles')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'articles' && { ...styles.activeTabText, color: color },
            ]}
          >
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'videos' && { ...styles.activeTab, borderBottomColor: color },
          ]}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'videos' && { ...styles.activeTabText, color: color },
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color} />
            <Text style={styles.loadingText}>Loading content...</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {activeTab === 'articles'
              ? articles.map(renderArticleCard)
              : videos.map(renderVideoCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  videoThumbnailContainer: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publishDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  duration: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '600',
  },
  readMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  readMoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default CategoryScreen;
