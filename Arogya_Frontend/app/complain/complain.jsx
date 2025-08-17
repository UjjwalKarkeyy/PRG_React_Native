import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Platform } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react'

export default function Complain() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(API_ENDPOINTS.COMPLAINS)
      .then(response => setData(response.data))
      .catch(error => console.log(error))
  }, [])

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <>
          {Platform.OS === 'web' ? (
            <Image
              source={require("../../assets/images/undraw_no-data_ig65.svg")}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.image, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 48, color: '#ccc' }}>📊</Text>
            </View>
          )}
          <Text style={styles.noDataText}>No Data Found</Text>
          <Text style={styles.subText}>We could not find any data</Text>
        </>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <Feather name="message-square" size={24} color="black" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push(`./details/${item.id}`)}>
                <Text style={styles.details}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("./customComplain")}
        >
          <Text style={styles.buttonText}>Add Complain</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: -16,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  details: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
})
