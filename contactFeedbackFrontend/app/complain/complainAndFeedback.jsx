import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Complain from "./complain";
import Feedback from "../feedback/feedback";

export default function ComplainAndFeedback() {
  const [tab, setTab] = useState("complain");
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  backArrow: { fontSize: 22, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  tabContainer: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ddd" },
  tab: { flex: 1, padding: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderColor: "blue" },
  tabText: { fontWeight: "600" },
});