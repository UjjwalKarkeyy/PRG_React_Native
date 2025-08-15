import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import healthApi from '../services/healthApi';

const ApiTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test categories endpoint
      const cats = await healthApi.getCategories();
      setCategories(cats);
      setIsConnected(true);
      Alert.alert('Success', 'Successfully connected to the API!');
    } catch (error) {
      console.error('API Test Error:', error);
      setIsConnected(false);
      Alert.alert(
        'Connection Failed', 
        `Could not connect to the API. Please check if the server is running.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[
          styles.statusValue,
          isConnected === true && styles.statusConnected,
          isConnected === false && styles.statusError
        ]}>
          {isConnected === null ? 'Testing...' : isConnected ? 'Connected' : 'Failed'}
        </Text>
      </View>

      <Button 
        title={loading ? 'Testing...' : 'Test Again'} 
        onPress={testConnection} 
        disabled={loading}
        color="#007AFF"
      />

      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Available Categories:</Text>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categorySlug}>({cat.slug})</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusConnected: {
    color: '#4CAF50',
  },
  statusError: {
    color: '#F44336',
  },
  categoriesContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  categorySlug: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ApiTest;
