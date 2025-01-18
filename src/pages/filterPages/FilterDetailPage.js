import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView,Image, TouchableOpacity, Linking } from 'react-native';
import { Card } from "react-native-paper";
import axios from 'axios'; // Axios için import
import { Base1 } from '@env';
import Icon from "react-native-vector-icons/MaterialIcons"; // İkon için import
import Navbar from "../../navigation/Navbar"; // Navbar import
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailPage = ({ route }) => {
  const { item } = route.params;
  const [user, setUser] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const[isOffer,setisOffer]=useState(Boolean)
  const navigation = useNavigation();
  useEffect(() => {
    // Kullanıcı ve araç bilgilerini API üzerinden almak
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('jwtToken');

      try {
        const userResponse = await axios.get(`${Base1}/User/GetById/${item.userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

      } catch (error) {
        console.error('Kullanıcı verisi alınamadı:', error);
      }
      try {
        const vehicleResponse = await axios.get(`${Base1}/Vehicle/GetByUserIdVehicles/${item.userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setVehicle(vehicleResponse.data);
      } catch (error) {
        console.error('Araç verisi alınamadı:', error);
      }
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
      
        const offerResponse = await fetch(`${Base1}/Offer/GetUserOfferJob/${userInfo.id}/${item.id}`, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            Authorization: `Bearer ${token}`,

          },
        });
      
        if (!offerResponse.ok) {
          throw new Error('API isteği başarısız oldu');
        }
      
        // Yanıtı JSON formatında çözümle
        const data = await offerResponse.json();
      
        // Eğer yanıt true ise setisOffer(true) yap, yoksa setisOffer(false) yap
        if (data === true) {
          setisOffer(true);
        } else {
          setisOffer(false);
        }

      
      } catch (error) {
        console.error('Hata:', error);
      }
    };
    if (item.userId) {
      fetchUserData();
    }

    if (item.userId) {
      fetchUserData();
    }
    }, [item]);
    const makePhoneCall = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl);
  };
  const handleOfferButton = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      // Retrieve user information from AsyncStorage
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);

      const requestPayload = {
        jobId: item.id, // Ensure `item` is defined
        userId: userInfo.id,
        isActive: true,
        offerTime: new Date().toISOString(),
      };
      const response = await axios.post(`${Base1}/Offer/AddOffer`, requestPayload, {
        headers: {
          'Accept': '*/*',
          Authorization: `Bearer ${token}`,

        },
      });
          if (response.status === 200) {
            const messageData = {
              description: `Merhabalar hala boş musunuz?`,
              userSenderId: userInfo.id,
              userRecipientId: item.userId,
              isRead: true,
              createTime: new Date().toISOString(),
            };
        
            try {
              const response = await axios.post(
                `${Base1}/Message/AddMessage`,
                messageData,
                {
                  headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                }
              );         
            } catch (error) {
              console.error('Mesaj gönderme hatası:', error);
            }

        alert('İşe teklif gönderildi ve mesajınız iletildi');
      } else {
        alert('Beklenmeyen bir hata oluştu.');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Teklif gönderilemedi:', error);
      alert('Teklif gönderilirken bir hata oluştu.');
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerScroll}>
      {/* İş Bilgileri */}
      <Card style={styles.card}>
      {<Image source={{ uri: item.photo }} style={styles.image} />}
  
        {/* Job Name Row */}

          <Text style={styles.title}>İş Adı: {item.jobName}</Text>


        <Text>Açıklama: {item.jobDescription}</Text>
        <Text>Fiyat: {item.jobPrice} TL</Text>
        <Text>Tarih: {new Date(item.jobDate).toLocaleDateString()}</Text>
        <Text>
          Başlangıç: {item.departureNeighborhoodName}, {item.departureDistrictName}, {item.departureCityName}
        </Text>
        <Text>
          Varış: {item.destinationNeighborhoodName}, {item.destinationDistrictName}, {item.destinationCityName}
        </Text>
        <TouchableOpacity
            style={styles.offerButtonSmall}
            onPress={handleOfferButton}
            disabled={isOffer} // Eğer isOffer true ise buton devre dışı kalır
          >
            <Text style={styles.offerButtonTextSmall}>
              {isOffer ? 'Teklif Edildi' : 'Teklif Et'} {/* Burada yazıyı değiştirdik */}
            </Text>
          </TouchableOpacity>
        </Card>
      {/* Kullanıcı Bilgileri */}
      {user ? (
        <Card style={styles.card}>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.userProfilePhoto }} style={styles.userImage} />
            <View style={styles.userText}>
              <Text style={styles.subtitle}>Kullanıcı Bilgileri:</Text>
              <Text>İsim: {`${user.name.charAt(0).toUpperCase()}${user.name.slice(1)}`}</Text>
              <Text>Soyad: {`${user.surname.charAt(0).toUpperCase()}${user.surname.slice(1)}`}</Text>
              <Text>Telefon: {user.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.contactButtons}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('MessageScreen', { recipientId: item.userId })
            }>
            <Icon name="message" size={20} color="#fff" />
            <Text style={styles.buttonText}>Mesaj Gönder</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => makePhoneCall(user.phoneNumber)}>
              <Icon name="call" size={20} color="#fff" />
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Text style={styles.subtitle}>Kullanıcı Bilgileri bulunamadı.</Text>
        </Card>
      )}

          {/* Araç Bilgileri */}
        {/* Araç Bilgileri */}
        {vehicle && vehicle.length > 0 ? (
          <Card style={styles.card}>
            <Text style={styles.subtitle}>Araç Bilgileri:</Text>
            <View style={styles.userInfo}>
              {/* Fotoğraf */}
              {vehicle[0].vehiclePhoto ? (
                <Image
                  source={{ uri: vehicle[0].vehiclePhoto }}
                  style={styles.userImage} // User için kullanılan stil
                />
              ) : (
        <></>
      )}

      {/* Bilgiler */}
      <View style={styles.userText}>
        <Text>Açıklama: {vehicle[0].description}</Text>

        <Text>Marka: {vehicle[0].brand}</Text>
        <Text>Model: {vehicle[0].model}</Text>
          </View>
        </View>
          </Card>
          ) : (
        <Card style={styles.card}>
          <Text style={styles.subtitle}>Araç Bilgileri bulunamadı.</Text>
        </Card>
      )}
     </ScrollView>
      {/* Navbar sayfanın altında */}
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '8%',
    backgroundColor: "#f4f4f4",
  },
  containerScroll:{
      marginBottom:50
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 5,
    padding: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerButtonSmall: {
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center',    // Horizontally center the content
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 10,
  },
 
  offerButtonTextSmall: {
    
    color: '#fff',
    fontSize: 20,
    fontWeight: '450',
  },
  
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#555",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userText: {
    flex: 1,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});



export default DetailPage;
