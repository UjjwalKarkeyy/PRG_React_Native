import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ComplainDetails() {
    const { id } = useLocalSearchParams(); // get id from URL
    const [data, setData] = useState({});

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/complains/${id}/`)
            .then(response => setData(response.data))
            .catch(error => console.log(`Error while fetching data: ${error}`));
    }, [id]);

    return (
        <View>
            <Text>{data.title}</Text>
            <Text>{data.description}</Text>
        </View>
    );
}
