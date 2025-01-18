import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { Card, Text, Avatar, ActivityIndicator, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base1 } from '@env';
import { useNavigation } from '@react-navigation/native'; // Navigation için
import Navbar from "../../navigation/Navbar";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation(); // Navigation hook

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        if (userInfo) {
          const response = await axios.get(`${Base1}/User/GetById/${userInfo.id}`,
            {
              headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
    
              },
            }
          );
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  

  if (!userInfo) {
    return (
      <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} /> {/* Geri butonu */}
        <Appbar.Content title="Profilim" /> {/* Profilim yazısı */}
      </Appbar.Header>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
      </>
    );
  }

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} /> 
        <Appbar.Content title="Profilim" /> 
      </Appbar.Header>
      <View style={styles.container}>

        {/* Profil İçeriği */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Card style={styles.card}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={140}
                source={{ uri: userInfo.userProfilePhoto }}
                style={styles.avatar}
              />
            </View>

            <Card.Content>
              <View style={styles.textRow}>
                <Text style={styles.label}>İsim:</Text>
                <Text style={styles.value}>{userInfo.name}</Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.label}>Soy İsim:</Text>
                <Text style={styles.value}>{userInfo.surname}</Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.label}>Telefon:</Text>
                <Text style={styles.value}>{userInfo.phoneNumber}</Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userInfo.email}</Text>
              </View>
              {!userInfo.userProfilePhoto && (
                <Button
                  title="Photo Ekle"
                  onPress={() => navigation.navigate('AddUserPhoto', { userId: userInfo.id })}
                />
              )}
            </Card.Content>
          </Card>

        </ScrollView>

        {/* Add Photo Button - only when there's no profile photo */}
        
        
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
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  appbar: {
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: '3%',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: '3%',
  },
  avatar: {
    backgroundColor: '#e3e3e3',
  },
  text: {
    fontSize: 20,
    color: '#000',
    marginTop: 15,
    textAlign: 'left',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontWeight: 'normal',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },textRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
    fontSize: 22, // Label yazı büyüklüğü

  },
  value: {
    fontWeight: 'normal',
    color: '#000',
    fontSize: 18, // Label yazı büyüklüğü

  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default UserProfile;
