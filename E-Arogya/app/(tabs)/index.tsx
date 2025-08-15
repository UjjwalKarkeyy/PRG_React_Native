import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Image, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CategoryItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
}

const categories: CategoryItem[] = [
  {
    id: '1',
    title: 'Nutrition',
    icon: 'nutrition',
    route: '/nutrition',
    color: '#4CAF50'
  },
  {
    id: '2',
    title: 'Hygiene',
    icon: 'water',
    route: '/hygiene',
    color: '#2196F3'
  },
  {
    id: '3',
    title: 'Child Health',
    icon: 'heart',
    route: '/child-health',
    color: '#FF9800'
  },
  {
    id: '4',
    title: 'Mental Health',
    icon: 'happy',
    route: '/mental-health',
    color: '#9C27B0'
  },
  {
    id: '5',
    title: 'First Aid',
    icon: 'medical',
    route: '/first-aid',
    color: '#F44336'
  },
  {
    id: '6',
    title: 'Seasonal Diseases',
    icon: 'thermometer',
    route: '/seasonal-diseases',
    color: '#607D8B'
  }
];

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  const banners = [
    {
      id: 1,
      text: 'स्वस्थ जीवनशैली\nअपनाउनुहोस् |',
      backgroundColor: '#F5E6B8',
      phoneColor: '#2C3E50',
      screenColor: '#E8F4FD',
      playButtonColor: '#FF6B6B'
    },
    {
      id: 2,
      text: 'तनाबलाई\nव्यवस्थापन गरौं |।',
      backgroundColor: '#E8F4FD',
      phoneColor: '#2C3E50',
      screenColor: '#F5E6B8',
      playButtonColor: '#4CAF50'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 10000); // Change banner every 10 seconds

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleCategoryPress = (route: string) => {
    router.push(route as any);
  };

  const handleBannerToggle = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Educational Contents</Text>
        <Text style={styles.subtitle}>Your Health Education Companion</Text>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          style={[styles.banner, { backgroundColor: banners[currentBanner].backgroundColor }]} 
          onPress={handleBannerToggle}
          activeOpacity={0.9}
        >
        <View style={styles.bannerContent}>
          <View style={styles.bannerLeft}>
            <View style={[styles.phoneContainer, { backgroundColor: banners[currentBanner].phoneColor }]}>
              <View style={[styles.phoneScreen, { backgroundColor: banners[currentBanner].screenColor }]}>
                <View style={styles.screenContent}>
                  <View style={styles.videoThumbnail}>
                    <View style={[styles.playButton, { backgroundColor: banners[currentBanner].playButtonColor }]}>
                      <Ionicons name="play" size={14} color="white" />
                    </View>
                  </View>
                  <View style={styles.screenLines}>
                    <View style={styles.screenLine} />
                    <View style={styles.screenLine} />
                    <View style={styles.screenLine} />
                  </View>
                </View>
              </View>
              <View style={styles.phoneButton} />
            </View>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerText}>{banners[currentBanner].text}</Text>
          </View>
        </View>
        <View style={styles.bannerIndicators}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: currentBanner === index ? banners[currentBanner].playButtonColor : '#E0E0E0'
                }
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
      </Animated.View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { 
                borderColor: category.color,
                shadowColor: category.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 6,
              }]}
              onPress={() => handleCategoryPress(category.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { 
                backgroundColor: category.color,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }]}>
                <Ionicons name={category.icon} size={32} color="white" />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a252f',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c7b7f',
    textAlign: 'center',
    fontWeight: '500',
  },
  banner: {
    marginTop: 15,
    marginHorizontal: 0,
    marginBottom: 15,
    borderRadius: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    height: 160,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },
  bannerLeft: {
    marginRight: 20,
  },
  phoneContainer: {
    width: 65,
    height: 95,
    borderRadius: 10,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneScreen: {
    width: 52,
    height: 70,
    borderRadius: 5,
    padding: 6,
  },
  screenContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoThumbnail: {
    height: 28,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenLines: {
    gap: 2,
  },
  screenLine: {
    height: 3,
    backgroundColor: '#CCC',
    borderRadius: 1.5,
  },
  phoneButton: {
    width: 16,
    height: 3,
    backgroundColor: '#555',
    borderRadius: 1.5,
  },
  bannerRight: {
    flex: 1,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a252f',
    lineHeight: 30,
    textAlign: 'center',
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    gap: 6,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a252f',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    elevation: 6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a252f',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
