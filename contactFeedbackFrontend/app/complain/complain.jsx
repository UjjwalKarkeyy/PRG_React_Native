import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react'

export default function Complain() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/complains/')
      .then(response => setData(response.data))
      .catch(error => console.log(error))
  }, [])

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <>
          <Image
            source={require("../../assets/images/undraw_no-data_ig65.svg")} // Use .png if svg not supported
            style={styles.image}
            resizeMode="contain"
          />
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
          style={styles.button}
          onPress={() => router.push("./addComplain")}
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
    paddingTop: 10
  },
  image: { width: 150, height: 150, marginBottom: 20 },
  noDataText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666", marginBottom: 20 },
  button: { backgroundColor: "blue", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  details: {
    color: "blue",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
})
