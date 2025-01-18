import React, { useState, useEffect } from 'react';
import { View, FlatList, Text,Linking, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card, Appbar, Button } from 'react-native-paper';
import { Base1 } from '@env'; 
import { useNavigation } from '@react-navigation/native';  // for navigation
import axios from 'axios';
import Navbar from "../../navigation/Navbar"; // Navbar import
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // İkon kütüphanesi

const UserJob = () => {
  const [jobs, setJobs] = useState([]);
  const [offers, setOffers] = useState({});  // Store offers by jobId
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);  // Veri çekildi kontrolü
  const navigation = useNavigation();  // Hook for navigation

  // API'den veri çekme
  const [reloadTrigger, setReloadTrigger] = useState(0); // Yeni tetikleyici

  useEffect(() => {
    const fetchJobs = async () => {
      
      setLoading(true); // Yükleniyor durumunu başlat
      try {
        const token = await AsyncStorage.getItem('jwtToken');

        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        const response = await fetch(`${Base1}/Job/GetJobByUserId/${userInfo.id}`, {
          method: 'GET',
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,

          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false); // Yükleniyor durumu bitti
      }
    };
  
    fetchJobs();
  }, [reloadTrigger]); // Tetikleyici her değiştiğinde veri çek
  
  const handleAcceptOffer = async (offerId, recipientUserId) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      // Teklif Kabul API Çağrısı
      const response = await axios.post(
        `${Base1}/Offer/OfferAcceptByOfferId/${offerId}`,
        null, // Body gönderilmiyorsa `null` kullanılır
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,

          },
        }
      );
  
      if (response.status === 200) {
  
        // Mesaj Gönderme Verileri
        const messageData = {
          description: `Teklifiniz kabul edildi. Ayrıntıları bildirin.`,
          userSenderId: userInfo.id,
          userRecipientId: recipientUserId,
          isRead: false,
          createTime: new Date().toISOString(),
        };
  
        // Mesaj Gönder API Çağrısı
        try {
          const token = await AsyncStorage.getItem('jwtToken');

          const messageResponse = await axios.post(
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
  
          if (messageResponse.status === 200) {
          }
        } catch (messageError) {
          console.error('Mesaj gönderme hatası:', messageError);
        }
  
        // İşlem Başarılı Mesajı ve Yeniden Yükleme
        alert('Teklif kabul edildi ve mesaj gönderildi.');
        setReloadTrigger((prev) => prev + 1); // Tetikleme
      }
    } catch (error) {
      console.error('Teklif kabul edilemedi:', error);
    }
  };
  
  // API request to get offers by jobId
  const fetchOffersByJobId = async (jobId) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await fetch(`${Base1}/Offer/GetOfferByJobIdUser/${jobId}`,
        {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

          },
        });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOffers((prevOffers) => ({
        ...prevOffers,
        [jobId]: data,
      }));
    } catch (error) {
      console.error('Fetch offers error:', error);
    }
  };

  // Fetch offers for all jobs once jobs are loaded
  useEffect(() => {
    jobs.forEach((job) => {
      fetchOffersByJobId(job.id);
    });
  }, [jobs]); 

  const handleDeleteJob = async (jobId) => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await axios.post(
          `${Base1}/Job/ChangeJobInActiveById/${jobId}`,
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`,

            },
          }
        );
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));      } catch (error) {
        console.error('Job inaktif yapılamadı:', error);
      }
    };
  // İş kartı render fonksiyonu
  const renderItem = ({ item }) => {
    if (!item.active) {
      return null; // Bu kartı atlar
    }
    const jobOffers = offers[item.id] || [];  // Get offers for the current job
    return (
      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FilterDetailPage', { item })}
        >
          <View style={styles.cardContent}>
            {item.photo && (
              <Image source={{ uri: item.photo }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.title}>İş Adı: {item.jobName}</Text>
              <Text>Açıklama: {item.jobDescription}</Text>
              <Text>Fiyat: {item.jobPrice} TL</Text>
              <Text>Tarih: {new Date(item.jobDate).toLocaleDateString()}</Text>
              <Text>
                Başlangıç: {item.departureCityName}
              </Text>
              <Text>
                Varış: {item.destinationCityName}
              </Text>

              {jobOffers.length > 0 ? (
            jobOffers.map((offer) => (
              <View key={offer.id} style={styles.offerContainer}>
                <Text>Teklif Veren: {offer.userName} {offer.userSurName}</Text>
                <Text>Teklif Zamanı: {new Date(offer.offerTime).toLocaleString()}</Text>
            
                {/* Ara ve Mesaj At butonları yan yana */}
                <View style={styles.buttonRow}>
                  {/* Ara butonu */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL(`tel:${offer.phone}`)}
                  >
                    <Icon name="phone" size={20} color="white" />
                    <Text style={styles.buttonText}>Ara</Text>
                  </TouchableOpacity>
            
                  {/* Mesaj At butonu */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('MessageScreen',   { recipientId: offer.userId } )}
                  >
                    <Icon name="message" size={20} color="white" />
                    <Text style={styles.buttonText}>Mesaj At</Text>
                  </TouchableOpacity>
                </View>
            
                {/* Teklifi Onayla/Onaylandı Butonu */}
                <Button
                  mode="contained"
                  onPress={() => {
                    if (!offer.isAccepted) {
                      handleAcceptOffer(offer.id, offer.userId);
                    }
                  }}
                  style={[
                    styles.offerButton,
                    offer.isAccepted && styles.acceptedButton, // Onaylanan teklif için farklı stil
                  ]}
                  disabled={offer.isAccepted} // Onaylanmışsa butonu devre dışı bırak
                >
                  {offer.isAccepted ? 'Teklif Onaylandı' : 'Teklifi Onayla'}
                </Button>
              </View>
            ))
              ) : (
                <Text>Henüz teklif bulunmamaktadır.</Text> // If no offers available
              )}              
              {/* "İşi Sil" button */}
              <Button
                mode="contained"
                onPress={() => handleDeleteJob(item.id)}
                style={styles.deleteJobButton}
              >
                İşi Sil
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="İşlerim" />
      </Appbar.Header>
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={jobs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 10,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 15,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  cardContent: {
    flexDirection: "column",  // Adjusted for vertical stacking
  },
  image: {
    width: '100%', // Full width for the image
    height: 200,
    borderRadius: 10,
    marginBottom: 10, // Space between image and content
  },
  textContainer: {
    flex: 1,
    marginBottom: 15, // Space between text content and other sections
  },
  title: {
    fontSize: 18, // Increased size for better visibility
    fontWeight: "bold",
    marginBottom: 5,
  },
  offerContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row', // Yatay düzen
    justifyContent: 'space-between', // Butonlar arasında boşluk
    marginTop: 10,
  },
  button: {
    flexDirection: 'row', // İkon ve yazı yan yana
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007bff', // Mavi renk
    borderRadius: 8,
    marginHorizontal: 5, // Butonlar arası boşluk
    flex: 1, // Eşit genişlik
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5, // İkon ve yazı arası boşluk
  },
  offerButton: {
    marginTop: 10,
    padding: 6,
    textAlign: 'center',
    backgroundColor: 'green', // Varsayılan renk
  },
  acceptedButton: {
    backgroundColor: 'gray', // Onaylanan teklif için gri renk
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  acceptOfferButton: {
    marginTop: 15,
    padding: 6, // Adjust padding for better button size
    textAlign: 'center', // Center the text inside the button
    backgroundColor: 'green'
  },
  deleteJobButton: {
    marginTop: 15,
    padding: 6, // Adjust padding for better button size
    textAlign: 'center', // Center the text inside the button
    backgroundColor: '#ff4d4d', // Button color (red)
  },
});

export default UserJob;
