import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function complainSuccess() {
    const router = useRouter();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Return Button */}
            <TouchableOpacity 
                style={styles.headerLeft} 
                onPress={() => navigation.canGoBack() ? router.back() : router.push('../complain/complainAndFeedback')}
            >
                <Text style={styles.headerText}>←</Text>
            </TouchableOpacity>

            {/* ✅ Home Button (Aligned Top-Right) */}
            <TouchableOpacity
                style={styles.headerRight}
                onPress={() => router.push('/')}
            >
                <Ionicons
                    name="home"
                    size={24}
                    color="#007bff"
                />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Return to Feedback</Text>

            {/* Success Image */}
            {Platform.OS === 'web' ? (
                <Image
                    source={require("../../assets/images/undraw_showing-support_ixfc.svg")}
                    style={styles.image}
                />
            ) : (
                <View style={styles.successContainer}>
                    <View style={styles.successCircle}>
                        <Ionicons name="checkmark" size={60} color="#fff" />
                    </View>
                    <View style={styles.decorativeElements}>
                        <View style={[styles.dot, { top: 20, left: 30 }]} />
                        <View style={[styles.dot, { top: 40, right: 25 }]} />
                        <View style={[styles.dot, { bottom: 30, left: 20 }]} />
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={[styles.sparkle, { top: 15, right: 40 }]}>⭐</Text>
                        <Text style={[styles.sparkle, { bottom: 20, right: 30 }]}>💚</Text>
                    </View>
                </View>
            )}

            {/* Success Message */}
            <Text style={styles.message}>Your feedback has been received</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    headerLeft: {
        position: "absolute",
        top: 40,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    headerRight: {
        position: "absolute",
        top: 40,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    title: {
        position: "absolute",
        top: 40,
        left: 60,
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        resizeMode: "contain",
        marginTop: 50, // Optional space below header
    },
    successContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 50,
        position: 'relative',
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#28a745',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    decorativeElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#28a745',
        opacity: 0.6,
    },
    sparkle: {
        position: 'absolute',
        fontSize: 20,
        top: 10,
        left: 40,
    },
    message: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
});

