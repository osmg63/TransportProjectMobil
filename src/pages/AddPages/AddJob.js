import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Base1 } from '@env';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Navbar from '../../navigation/Navbar';
import { Ionicons } from '@expo/vector-icons';  // Ionicons'tan geri ikonu alıyoruz
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';  // useNavigation hook'ua

const AddJob = ( ) => {
  const navigation = useNavigation();  // useNavigation ile navigation'a erişim sağlıyoruz.
    const [user, setUser] = useState(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);

  const [jobDetails, setJobDetails] = useState({
    jobName: '',
    jobDescription: '',
    jobPrice: '',
    jobDate: new Date(),
    userId: 0,
    isActive: true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const today = new Date();  // Bugünün tarihi
  today.setHours(0, 0, 0, 0); 
  const [departure, setDeparture] = useState({
    city: 0,
    district: 0,
    neighborhood: 0,
    districts: [],
    neighborhoods: [],
  });

  const [destination, setDestination] = useState({
    city: 0,
    district: 0,
    neighborhood: 0,
    districts: [],
    neighborhoods: [],
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      const token = await AsyncStorage.getItem('jwtToken');

      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        setUser(userInfo);
        const response = await axios.get(`${Base1}/Address/GetAllCity`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setCities(response.data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const fetchDistricts = async (cityId, type) => {
    const token = await AsyncStorage.getItem('jwtToken');

    try {
      const response = await axios.get(`${Base1}/Address/GetAllDistrictByCityId/${cityId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (type === 'departure') {
        setDeparture((prev) => ({
          ...prev,
          city: cityId,
          district: 0,
          neighborhood: 0,
          districts: response.data || [],
          neighborhoods: [],
        }));
      } else if (type === 'destination') {
        setDestination((prev) => ({
          ...prev,
          city: cityId,
          district: 0,
          neighborhood: 0,
          districts: response.data || [],
          neighborhoods: [],
        }));
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchNeighborhoods = async (districtId, type) => {
    const token = await AsyncStorage.getItem('jwtToken');

    try {
      const response = await axios.get(
        `${Base1}/Address/GetAllNeighborhoodByDistrictId/${districtId}`
        , {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      if (type === 'departure') {
        setDeparture((prev) => ({
          ...prev,
          district: districtId,
          neighborhood: 0,
          neighborhoods: response.data || [],
        }));
      } else if (type === 'destination') {
        setDestination((prev) => ({
          ...prev,
          district: districtId,
          neighborhood: 0,
          neighborhoods: response.data || [],
        }));
      }
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const handleAddJob = async () => {
    const userInfoString = await AsyncStorage.getItem('userInfo');
    const token = await AsyncStorage.getItem('jwtToken');

    const userInfo = JSON.parse(userInfoString);
    const payload = {
      createJob: {
        jobName: jobDetails.jobName,
        jobDescription: jobDetails.jobDescription,
        jobPrice: jobDetails.jobPrice,
        jobDate: jobDetails.jobDate,
        userId: user.id,
        isActive: jobDetails.isActive,
      },
      departure: {
        cityId: Number(departure.city),
        districtId: Number(departure.district),
        neighborhoodId: Number(departure.neighborhood),
      },
      destination: {
        cityId: Number(destination.city),
        districtId: Number(destination.district),
        neighborhoodId: Number(destination.neighborhood),
      },
    };

    try {
      const response = await axios.post(`${Base1}/Job/AddJob`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
      });
      if (response.status === 200) {
        Alert.alert(
          'Başarılı',
          'İş başarıyla eklendi.Fotoğraf eklemek ister misiniz?',
          [
            {
              text: 'Yes',
              onPress: () => navigation.navigate('AddPhoto',response.data.id), // Fotoğraf ekleme sayfasına yönlendir
            },
            {
              text: 'No',
              onPress: () => navigation.navigate('HomePage'), // Ana sayfaya yönlendir
            },
          ],
          { cancelable: false }
        );
        } else {
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Geri butonu */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>

        {/* Başlık */}
        <Text style={styles.heading}>İş Ekle</Text>
      </View>
    <ScrollView style={styles.containerScroll}
      contentContainerStyle={styles.scrollContentContainer}
    >
        

      <TextInput
        style={styles.input}
        placeholder="Başlık"
        value={jobDetails.jobName}
        onChangeText={(text) => setJobDetails({ ...jobDetails, jobName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Açıklama"
        value={jobDetails.jobDescription}
        onChangeText={(text) => setJobDetails({ ...jobDetails, jobDescription: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Fiyat"
        value={jobDetails.jobPrice}
        keyboardType="numeric"
        onChangeText={(text) => setJobDetails({ ...jobDetails, jobPrice: text })}
      />

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>
          Tarih Seç
          {jobDetails.jobDate ? ` ${new Date(jobDetails.jobDate).toLocaleDateString()}` : ' Seçilen Tarih Yok'}
        </Text>

      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={jobDetails.jobDate ? new Date(jobDetails.jobDate) : new Date()}
          mode="date"
          minimumDate={today}
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              // Seçilen tarihi ISO formatına dönüştür
              const formattedDate = selectedDate.toISOString(); // ISO formatında tarih
              setJobDetails({ ...jobDetails, jobDate: formattedDate });
            }
          }}
        />
      )}

      <Text style={styles.subHeading}>Kalkış Adresiniz</Text>
      <Picker
        selectedValue={departure.city}
        onValueChange={(itemValue) => fetchDistricts(itemValue, 'departure')}
        style={styles.picker}
      >
        <Picker.Item label="Şehir Seçiniz" value={0} />
        {cities.map((city) => (
          <Picker.Item key={city.id} label={city.cityName} value={city.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={departure.district}
        onValueChange={(itemValue) => fetchNeighborhoods(itemValue, 'departure')}
        style={styles.picker}
      >
        <Picker.Item label="İlçe Seçiniz" value={0} />
        {departure.districts.map((district) => (
          <Picker.Item key={district.id} label={district.districtName} value={district.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={departure.neighborhood}
        onValueChange={(itemValue) => setDeparture((prev) => ({ ...prev, neighborhood: itemValue }))}
        style={styles.picker}
      >
        <Picker.Item label="Semt Seçiniz" value={0} />
        {departure.neighborhoods.map((neighborhood) => (
          <Picker.Item key={neighborhood.id} label={neighborhood.neighborhoodName} value={neighborhood.id} />
        ))}
      </Picker>

      <Text style={styles.subHeading}>Varış Noktası</Text>
      <Picker
        selectedValue={destination.city}
        onValueChange={(itemValue) => fetchDistricts(itemValue, 'destination')}
        style={styles.picker}
      >
        <Picker.Item label="Şehir Seçiniz" value={0} />
        {cities.map((city) => (
          <Picker.Item key={city.id} label={city.cityName} value={city.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={destination.district}
        onValueChange={(itemValue) => fetchNeighborhoods(itemValue, 'destination')}
        style={styles.picker}
      >
        <Picker.Item label="İlçe Seçiniz" value={0} />
        {destination.districts.map((district) => (
          <Picker.Item key={district.id} label={district.districtName} value={district.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={destination.neighborhood}
        onValueChange={(itemValue) => setDestination((prev) => ({ ...prev, neighborhood: itemValue }))}
        style={styles.picker}
      >
        <Picker.Item label="Semt Seçiniz" value={0} />
        {destination.neighborhoods.map((neighborhood) => (
          <Picker.Item key={neighborhood.id} label={neighborhood.neighborhoodName} value={neighborhood.id} />
        ))}
      </Picker>

      <Button title="Add Job" onPress={handleAddJob} />
    </ScrollView>
    {!isKeyboardVisible && (
            <View style={styles.navbarContainer}>
              <Navbar />
            </View>
          )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '8%',
  },
  containerScroll: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',     
  },
  scrollContentContainer: {
    paddingBottom: 100,  
  }, 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    paddingLeft:'30%',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',

  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#444', // Alt başlıklar için biraz daha açık renk
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8, // Yuvarlak köşeler
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff', // Beyaz arka plan
  },
  datePickerButton: {
    padding: 15,
    backgroundColor: '#6200ea', // Mor renk
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center', // Butonun içeriğini ortalar
  },
  datePickerText: {
    color: '#fff', // Buton metni beyaz
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#4CAF50', // Yeşil buton rengi
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center', // Butonun içeriğini ortalar
  },
  buttonText: {
    color: '#fff', // Buton metni beyaz
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerItem: {
    fontSize: 16,
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  photoButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButton: {
    color: '#fff',
    fontSize: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8, // Görseli yuvarlak kenarlı yapar
  },
});


export default AddJob;
