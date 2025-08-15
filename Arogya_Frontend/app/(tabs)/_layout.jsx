import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { Text, View, Pressable, TouchableWithoutFeedback } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="home" size={24} color={focused ? "#007bff" : "#777"} />
                    )
                }}
            />

            <Tabs.Screen
                name="schedule"
                options={{
                    title: 'Schedule',
                    tabBarButton: () => (
                        <TouchableWithoutFeedback pointerEvents="none">
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Ionicons name="calendar" size={24} color="#ccc" style={{ marginRight: 6 }} />
                                <Text style={{
                                    fontSize: 12,
                                    textAlignVertical: 'center',
                                    fontFamily: 'Arial',
                                    opacity: 0.7,      // makes it look more faded

                                }}
                                    numberOfLines={1}>Schedule</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ),
                    tabBarIcon: () => (
                        <Pressable disabled>
                        </Pressable>
                    )
                }}
            />

            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarButton: () => (
                        <TouchableWithoutFeedback pointerEvents="none">
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Ionicons name="document-text" size={24} color="#ccc" style={{ marginRight: 6 }} />
                                <Text style={{
                                    fontSize: 12,
                                    textAlignVertical: 'center',
                                    fontFamily: 'Arial',
                                    opacity: 0.7,  
                                }}
                                    numberOfLines={1}>Reports</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ),
                }}
            />

            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Notification',
                    tabBarButton: () => (
                        <TouchableWithoutFeedback pointerEvents="none">
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Ionicons name="notifications" size={24} color="#ccc" style={{ marginRight: 6 }} />
                                <Text style={{
                                    fontSize: 12,
                                    textAlignVertical: 'center',
                                    fontFamily: 'System',
                                    opacity: 0.7,  
                                }}
                                    numberOfLines={1}>Notification</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ),

                }}
            />
        </Tabs>
    )
}

