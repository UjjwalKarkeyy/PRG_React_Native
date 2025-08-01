import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CustomComplain() {
  const router = useRouter();

  // States
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Dummy Data
  const stateData = ["Province 1", "Province 2", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];

  const districtData = {
    "Province 1": ["Morang", "Sunsari", "Jhapa"],
    "Province 2": ["Parsa", "Bara", "Dhanusha"],
    "Bagmati": ["Kathmandu", "Bhaktapur", "Lalitpur"],
    "Gandaki": ["Kaski", "Lamjung"],
    "Lumbini": ["Rupandehi", "Dang"],
    "Karnali": ["Surkhet", "Dailekh"],
    "Sudurpashchim": ["Kailali", "Kanchanpur"],
  };

  const municipalityData = {
    Morang: ["Biratnagar", "Belbari", "Pathari"],
    Sunsari: ["Inaruwa", "Itahari"],
    Jhapa: ["Birtamod", "Damak"],
    Kathmandu: ["Kathmandu Metro", "Kirtipur", "Tokha"],
    Bhaktapur: ["Bhaktapur Municipality", "Madhyapur Thimi"],
    Lalitpur: ["Lalitpur Metro", "Godawari"],
    Kaski: ["Pokhara", "Machhapuchhre"],
    Lamjung: ["Besisahar"],
    Rupandehi: ["Butwal", "Devdaha"],
    Dang: ["Ghorahi", "Tulsipur"],
    Surkhet: ["Birendranagar"],
    Dailekh: ["Narayan Municipality"],
    Kailali: ["Dhangadhi", "Tikapur"],
    Kanchanpur: ["Bhimdatta", "Krishnapur"],
  };

  const subCategories = {
    Medicines: ["Expired Medicines", "No Free Medicines", "Low Stock"],
    Hospitals: ["Unavailability of Beds", "Mismanagement", "Poor Hygiene"],
    "Health Post": ["No Staff Available", "Closed During Hours", "No Basic Medicines"],
  };

  // ✅ Fixed Document Picker
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      // Handles both new & old Expo versions
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile({
          name: result.assets[0].name || "Unnamed File",
          uri: result.assets[0].uri,
        });
        Alert.alert("Success", "File uploaded successfully!");
      } else if (result.type === "success") {
        setSelectedFile({
          name: result.name || "Unnamed File",
          uri: result.uri,
        });
        Alert.alert("Success", "File uploaded successfully!");
      }
    } catch (error) {
      console.log("Document Picker Error:", error);
      Alert.alert("Error", "Something went wrong while picking the file.");
    }
  };

  // Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      Alert.alert("Success", "Image uploaded successfully!");
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (!state || !district || !municipality || !ward || !category || !subcategory) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }
    Alert.alert("Success", "Complaint submitted successfully!");
    router.push('./complainSuccess');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.push('./addComplain')} />
        <Text style={styles.headerTitle}>Add Custom Complain</Text>
      </View>

      {/* ✅ Home Button */}
      <TouchableOpacity
        style={{ marginLeft: "auto", marginTop: -44 }}
        onPress={() => router.push('/')}   // Change './home' to your actual home route
      >
        <Ionicons
          name="home"
          size={24}
          color="#007bff"
        />
      </TouchableOpacity>

      {/* State Dropdown */}
      <Text style={styles.label}>State *</Text>
      <Picker
        selectedValue={state}
        onValueChange={(value) => {
          setState(value);
          setDistrict("");
          setMunicipality("");
        }}
        style={styles.input}
      >
        <Picker.Item label="Select State" value="" />
        {stateData.map((item, idx) => (
          <Picker.Item key={idx} label={item} value={item} />
        ))}
      </Picker>

      {/* District Dropdown */}
      {state ? (
        <>
          <Text style={styles.label}>District *</Text>
          <Picker
            selectedValue={district}
            onValueChange={(value) => {
              setDistrict(value);
              setMunicipality("");
            }}
            style={styles.input}
          >
            <Picker.Item label="Select District" value="" />
            {districtData[state].map((item, idx) => (
              <Picker.Item key={idx} label={item} value={item} />
            ))}
          </Picker>
        </>
      ) : null}

      {/* Municipality Dropdown */}
      {district ? (
        <>
          <Text style={styles.label}>Municipality *</Text>
          <Picker
            selectedValue={municipality}
            onValueChange={(value) => setMunicipality(value)}
            style={styles.input}
          >
            <Picker.Item label="Select Municipality" value="" />
            {municipalityData[district].map((item, idx) => (
              <Picker.Item key={idx} label={item} value={item} />
            ))}
          </Picker>
        </>
      ) : null}

      {/* Ward Input */}
      <Text style={styles.label}>Ward No *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Ward Number"
        value={ward}
        onChangeText={setWard}
        keyboardType="numeric"
      />

      {/* Street Input */}
      <Text style={styles.label}>Street Address (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Street Address"
        value={street}
        onChangeText={setStreet}
      />

      {/* Category Picker */}
      <Text style={styles.label}>Category *</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Medicines" value="Medicines" />
        <Picker.Item label="Hospitals" value="Hospitals" />
        <Picker.Item label="Health Post" value="Health Post" />
      </Picker>

      {/* Subcategory Picker */}
      {category ? (
        <>
          <Text style={styles.label}>Subcategory *</Text>
          <Picker
            selectedValue={subcategory}
            onValueChange={(itemValue) => setSubcategory(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Subcategory" value="" />
            {subCategories[category].map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </>
      ) : null}

      {/* File Upload */}
      <Text style={styles.label}>Attach a Document</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text style={styles.uploadText}>📄 Choose File</Text>
      </TouchableOpacity>

      {selectedFile && (
        <View style={styles.fileConfirmationBox}>
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.fileConfirmationText}>
            {selectedFile.name
              ? `Uploaded: ${selectedFile.name}`
              : "✅ File uploaded successfully"}
          </Text>
        </View>
      )}

      {/* Image Upload */}
      <Text style={styles.label}>Attach an Image</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>🖼️ Choose Image</Text>
      </TouchableOpacity>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Complain</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5,
  },
  uploadText: { color: "#fff" },
  fileConfirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  fileConfirmationText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
  imagePreview: { width: 100, height: 100, marginTop: 5, borderRadius: 6 },
  submitButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitText: { color: "#fff", fontWeight: "bold" },
});