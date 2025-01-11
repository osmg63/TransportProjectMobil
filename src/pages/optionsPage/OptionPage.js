import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../../navigation/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OptionPage = () => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      // UserInfo'yu sıfırla
      await AsyncStorage.removeItem('UserInfo');

      // Login sayfasına yönlendir
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ayarlar" />
      </Appbar.Header>

      {/* Content */}
      <View style={styles.container}>
        <Button
          mode="contained"
          style={[styles.button, styles.buttonShadow]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate('UserJob')}
          icon={() => <Icon name="briefcase-outline" size={24} color="#333" />}
        >
          İşlerim
        </Button>
        <Button
          mode="contained"
          style={[styles.button, styles.buttonShadow]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate('UserOffer')}
          icon={() => <Icon name="file-document-outline" size={24} color="#333" />}
        >
          Tekliflerim
        </Button>
        <Button
          mode="contained"
          style={[styles.button, styles.buttonShadow]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate('UserProfile')}
          icon={() => <Icon name="account-outline" size={24} color="#333" />}
        >
          Profilim
        </Button>
        <Button
          mode="contained"
          style={[styles.button, styles.buttonShadow]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={handleLogout} // handleLogout fonksiyonunu bağladık
          icon={() => <Icon name="logout" size={24} color="#333" />}
        >
          Çıkış Yap
        </Button>
      </View>
        <View style={styles.navbarContainer}>
           <Navbar/>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginVertical: 8, // Butonlar arasında daha fazla boşluk
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16, // Butonları dikeyde büyütür
  },
  buttonLabel: {
    
    fontSize: 18, // Yazı boyutunu büyüttük
    color: '#333',
    marginLeft: '8%',

  },
});

export default OptionPage;
