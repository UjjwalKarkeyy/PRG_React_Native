  import React, { useState } from "react";
  import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from "react-native";
  import { useRouter, useNavigation } from "expo-router";

  const staticComplains = [
    "Appointment Scheduling Issue",
    "Data Entry Error",
    "Access and Login Problems",
    "Service Delays or Unavailability",
    "Privacy and Security Concerns",
  ];

  export default function AddComplain() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const navigation = useNavigation();

    const filteredComplains = staticComplains.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('./complainAndFeedback')}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Complain</Text>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search complains..."
          value={search}
          onChangeText={setSearch}
        />

        {/* List */}
        <FlatList
          data={filteredComplains}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Text style={styles.listItem}>{index + 1}. {item}</Text>
          )}
        />

        {/* Add Custom Complain Button */}
        <TouchableOpacity
          style={styles.customBtn}
          onPress={() => router.push("./customComplain")}
        >
          <Text style={styles.btnText}>Add Custom Complain</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    backArrow: { fontSize: 22, marginRight: 10 },
    title: { fontSize: 18, fontWeight: "bold" },
    searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
    listItem: { fontSize: 16, paddingVertical: 5 },
    customBtn: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
    btnText: { color: "#fff", fontWeight: "bold" },
  });