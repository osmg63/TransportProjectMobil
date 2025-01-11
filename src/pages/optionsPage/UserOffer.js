import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Appbar, Button } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE } from '@env'; 
import Navbar from "../../navigation/Navbar";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserOffer = () => {
  const [offers, setOffers] = useState([]);
  const navigation = useNavigation();

  // API'den verileri çekmek
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        const response = await axios.get(`${BASE}/Offer/GetOfferByUserId/${userInfo.id}`);
        const offersWithJobDetails = await Promise.all(
          response.data.map(async (offer) => {
            const jobResponse = await axios.get(`${BASE}/Job/GetById/${offer.jobId}`);
            return {
              ...offer,
              job: jobResponse.data,
            };
          })
        );
        setOffers(offersWithJobDetails);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  const handleCardPress = (job) => {
    navigation.navigate('FilterDetailPage', { item: job });
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      const response = await axios.delete(`${BASE}/Offer/OfferDeleteById/${offerId}`);
      setOffers((prevOffers) => prevOffers.filter(item => item.id !== offerId));
    } catch (error) {
      console.error('Error silerken:', error);
    }
  };

  const renderOffer = ({ item }) => (
      <Card style={styles.card}>
        <Card.Content>
        <TouchableOpacity onPress={() => handleCardPress(item.job)}>

          <Text style={styles.jobName}>İş Adı: {item.job.jobName}</Text>
          <Text style={styles.route}>Rota: {item.job.departureCityName} - {item.job.destinationCityName}</Text>
          <Text>Teklif Zamanı: {new Date(item.offerTime).toLocaleString()}</Text>
          <Text>
            Durum: {item.isAccepted ? 'Teklif Kabul Edildi' : 'Teklif Beklemede'}
          </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={() => handleDeleteOffer(item.id)}
            style={styles.deleteButton}
          >
            Teklifi İptal Et
          </Button>
        </Card.Content>
      </Card>
  );

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tekliflerim" />
      </Appbar.Header>
      <View style={styles.container}>
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={(item) => item.id.toString()}
        />
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
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  jobName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  route: {
    marginBottom: 5,
  },
  deleteButton: {
  marginTop: 15,
  padding: 6, // Adjust padding for better button size
  textAlign: 'center', // Center the text inside the button
  },
});

export default UserOffer;
