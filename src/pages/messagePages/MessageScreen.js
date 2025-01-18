import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
} from 'react-native';
import axios from 'axios';
import { Base1 } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // İcon kütüphanesi

const MessageScreen = ({ route }) => {
  const item = route.params.recipientId;
  const [messages, setMessages] = useState([]);
  const [description, setDescription] = useState('');
  const [userInfo, setuserInfo] = useState(null);
  const [senderId, setsenderId] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      let info = null;
      if (Platform.OS === 'web') {
        info = JSON.parse(localStorage.getItem('userInfo'));
      } else {
        info = JSON.parse(await AsyncStorage.getItem('userInfo'));
      }
      setuserInfo(info);
      setsenderId(info?.id); // sadece ID'yi ayarlayın
  
      // Recipient bilgilerini almak için API isteği
      const recipientResponse = await axios.get(`${Base1}/User/GetById/${recipientId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

          },
        });
  
      if (recipientResponse.status === 200) {
        setRecipientInfo(recipientResponse.data);
      } else {
        console.error('Kullanıcı bilgisi alınamadı:', recipientResponse.data);
      }
  
    } catch (error) {
      console.error('Kullanıcı bilgisi alınamadı:', error);
    }
  };
  

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const recipientId = item; 

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem('jwtToken');

    try {
      if (!senderId) return; // senderId'nin tanımlı olduğundan emin olun
      const response = await axios.post(
        `${Base1}/Message/GetByRepeitIdEndSenderIdMessage`,
        {
          senderId,
          recipientId,
        },
        {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

          },
        }
      );

      if (response.status === 200) {
        // Mesajları 'createTime' alanına göre sıralama
        const sortedMessages = response.data.sort((a, b) =>
          new Date(a.createTime) - new Date(b.createTime)
        );
        setMessages(sortedMessages);
      } else if (response.status === 204) {
        console.warn('No content found');
      } else {
        console.warn(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Mesajları getirirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    // İlk yüklemede hemen fetchMessages çalıştırılır
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); 

    
    return () => clearInterval(interval); // Bileşen unmount olduğunda interval temizlenir
  }, [senderId, recipientId]);
  // Mesajları listeleme
  const renderMessage = ({ item }) => {
    return (
      <View
        style={[styles.messageContainer,
        item.userSenderId === senderId ? styles.sender : styles.recipient,
        ]}
      >
        <Text style={styles.messageText}>{item.description}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createTime).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  // Mesaj gönderme işlevi
  const handleSendMessage = async () => {
    const messageData = {
      description: description,
      userSenderId: senderId,
      userRecipientId: recipientId,
      isRead: true,
      createTime: new Date().toISOString(),
    };

    try {
      const token = await AsyncStorage.getItem('jwtToken');
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

      if (response.status === 200) {
        setDescription('');
        fetchMessages(); // Mesaj listesini yenile
      } else {
        console.error('Mesaj gönderme başarısız:', response.data);
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <Image
          source={{ uri: recipientInfo ? recipientInfo.userProfilePhoto : 'https://via.placeholder.com/40' }} // Kullanıcı profil fotoğrafı
          style={styles.profileImage}
        />
        <Text style={[styles.userName, { color: '#000' }]}>
          {recipientInfo ? recipientInfo.name[0].toUpperCase() + recipientInfo.name.slice(1) + ' ' + recipientInfo.surname[0].toUpperCase() + recipientInfo.surname.slice(1) : ''}
        </Text>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={() => Linking.openURL(`tel:${recipientInfo.phoneNumber}`)} // Telefon numarasını kullanarak arama sayfasına yönlendirme
        >
          <Ionicons name="call" size={24} color="#000" />
        </TouchableOpacity>
      </View>


      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: '8%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    flex: 1,
    fontSize: 18,
  },
  searchButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  recipient: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageScreen;
