import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CustomFeedback() {
  const router = useRouter();

  // States
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [rating, setRating] = useState(null);
  const [remarks, setRemarks] = useState("");
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

  // Image Picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to media library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      Alert.alert("Success", "Image uploaded successfully!");
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (!state || !district || !municipality || !ward || !category || !subcategory || !rating) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }
    Alert.alert("Success", "Feedback submitted successfully!");
    router.push('/feedback/feedbackSuccess');
  };

  return (
    <ScrollView style={styles.container}>
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
            {districtData[state]?.map((item, idx) => (
              <Picker.Item key={idx} label={item} value={item} />
            )) || []}
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
            {municipalityData[district]?.map((item, idx) => (
              <Picker.Item key={idx} label={item} value={item} />
            )) || []}
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
            {subCategories[category]?.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            )) || []}
          </Picker>
        </>
      ) : null}

      {/* Satisfaction Rating */}
      <Text style={styles.label}>Satisfaction Level *</Text>
      <View style={styles.ratingContainer}>
        {["😡", "😕", "😐", "😊", "😍"].map((emoji, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(index + 1)}
            style={[
              styles.emojiButton,
              rating === index + 1 && { backgroundColor: "#007bff" },
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Remarks */}
      <Text style={styles.label}>Remarks (Optional)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        placeholder="Write your feedback here..."
        value={remarks}
        onChangeText={setRemarks}
        multiline
      />

      {/* Image Upload */}
      <Text style={styles.label}>Attach an Image (Optional)</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>🖼️ Choose Image</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image 
          source={{ uri: selectedImage.uri }} 
          style={styles.imagePreview}
          onError={(error) => {
            console.log('Image load error:', error);
            Alert.alert('Error', 'Failed to load image preview');
          }}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Feedback</Text>
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
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  emojiButton: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  emoji: { fontSize: 24 },
  submitButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitText: { color: "#fff", fontWeight: "bold" },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    minHeight: 48,
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 8,
    resizeMode: "cover",
  },
});
