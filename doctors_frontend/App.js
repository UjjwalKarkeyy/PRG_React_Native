import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://localhost:8000/api';

// API functions
const api = {
  fetchDoctors: async () => {
    console.log('Fetching doctors from:', `${API_BASE_URL}/doctors/`);
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/`);
      console.log('Doctors response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Doctors data received:', responseData);
      
      // Handle the success/data format
      if (responseData && responseData.success && responseData.data) {
        const data = responseData.data;
        // If data is an array, return it directly
        if (Array.isArray(data)) {
          return data;
        }
        // If data is an object, check for common patterns
        if (typeof data === 'object') {
          // Check for nested results array
          if (data.results && Array.isArray(data.results)) {
            return data.results;
          }
          // Check for any array in the data object
          const possibleArray = Object.values(data).find(Array.isArray);
          if (possibleArray) {
            return possibleArray;
          }
        }
      }
      
      console.warn('Unexpected API response format for doctors:', responseData);
      return [];
    } catch (error) {
      console.error('Error in fetchDoctors:', error);
      throw error;
    }
  },

  fetchSpecialties: async () => {
    console.log('Fetching specialties from:', `${API_BASE_URL}/specialties/`);
    try {
      const response = await fetch(`${API_BASE_URL}/specialties/`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Specialties data received:', responseData);
      
      // Handle the success/data format
      if (responseData && responseData.success && responseData.data) {
        const data = responseData.data;
        
        // If data is an array, process it directly
        if (Array.isArray(data)) {
          return data.map(item => ({
            id: item.id || item.pk,
            name: item.name || item.specialty_name || 'Unnamed Specialty'
          }));
        }
        
        // If data is an object, check for common patterns
        if (typeof data === 'object') {
          // Check for nested results array
          if (data.results && Array.isArray(data.results)) {
            return data.results.map(item => ({
              id: item.id || item.pk,
              name: item.name || item.specialty_name || 'Unnamed Specialty'
            }));
          }
          
          // Check for any array in the data object
          const possibleArray = Object.values(data).find(Array.isArray);
          if (possibleArray) {
            return possibleArray.map(item => ({
              id: item.id || item.pk,
              name: item.name || item.specialty_name || 'Unnamed Specialty'
            }));
          }
        }
      }
      
      console.warn('Unexpected API response format for specialties:', data);
      return [];
    } catch (error) {
      console.error('Error in fetchSpecialties:', error);
      return [];
    }
  }
};

// Components
const LoadingSpinner = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3498db" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search doctors by name or specialty..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      onSubmitEditing={onSearch}
    />
    <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
      <Text style={styles.searchButtonText}>Search</Text>
    </TouchableOpacity>
  </View>
);

const SpecialtyFilter = ({ specialties, selectedSpecialty, onSpecialtySelect }) => {
  // Ensure specialties is always an array
  const safeSpecialties = Array.isArray(specialties) ? specialties : [];
  
  console.log('SpecialtyFilter props:', {
    specialties,
    safeSpecialties,
    selectedSpecialty,
    hasOnSpecialtySelect: !!onSpecialtySelect
  });
  
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter by Specialty:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterChip, selectedSpecialty === null && styles.filterChipActive]}
          onPress={() => onSpecialtySelect && onSpecialtySelect(null)}
        >
          <Text style={[styles.filterChipText, selectedSpecialty === null && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {safeSpecialties.map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            style={[styles.filterChip, selectedSpecialty === specialty.id && styles.filterChipActive]}
            onPress={() => onSpecialtySelect && onSpecialtySelect(specialty.id)}
          >
            <Text style={[styles.filterChipText, selectedSpecialty === specialty.id && styles.filterChipTextActive]}>
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const DoctorCard = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.doctorCard} onPress={() => onPress(doctor)}>
    <View style={styles.doctorCardHeader}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={30} color="#3498db" />
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty_name || doctor.specialty?.name || 'General Practitioner'}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>
            {doctor.rating ? parseFloat(doctor.rating).toFixed(1) : '4.5'} ({doctor.reviews || '100+'})
          </Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Rs. {doctor.price || 500}</Text>
        <Text style={styles.perSessionText}>per session</Text>
      </View>
    </View>
    <View style={styles.doctorCardFooter}>
      <Text style={styles.opdTime}>{doctor.opd_time || 'Mon-Fri 9AM-5PM'}</Text>
    </View>
  </TouchableOpacity>
);

const NoResults = ({ message }) => (
  <View style={styles.noResultsContainer}>
    <Text style={styles.noResultsText}>No Results Found</Text>
    <Text style={styles.noResultsSubText}>{message}</Text>
  </View>
);

const DoctorDetailsModal = ({ visible, doctor, onClose, onBookAppointment }) => {
  if (!doctor) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Doctor Details</Text>
          <View style={styles.closeButton} />
        </View>
        
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.doctorDetailHeader}>
            <View style={styles.modalAvatarContainer}>
              <Ionicons name="person" size={50} color="#3498db" />
            </View>
            <View style={styles.doctorDetailInfo}>
              <Text style={styles.doctorDetailName}>{doctor.name}</Text>
              <Text style={styles.doctorDetailSpecialty}>
                {doctor.specialty_name || doctor.specialty?.name || 'General Practitioner'}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>
                  {doctor.rating ? parseFloat(doctor.rating).toFixed(1) : '4.5'} ({doctor.reviews || '100+'})
                </Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>Rs. {doctor.price || 500}</Text>
              <Text style={styles.perSessionText}>per session</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Specialty:</Text>
              <Text style={styles.detailValue}>
                {doctor.specialty_name || doctor.specialty?.name || 'General Practitioner'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hospital:</Text>
              <Text style={styles.detailValue}>
                {doctor.hospital || 'Not specified'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>OPD Time:</Text>
              <Text style={styles.detailValue}>
                {doctor.opd_time || 'Mon-Fri 9AM-5PM'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Qualifications:</Text>
              <Text style={styles.detailValue}>
                {doctor.qualifications || 'MBBS, MD'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Languages:</Text>
              <Text style={styles.detailValue}>
                {doctor.languages || 'English, Hindi'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Experience:</Text>
              <Text style={styles.detailValue}>
                {doctor.experience_years || 0} years
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rating:</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.detailValue}>
                  {doctor.rating ? parseFloat(doctor.rating).toFixed(1) : '4.5'} out of 5
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bio:</Text>
              <Text style={styles.detailValue}>
                {doctor.bio || 'Experienced medical professional dedicated to providing quality healthcare services.'}
              </Text>
            </View>

            {doctor.phone && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{doctor.phone}</Text>
              </View>
            )}

            {doctor.email && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{doctor.email}</Text>
              </View>
            )}

            {doctor.address && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>{doctor.address}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={() => onBookAppointment(doctor)}>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const AppointmentBookingModal = ({ visible, doctor, onClose }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '17:00', label: '5:00 PM' },
  ];

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientAge: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: ''
    });
    setAvailableSlots([]);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fetchAvailableSlots = async (date) => {
    if (!doctor || !date) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/available-slots/${doctor.id}/?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.data.available_slots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, appointmentDate: date, appointmentTime: '' }));
    
    // Only fetch slots if date is in valid format (YYYY-MM-DD) and complete
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
      fetchAvailableSlots(date);
    } else {
      setAvailableSlots([]); // Clear slots for incomplete dates
    }
  };

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.patientPhone || !formData.patientAge || 
        !formData.appointmentDate || !formData.appointmentTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor: doctor.id,
          patient_name: formData.patientName,
          patient_phone: formData.patientPhone,
          patient_email: formData.patientEmail,
          patient_age: parseInt(formData.patientAge),
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          reason: formData.reason
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        Alert.alert('Success', 'Appointment booked successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!doctor) return null;

  if (success) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#27ae60" />
            <Text style={styles.successTitle}>Appointment Booked!</Text>
            <Text style={styles.successMessage}>
              Your appointment with Dr. {doctor.name} has been successfully booked.
            </Text>
            <TouchableOpacity style={styles.successButton} onPress={handleClose}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Book Appointment</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.doctorSummary}>
            <View style={styles.modalAvatarContainer}>
              <Ionicons name="person" size={40} color="#3498db" />
            </View>
            <View style={styles.doctorSummaryInfo}>
              <Text style={styles.doctorSummaryName}>Dr. {doctor.name}</Text>
              <Text style={styles.doctorSummarySpecialty}>
                {doctor.specialty_name || doctor.specialty?.name}
              </Text>
              <Text style={styles.doctorSummaryPrice}>Rs. {doctor.price || 500}</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientName: text }))}
                placeholder="Enter patient name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientPhone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientPhone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientEmail}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientEmail: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.patientAge}
                onChangeText={(text) => setFormData(prev => ({ ...prev, patientAge: text }))}
                placeholder="Enter age"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Appointment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.appointmentDate}
                onChangeText={handleDateChange}
                placeholder={`YYYY-MM-DD (min: ${getTomorrowDate()})`}
              />
            </View>

            {availableSlots.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Available Time Slots *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsContainer}>
                  {availableSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot.value}
                      style={[
                        styles.timeSlot,
                        formData.appointmentTime === slot.value && styles.timeSlotSelected
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, appointmentTime: slot.value }))}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        formData.appointmentTime === slot.value && styles.timeSlotTextSelected
                      ]}>
                        {slot.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason for Visit</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.reason}
                onChangeText={(text) => setFormData(prev => ({ ...prev, reason: text }))}
                placeholder="Describe your symptoms or reason for visit"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.bookButton, loading && styles.bookButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main App Component
export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Starting to load data...');
      
      // Fetch both doctors and specialties in parallel
      const [doctorsResponse, specialtiesResponse] = await Promise.all([
        api.fetchDoctors(),
        api.fetchSpecialties()
      ]);

      // Process doctors data
      let doctorsData = [];
      if (doctorsResponse && Array.isArray(doctorsResponse.data)) {
        doctorsData = doctorsResponse.data;
      } else if (Array.isArray(doctorsResponse)) {
        doctorsData = doctorsResponse;
      }
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);

      // Process specialties data
      let specialtiesData = [];
      if (specialtiesResponse && Array.isArray(specialtiesResponse.data)) {
        specialtiesData = specialtiesResponse.data.map(s => ({
          id: s.id || s.specialty_id,
          name: s.name || s.specialty_name
        }));
      } else if (Array.isArray(specialtiesResponse)) {
        specialtiesData = specialtiesResponse.map(s => ({
          id: s.id || s.specialty_id,
          name: s.name || s.specialty_name
        }));
      }
      setSpecialties(Array.isArray(specialtiesData) ? specialtiesData : []);
      
      console.log('Data loading completed');
      console.log('Doctors count:', Array.isArray(doctorsData) ? doctorsData.length : 0);
      console.log('Specialties count:', Array.isArray(specialtiesData) ? specialtiesData.length : 0);
      
    } catch (error) {
      console.error('Unexpected error in loadData:', error);
      Alert.alert('Error', 'An unexpected error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    if (!Array.isArray(doctors)) {
      setFilteredDoctors([]);
      return;
    }

    let filtered = [...doctors];

    // Filter by specialty if selected
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => {
        const specialtyId = doctor.specialty_id || doctor.specialty?.id;
        return specialtyId === selectedSpecialty;
      });
    }

    // Filter by search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(doctor => {
        const name = doctor.name || '';
        const specialtyName = doctor.specialty_name || doctor.specialty?.name || '';
        
        return (
          name.toLowerCase().includes(query) ||
          specialtyName.toLowerCase().includes(query)
        );
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleSearch = () => {
    filterDoctors();
  };

  const handleSpecialtySelect = (specialtyId) => {
    setSelectedSpecialty(specialtyId);
  };

  const handleDoctorPress = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(false);
    setBookingModalVisible(true);
  };

  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
    setSelectedDoctor(null);
  };

  const renderDoctorItem = ({ item }) => <DoctorCard doctor={item} onPress={handleDoctorPress} />;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Arogya Doctors</Text>
          <Text style={styles.headerSubtitle}>Find the best doctors near you</Text>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arogya Doctors</Text>
        <Text style={styles.headerSubtitle}>Find the best doctors near you</Text>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <SpecialtyFilter
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSpecialtySelect={handleSpecialtySelect}
      />

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {filteredDoctors.length === 0 ? (
        <NoResults message="Try adjusting your search criteria or filters" />
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <DoctorDetailsModal
        visible={modalVisible}
        doctor={selectedDoctor}
        onClose={handleCloseModal}
        onBookAppointment={handleBookAppointment}
      />

      <AppointmentBookingModal
        visible={bookingModalVisible}
        doctor={selectedDoctor}
        onClose={handleCloseBookingModal}
      />
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  searchButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
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
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
  doctorSpecialty: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  perSessionText: {
    fontSize: 12,
    color: '#7f8c8d',
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  doctorDetailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  doctorDetailInfo: {
    flex: 1,
  },
  doctorDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  doctorDetailSpecialty: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  // Appointment Booking Modal styles
  doctorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doctorSummaryInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorSummaryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  doctorSummarySpecialty: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 4,
  },
  doctorSummaryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  formSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  slotsContainer: {
    marginTop: 8,
  },
  timeSlot: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  timeSlotSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  successButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
