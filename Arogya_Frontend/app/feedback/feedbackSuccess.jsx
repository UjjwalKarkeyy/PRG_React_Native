import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
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
            <Image
                source={require("../../assets/images/undraw_showing-support_ixfc.svg")}
                style={styles.image}
            />

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
    message: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
});

