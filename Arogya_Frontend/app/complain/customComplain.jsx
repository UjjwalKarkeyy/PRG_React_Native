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
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// ✅ Helper function to guess mime type
const getMimeType = (fileUri) => {
  if (fileUri.endsWith(".png")) return "image/png";
  if (fileUri.endsWith(".jpg") || fileUri.endsWith(".jpeg")) return "image/jpeg";
  if (fileUri.endsWith(".pdf")) return "application/pdf";
  if (fileUri.endsWith(".doc")) return "application/msword";
  if (fileUri.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
};

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    // Province 1
    Morang: ["Biratnagar", "Belbari", "Pathari"],
    Sunsari: ["Inaruwa", "Itahari"],
    Jhapa: ["Birtamod", "Damak"],
    // Province 2
    Parsa: ["Birgunj", "Pokhariya", "Parsagadhi"],
    Bara: ["Kalaiya", "Jitpur Simara", "Kolhabi"],
    Dhanusha: ["Janakpur", "Chhireshwarnath", "Mithila"],
    // Bagmati
    Kathmandu: ["Kathmandu Metro", "Kirtipur", "Tokha"],
    Bhaktapur: ["Bhaktapur Municipality", "Madhyapur Thimi"],
    Lalitpur: ["Lalitpur Metro", "Godawari"],
    // Gandaki
    Kaski: ["Pokhara", "Machhapuchhre"],
    Lamjung: ["Besisahar"],
    // Lumbini
    Rupandehi: ["Butwal", "Devdaha"],
    Dang: ["Ghorahi", "Tulsipur"],
    // Karnali
    Surkhet: ["Birendranagar"],
    Dailekh: ["Narayan Municipality"],
    // Sudurpashchim
    Kailali: ["Dhangadhi", "Tikapur"],
    Kanchanpur: ["Bhimdatta", "Krishnapur"],
  };

  const subCategories = {
    Medicines: ["Expired Medicines", "No Free Medicines", "Low Stock"],
    Hospitals: ["Unavailability of Beds", "Mismanagement", "Poor Hygiene"],
    "Health Post": ["No Staff Available", "Closed During Hours", "No Basic Medicines"],
  };

  // Normalize URI
  const normalizeUri = (uri) => {
    if (!uri) return null;
    return uri.startsWith("file://") ? uri : "file://" + uri;
  };

  // Document Picker
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedFile(result.assets[0]);
        Alert.alert("Success", "File uploaded successfully!");
      }
    } catch (error) {
      console.log("Document Picker Error:", error);
      Alert.alert("Error", "Something went wrong while picking the file.");
    }
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
  const handleSubmit = async () => {
    if (!state || !district || !municipality || !ward || !category || !subcategory || !title || !description) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("state", state);
    formData.append("district", district);
    formData.append("municipality", municipality);
    formData.append("ward_number", Number(ward));
    formData.append("street_address", street);
    formData.append("category", category);
    formData.append("subcategory", subcategory);

    // File Upload
    if (selectedFile) {
      const fileUri = selectedFile.uri;
      const fileName = selectedFile.name || `document_${Date.now()}.pdf`;
      const fileType = selectedFile.mimeType || getMimeType(fileUri);
      
      if (Platform.OS === 'web') {
        // For web platform, create a blob
        try {
          const response = await fetch(fileUri);
          const blob = await response.blob();
          formData.append("file", blob, fileName);
        } catch (error) {
          console.log("File processing error:", error);
          Alert.alert("Error", "Failed to process file for upload");
          return;
        }
      } else {
        // For React Native (Android/iOS)
        formData.append("file", {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      }
    }

    // Image Upload
    if (selectedImage) {
      const imageUri = selectedImage.uri;
      const imageName = selectedImage.fileName || selectedImage.name || `image_${Date.now()}.jpg`;
      const imageType = selectedImage.mimeType || selectedImage.type || getMimeType(imageUri);
      
      if (Platform.OS === 'web') {
        // For web platform, create a blob
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          formData.append("image", blob, imageName);
        } catch (error) {
          console.log("Image processing error:", error);
          Alert.alert("Error", "Failed to process image for upload");
          return;
        }
      } else {
        // For React Native (Android/iOS)
        formData.append("image", {
          uri: imageUri,
          name: imageName,
          type: imageType,
        });
      }
    }

    try {
      console.log("Submitting form data:", {
        hasFile: !!selectedFile,
        hasImage: !!selectedImage,
        fileInfo: selectedFile ? { name: selectedFile.name, type: selectedFile.mimeType } : null,
        imageInfo: selectedImage ? { name: selectedImage.fileName || selectedImage.name, type: selectedImage.mimeType || selectedImage.type } : null
      });

      const response = await axios.post(API_ENDPOINTS.COMPLAINS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      });

      console.log("Upload Success:", response.status);
      Alert.alert("Success", "Complain submitted successfully!");
      router.push("/");
    } catch (error) {
      console.log("Upload Error Details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        } : null
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to submit complain";
      
      Alert.alert("Error", `${errorMessage}. Check console for details.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("./complainAndFeedback")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Complain</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="home" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>

      {/* Title Input */}
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} placeholder="Enter Complain Title" value={title} onChangeText={setTitle} />

      {/* Description Input */}
      <Text style={styles.label}>Description *</Text>
      <TextInput style={styles.input} placeholder="Enter Complain Description" value={description} onChangeText={setDescription} multiline />

      {/* State Dropdown */}
      <Text style={styles.label}>State *</Text>
      <Picker selectedValue={state} onValueChange={(value) => { setState(value); setDistrict(""); setMunicipality(""); }} style={styles.input}>
        <Picker.Item label="Select State" value="" />
        {stateData.map((item, idx) => (
          <Picker.Item key={idx} label={item} value={item} />
        ))}
      </Picker>

      {/* District Dropdown */}
      {state ? (
        <>
          <Text style={styles.label}>District *</Text>
          <Picker selectedValue={district} onValueChange={(value) => { setDistrict(value); setMunicipality(""); }} style={styles.input}>
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
          <Picker selectedValue={municipality} onValueChange={(itemValue) => setMunicipality(itemValue)} style={styles.input}>
            <Picker.Item label="Select Municipality" value="" />
            {municipalityData[district]?.map((item, idx) => (
              <Picker.Item key={idx} label={item} value={item} />
            )) || []}
          </Picker>
        </>
      ) : null}

      {/* Ward Input */}
      <Text style={styles.label}>Ward No *</Text>
      <TextInput style={styles.input} placeholder="Enter Ward Number" value={ward} onChangeText={setWard} keyboardType="numeric" />

      {/* Street Input */}
      <Text style={styles.label}>Street Address (Optional)</Text>
      <TextInput style={styles.input} placeholder="Enter Street Address" value={street} onChangeText={setStreet} />

      {/* Category Picker */}
      <Text style={styles.label}>Category *</Text>
      <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.input}>
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Medicines" value="Medicines" />
        <Picker.Item label="Hospitals" value="Hospitals" />
        <Picker.Item label="Health Post" value="Health Post" />
      </Picker>

      {/* Subcategory Picker */}
      {category ? (
        <>
          <Text style={styles.label}>Subcategory *</Text>
          <Picker selectedValue={subcategory} onValueChange={(itemValue) => setSubcategory(itemValue)} style={styles.input}>
            <Picker.Item label="Select Subcategory" value="" />
            {subCategories[category]?.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            )) || []}
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
          <Text style={styles.fileConfirmationText}>Uploaded: {selectedFile.name || "File selected"}</Text>
        </View>
      )}

      {/* Image Upload */}
      <Text style={styles.label}>Attach an Image</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>🖼️ Choose Image</Text>
      </TouchableOpacity>
      {selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Complain</Text>
      </TouchableOpacity>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    minHeight: 48,
  },
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
  fileConfirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  fileConfirmationText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 8,
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    minHeight: 52,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
