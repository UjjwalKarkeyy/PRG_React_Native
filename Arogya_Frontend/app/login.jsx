import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            const apiUrl = API_ENDPOINTS.LOGIN;
            console.log('Attempting login to:', apiUrl);
            
            console.log('Login payload:', { username, password: '***' });
            
            const response = await axios.post(apiUrl, {
                username,
                password,
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Login successful:', response.status);
            await AsyncStorage.setItem('token', response.data.token.access);
            router.push('/');
        } catch (err) {
            console.log('Login error details:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                code: err.code
            });
            
            let errorMessage = 'Invalid username or password';
            
            if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
                errorMessage = 'Network error. Check if backend is running.';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Backend may be unreachable.';
            } else if (err.response?.status === 401) {
                errorMessage = 'Invalid username or password';
            } else if (err.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            setError(errorMessage);
            Alert.alert('Login Failed', errorMessage);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
            <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                style={styles.input} />
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                style={styles.input} />
            {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    signupButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

