import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Complain from "./complain";
import Feedback from "../feedback/feedback";

export default function ComplainAndFeedback() {
  const [tab, setTab] = useState("complain");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Complains</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "complain" && styles.activeTab]}
          onPress={() => setTab("complain")}
        >
          <Text style={styles.tabText}>Complain</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "feedback" && styles.activeTab]}
          onPress={() => setTab("feedback")}
        >
          <Text style={styles.tabText}>Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Screens */}
      {tab === "complain" ? <Complain /> : <Feedback />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backArrow: {
    fontSize: 22,
    marginRight: 12,
    color: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: "#007bff",
  },
  tabText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#666",
  },
});