import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Complain() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/undraw_no-data_ig65.svg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.noDataText}>No Data Found</Text>
      <Text style={styles.subText}>We could not find any data</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./addComplain")}
      >
        <Text style={styles.buttonText}>Add Complain</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 150, height: 150, marginBottom: 20 },
  noDataText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666", marginBottom: 20 },
  button: { backgroundColor: "blue", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
