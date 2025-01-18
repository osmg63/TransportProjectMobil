import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // expo-document-picker kullanımı
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Çarpı ikonu için
import { Base1 } from '@env';
import Navbar from '../../navigation/Navbar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPhoto = (jobId) => {
  const [singleFile, setSingleFile] = useState(null);
  const id = jobId.route.params;
  const navigation = useNavigation();  // Hook for navigation

  const openGallery = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Yalnızca fotoğraf türündeki dosyalar
      });

      if (result.canceled) {
        Alert.alert('Dosya Seçilmedi', 'Lütfen geçerli bir dosya seçin');
      } else {
        const file = result.assets[0]; // İlk dosyayı al
        setSingleFile(file);
      }
    } catch (error) {
      console.error('Dosya seçme hatası:', error);
      Alert.alert('Hata', 'Dosya seçme işlemi başarısız oldu');
    }
  };

  // Dosyayı API'ye gönderme işlevi
  const sendToApi = async () => {
    if (!singleFile || !singleFile.uri) {
      Alert.alert('Fotoğraf Seçmediniz', 'Lütfen bir fotoğraf seçin.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwtToken');

      // FormData oluştur
      const formData = new FormData();
      formData.append('id', id.toString()); // 'id' parametresi

      // Dosyayı FormData'ya ekle
      formData.append('photo', {
        uri: singleFile.uri, // Dosyanın URI'si
        type: singleFile.mimeType, // MIME tipi (image/jpeg, application/pdf, vb.)
        name: singleFile.name, // Dosya adı
      });

      // API'ye POST isteği gönder
      const response = await axios.post(
        
        `${Base1}/Job/AddPhotoJobById`, // API adresini güncelleyin
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Dosya gönderimi için gerekli header
            Authorization: `Bearer ${token}`,

          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Başarılı', 'Fotoğraf başarıyla yüklendi');
        navigation.navigate('HomePage'); // Başarılı olduğunda yönlendirme yap
      } else {
        Alert.alert('Hata', 'Fotoğraf yüklenemedi');
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      Alert.alert('Hata', 'Fotoğraf yükleme başarısız oldu');
    }
  };

  // Fotoğrafı iptal etme işlevi
  const cancelPhoto = () => {
    setSingleFile(null); // Seçilen fotoğrafı iptal et
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerMain}>
      {/* Kartın İçeriği */}
      <View style={styles.card}>
        <Text style={styles.title}>Fotoğraf Seçin</Text>

        {/* Fotoğraf Önizlemesi ve Çarpı İkonu */}
        {singleFile && singleFile.uri && singleFile.mimeType.startsWith('image') ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: singleFile.uri }} style={styles.previewImage} />
            {/* Çarpı İkonu */}
            <TouchableOpacity style={styles.cancelIcon} onPress={cancelPhoto}>
              <MaterialCommunityIcons name="close-circle" size={30} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.previewText}>Seçilen fotoğraf yok</Text>
        )}

        {/* Dosya Seçme Butonu */}
        {!singleFile ? (
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Text style={styles.buttonText}>Fotoğraf Seç</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.selectedFileText}>{singleFile.name}</Text> // Seçilen dosyanın adı
        )}

        {/* Dosyayı API'ye Gönderme Butonu */}
        <TouchableOpacity style={styles.button} onPress={sendToApi}>
          <Text style={styles.buttonText}>Tamamla</Text>
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

   
  },
  containerMain: {
    flex: 1,
    justifyContent: 'center', // Başlangıçta üst kısmı hizalar
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding:20
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Android shadow effect
    marginBottom: 20,
    alignItems: 'center', // Card içeriklerini ortalar
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF', // Blue color for buttons
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow effect
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  selectedFileText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  previewText: {
    fontSize: 16,
    color: '#777',
    marginVertical: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  previewImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    resizeMode: 'cover', // Image will maintain aspect ratio and fill the container
  },
  imageContainer: {
    position: 'relative', // Çarpı ikonunun üst üste gelmesini sağlar
    marginBottom: 20,
    width: '100%',
  },
  cancelIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default AddPhoto;
