import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });
            await AsyncStorage.setItem('token', response.data.token.access);
            router.push('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
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
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button title='Login' onPress={handleLogin} />
            <Button title='Sign Up' onPress={() => router.push('/signup')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});

