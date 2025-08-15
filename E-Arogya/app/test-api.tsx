import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import ApiTest from '../components/ApiTest';
import { useTheme } from 'react-native-paper';

export default function TestApiScreen() {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <ApiTest />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
