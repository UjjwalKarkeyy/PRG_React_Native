import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import {useRouter} from 'expo-router';

export default function Signup(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async()=>{
    try{
        await axios.post('http://127.0.0.1:8000/api/signup/',{
            username,
            email,
            password,
        });

        setMessage('User created! You can now login.');
        router.push('/login');
    } catch(err){
        setMessage('Error signing up');
    }
  };

  return(
    <View>
        <TextInput placeholder='Username' value={username} onChangeText={setUsername} style={styles.input}/>
        <TextInput placeholder='Email' value = {email} onChangeText={setEmail} style={styles.input}/>
        <TextInput placeholder='Password' secureTextEntry value = {password} onChangeText={setPassword} style = {styles.input}/>
        {message ? <Text>{message}</Text> : null}
        <Button title='Sign Up' onPress={handleSignup}/>
    </View>
  );
};

const styles = StyleSheet.create({
    container : {flex: 1, justifyContent: 'center', padding: 20},
    input: {borderWidth: 1, marginBottom: 10, padding: 10},
})