import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Hide tab bar since we're using custom navigation
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color }) => <TabBarIcon name="nutrition" color={color} />,
        }}
      />
      <Tabs.Screen
        name="hygiene"
        options={{
          title: 'Hygiene',
          tabBarIcon: ({ color }) => <TabBarIcon name="water" color={color} />,
        }}
      />
      <Tabs.Screen
        name="child-health"
        options={{
          title: 'Child Health',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mental-health"
        options={{
          title: 'Mental Health',
          tabBarIcon: ({ color }) => <TabBarIcon name="happy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: 'First Aid',
          tabBarIcon: ({ color }) => <TabBarIcon name="medical" color={color} />,
        }}
      />
      <Tabs.Screen
        name="seasonal-diseases"
        options={{
          title: 'Seasonal Diseases',
          tabBarIcon: ({ color }) => <TabBarIcon name="thermometer" color={color} />,
        }}
      />
    </Tabs>
  );
}
