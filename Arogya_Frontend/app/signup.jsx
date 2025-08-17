import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export default function Signup(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Test network connectivity
  const testConnection = async () => {
    try {
      const testUrl = API_ENDPOINTS.HEALTH;
      console.log('Testing connection to:', testUrl);
      const response = await axios.get(testUrl, { timeout: 5000 });
      console.log('Connection test successful:', response.status, response.data);
      Alert.alert('Success', 'Backend is reachable!');
    } catch (error) {
      console.log('Connection test failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      Alert.alert('Connection Failed', `Status: ${error.response?.status || 'Network Error'}`);
    }
  };

  const handleSignup = async()=>{
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try{
      const apiUrl = API_ENDPOINTS.SIGNUP;
      console.log('Attempting signup to:', apiUrl);
      
      const response = await axios.post(apiUrl, {
        username,
        email,
        password,
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Signup successful:', response.status);
      setMessage('User created! You can now login.');
      Alert.alert('Success', 'Account created successfully!');
      router.push('/login');
    } catch(err){
      console.log('Signup error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        code: err.code
      });
      
      let errorMessage = 'Error signing up';
      
      if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = 'Network error. Check if backend is running and accessible.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Backend may be slow or unreachable.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'Invalid input data';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setMessage(errorMessage);
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <TextInput placeholder='Username' value={username} onChangeText={setUsername} style={styles.input}/>
        <TextInput placeholder='Email' value = {email} onChangeText={setEmail} style={styles.input}/>
        <TextInput placeholder='Password' secureTextEntry value = {password} onChangeText={setPassword} style = {styles.input}/>
        {message ? <Text style={{ color: message.includes('Error') || message.includes('Failed') ? 'red' : 'green', marginBottom: 10 }}>{message}</Text> : null}
        <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSignup} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={testConnection}>
          <Text style={styles.testButtonText}>Test Connection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/login')}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15, 
    padding: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonDisabled: {
    backgroundColor: '#6c757d'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  testButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  testButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})