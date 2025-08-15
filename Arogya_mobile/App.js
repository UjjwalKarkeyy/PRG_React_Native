import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// API service functions
const apiService = {
  async fetchDoctors(searchParams = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.search) queryParams.append('search', searchParams.search);
      if (searchParams.specialty && searchParams.specialty !== 'All') {
        queryParams.append('specialty', searchParams.specialty);
      }
      
      const url = `${API_BASE_URL}/doctors${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.data.doctors : [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return getFallbackDoctors();
    }
  },

  async fetchSpecialties() {
    try {
      const response = await fetch(`${API_BASE_URL}/specialties`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const specialties = data.success ? data.data.specialties : [];
      return ['All', ...specialties.map(s => s.name)];
    } catch (error) {
      console.error('Error fetching specialties:', error);
      return ['All', 'Cardiologist', 'Pediatrician', 'Orthopedic Surgeon', 'Dermatologist', 'Neurologist'];
    }
  }
};

// Fallback doctors data
const getFallbackDoctors = () => [
  {
    id: '1',
    name: 'Dr. Anil Thapa',
    specialty: 'Cardiologist',
    hospital: 'Norvic International Hospital',
    location: 'Thapathali, Kathmandu',
    opdTime: '9:00 AM - 1:00 PM',
    qualifications: ['MBBS', 'MD - Cardiology', 'FACC'],
    languages: ['English', 'Nepali', 'Hindi'],
    experience: 15,
    rating: 4.8,
    consultationFee: 'Rs. 1500',
    avatar: '👨‍⚕️',
    bio: 'Dr. Anil Thapa is a highly experienced cardiologist with over 15 years of experience.',
    additionalInfo: 'Dr. Thapa has been recognized as one of the top cardiologists in Nepal.'
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    hospital: 'Grande International Hospital',
    location: 'Dhapasi, Kathmandu',
    opdTime: '2:00 PM - 6:00 PM',
    qualifications: ['MBBS', 'MD - Pediatrics', 'FRCPC'],
    languages: ['English', 'Nepali', 'Hindi'],
    experience: 12,
    rating: 4.9,
    consultationFee: 'Rs. 1200',
    avatar: '👩‍⚕️',
    bio: 'Dr. Priya Sharma is a renowned pediatrician with extensive experience in treating children.',
    additionalInfo: 'Dr. Sharma has been awarded multiple times for her contributions to pediatric care.'
  },
  {
    id: '3',
    name: 'Dr. Rajesh Khadka',
    specialty: 'Orthopedic Surgeon',
    hospital: 'Nepal Orthopedic Hospital',
    location: 'Jorpati, Kathmandu',
    opdTime: '10:00 AM - 2:00 PM',
    qualifications: ['MBBS', 'MS - Orthopedics'],
    languages: ['English', 'Nepali'],
    experience: 18,
    rating: 4.7,
    consultationFee: 'Rs. 1800',
    avatar: '👨‍⚕️',
    bio: 'Dr. Rajesh Khadka specializes in orthopedic surgery with a focus on joint replacement.',
    additionalInfo: 'Dr. Khadka has performed over 2000 successful joint replacement surgeries.'
  },
  {
    id: '4',
    name: 'Dr. Sunita Maharjan',
    specialty: 'Dermatologist',
    hospital: 'Civil Service Hospital',
    location: 'Minbhawan, Kathmandu',
    opdTime: '11:00 AM - 3:00 PM',
    qualifications: ['MBBS', 'MD - Dermatology'],
    languages: ['English', 'Nepali', 'Newari'],
    experience: 10,
    rating: 4.6,
    consultationFee: 'Rs. 1000',
    avatar: '👩‍⚕️',
    bio: 'Dr. Sunita Maharjan is a skilled dermatologist specializing in skin disorders.',
    additionalInfo: 'Dr. Maharjan is known for her expertise in treating complex skin conditions.'
  },
  {
    id: '5',
    name: 'Dr. Bikash Shrestha',
    specialty: 'Neurologist',
    hospital: 'Annapurna Neurological Institute',
    location: 'Maitighar, Kathmandu',
    opdTime: '8:00 AM - 12:00 PM',
    qualifications: ['MBBS', 'DM - Neurology'],
    languages: ['English', 'Nepali'],
    experience: 14,
    rating: 4.8,
    consultationFee: 'Rs. 2000',
    avatar: '👨‍⚕️',
    bio: 'Dr. Bikash Shrestha is a leading neurologist with expertise in treating neurological disorders.',
    additionalInfo: 'Dr. Shrestha has been instrumental in establishing advanced neurological care in Nepal.'
  }
];

export default function App() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [specialties, setSpecialties] = useState(['All']);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [doctorsData, specialtiesData] = await Promise.all([
          apiService.fetchDoctors(),
          apiService.fetchSpecialties()
        ]);
        
        setAllDoctors(doctorsData);
        setDoctors(doctorsData);
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error('Error loading data:', error);
        const fallbackDoctors = getFallbackDoctors();
        setAllDoctors(fallbackDoctors);
        setDoctors(fallbackDoctors);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = allDoctors;

    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doctor => 
        doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase().trim();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.hospital.toLowerCase().includes(searchTerm) ||
        doctor.location.toLowerCase().includes(searchTerm) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(searchTerm)) ||
        (doctor.qualifications && doctor.qualifications.some(q => 
          q.toLowerCase().includes(searchTerm)
        )) ||
        (doctor.languages && doctor.languages.some(l => 
          l.toLowerCase().includes(searchTerm)
        ))
      );
    }

    setDoctors(filtered);
  }, [searchText, selectedSpecialty, allDoctors]);

  const handleSpecialtyPress = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => setSelectedDoctor(item)}
    >
      <View style={styles.doctorCardHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <Text style={styles.hospital}>{item.hospital}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.ratingStar}>⭐</Text>
        </View>
      </View>
      <View style={styles.doctorCardFooter}>
        <Text style={styles.consultationFee}>{item.consultationFee}</Text>
        <Text style={styles.opdTime}>{item.opdTime}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSpecialtyChip = (specialty) => (
    <TouchableOpacity
      key={specialty}
      style={[
        styles.filterChip,
        selectedSpecialty === specialty && styles.filterChipActive
      ]}
      onPress={() => handleSpecialtyPress(specialty)}
    >
      <Text style={[
        styles.filterChipText,
        selectedSpecialty === specialty && styles.filterChipTextActive
      ]}>
        {specialty}
      </Text>
    </TouchableOpacity>
  );

  if (selectedDoctor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileHeaderBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedDoctor(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.profileHeaderTitle}>Doctor Profile</Text>
        </View>

        <ScrollView style={styles.profileContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatarContainer}>
              <Text style={styles.profileAvatar}>{selectedDoctor.avatar}</Text>
            </View>
            <Text style={styles.profileName}>{selectedDoctor.name}</Text>
            <Text style={styles.profileSpecialty}>{selectedDoctor.specialty}</Text>
            <View style={styles.profileRatingContainer}>
              <Text style={styles.profileRating}>{selectedDoctor.rating}</Text>
              <Text style={styles.profileRatingStar}>⭐</Text>
              <Text style={styles.profileExperience}>{selectedDoctor.experience} years exp</Text>
            </View>
          </View>

          <View style={styles.quickInfoContainer}>
            <View style={styles.quickInfoCard}>
              <Text style={styles.quickInfoTitle}>Hospital</Text>
              <Text style={styles.quickInfoValue}>{selectedDoctor.hospital}</Text>
            </View>
            <View style={styles.quickInfoCard}>
              <Text style={styles.quickInfoTitle}>Fee</Text>
              <Text style={styles.quickInfoValue}>{selectedDoctor.consultationFee}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionContent}>{selectedDoctor.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <View style={styles.qualificationsContainer}>
              {selectedDoctor.qualifications?.map((qualification, index) => (
                <View key={index} style={styles.qualificationChip}>
                  <Text style={styles.qualificationText}>{qualification}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.sectionContent}>{selectedDoctor.languages?.join(', ')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Timing</Text>
            <Text style={styles.sectionContent}>{selectedDoctor.location}</Text>
            <Text style={styles.sectionSubContent}>OPD Time: {selectedDoctor.opdTime}</Text>
          </View>

          {isExpanded && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <Text style={styles.sectionContent}>{selectedDoctor.additionalInfo}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.expandButtonText}>
              {isExpanded ? 'Show Less' : 'Show More'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctor Directory</Text>
        <Text style={styles.headerSubtitle}>Find the right healthcare professional</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors, hospitals, or specialties..."
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Specialty:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
          {specialties.map(renderSpecialtyChip)}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      ) : (
        <>
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          {doctors.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No doctors found</Text>
              <Text style={styles.noResultsSubText}>
                {searchText.trim() ? `No results for "${searchText}"` : `No ${selectedSpecialty} specialists found`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={doctors}
              keyExtractor={(item) => item.id}
              renderItem={renderDoctorCard}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  filterScrollContainer: {
    paddingHorizontal: 15,
  },
  filterChip: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterChipActive: {
    backgroundColor: '#3498db',
  },
  filterChipText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
    marginTop: 10,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  resultsText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatar: {
    fontSize: 30,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 4,
  },
  hospital: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#95a5a6',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  ratingStar: {
    fontSize: 16,
    marginTop: 2,
  },
  doctorCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  consultationFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  opdTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Profile Styles
  profileHeaderBar: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    marginRight: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    fontSize: 50,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  profileSpecialty: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 10,
  },
  profileRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileRatingStar: {
    fontSize: 16,
    marginLeft: 5,
  },
  profileExperience: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 10,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickInfoTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  quickInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  sectionSubContent: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 5,
  },
  qualificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qualificationChip: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  qualificationText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
  },
  expandButton: {
    backgroundColor: '#3498db',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  expandButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
