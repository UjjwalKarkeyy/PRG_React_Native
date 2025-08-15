import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Dimensions 
} from 'react-native';

const DoctorProfileScreen = ({ route }) => {
  const { doctor } = route.params;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hospital</Text>
        <Text style={styles.sectionContent}>{doctor.hospital}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OPD Time</Text>
        <Text style={styles.sectionContent}>{doctor.opdTime}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Qualifications</Text>
        <Text style={styles.sectionContent}>
          {doctor.qualifications.join(', ')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages Spoken</Text>
        <Text style={styles.sectionContent}>
          {doctor.languages.join(', ')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.sectionContent}>
          {doctor.experience} years
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating</Text>
        <Text style={styles.sectionContent}>
          {doctor.rating} ⭐
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.sectionContent}>{doctor.bio}</Text>
      </View>

      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.expandButtonText}>
          {isExpanded ? 'View Less' : 'View More'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.sectionContent}>{doctor.additionalInfo}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  expandButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  expandButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorProfileScreen;
