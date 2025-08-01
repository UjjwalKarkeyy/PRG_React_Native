import React from "react";
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.helloText}>Hello</Text>
          <Text style={styles.userName}>Ujjwal Karki</Text>
        </View>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.profileImage}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput placeholder="Search Medical" style={styles.searchInput} editable={false} />
      </View>

      {/* Other Services */}
      <Text style={styles.sectionTitle}>Other Services</Text>
      <View style={styles.servicesRow}>
        <DisabledService icon="person" label="Doctors" />
        <DisabledService icon="local-pharmacy" label="Medicines" />

        {/* ✅ Navigate to Feedback Page */}
        <TouchableOpacity style={styles.serviceItem} onPress={() => router.push('../complain/complainAndFeedback')}>
          <MaterialIcons name="feedback" size={28} color="#007bff" />
          <Text style={styles.serviceLabel}>Complains/Feedback</Text>
        </TouchableOpacity>

        <DisabledService icon="coronavirus" label="Epidemic" />
      </View>

      {/* Medical Services Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Get the Best Medical Services</Text>
          <Text style={styles.bannerText}>
            We provide best quality medical services without further cost
          </Text>
        </View>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.doctorImage}
        />
      </View>

      {/* Upcoming Appointments */}
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      <View style={styles.appointmentCard}>
        <Text style={styles.appointmentDate}>12 Tue</Text>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.appointmentTime}>08:30 AM</Text>
          <Text style={styles.appointmentDoctor}>Dr. Mim Ankht</Text>
          <Text style={styles.appointmentType}>Depression</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const DisabledService = ({ icon, label }) => (
  <View style={[styles.serviceItem, { opacity: 0.4 }]}>
    <MaterialIcons name={icon} size={28} color="#999" />
    <Text style={styles.serviceLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  helloText: { fontSize: 16, color: "#333" },
  userName: { fontSize: 20, fontWeight: "bold", color: "#000" },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  searchContainer: { flexDirection: "row", backgroundColor: "#f1f1f1", padding: 10, marginTop: 15, borderRadius: 8 },
  searchInput: { marginLeft: 10, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  servicesRow: { flexDirection: "row", justifyContent: "space-between" },
  serviceItem: { alignItems: "center", width: 80 },
  serviceLabel: { fontSize: 12, marginTop: 5, textAlign: "center" },
  banner: { backgroundColor: "#eaf6ff", flexDirection: "row", padding: 15, borderRadius: 10, marginVertical: 15 },
  bannerTitle: { fontWeight: "bold", fontSize: 16 },
  bannerText: { marginTop: 5, color: "#555", fontSize: 12 },
  doctorImage: { width: 80, height: 80, borderRadius: 40, marginLeft: 10 },
  appointmentCard: { flexDirection: "row", backgroundColor: "#007bff20", padding: 10, borderRadius: 8, marginBottom: 20 },
  appointmentDate: { backgroundColor: "#007bff", color: "#fff", padding: 10, borderRadius: 6, textAlign: "center", minWidth: 50 },
  appointmentTime: { fontSize: 14, fontWeight: "bold" },
  appointmentDoctor: { fontSize: 14, color: "#333" },
  appointmentType: { fontSize: 12, color: "#777" },
});
