import React, { useEffect, useState } from 'react';
import { View, ScrollView,Text,TouchableOpacity,FlatList, StyleSheet } from 'react-native';
import { Avatar, List, Divider, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base1 } from '@env';
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';  // useNavigation hook'u
import Navbar from '../../navigation/Navbar';
const MessageBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user,setUser]=useState(null);
  const navigation = useNavigation();  // useNavigation ile navigation'a erişim sağlıyoruz.
  
  useEffect(() => {
    // API'den veri çek
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        const response = await fetch(`${Base1}/Message/Messagebox/${userInfo.id}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            Authorization: `Bearer ${token}`,

          },
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Mesajları çekerken bir hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Liste öğesi tasarımı
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MessageScreen',  { recipientId: item.userId })}>
      <List.Item
        title={`${item.userName} ${item.userSurname}`}
        description={item.message}
        left={(props) =>
          item.userPhoto ? (
            <Avatar.Image
              {...props}
              source={{ uri: item.userPhoto }}
              size={48}
            />
          ) : (
            <Avatar.Text
              {...props}
              label={`${item.userName.charAt(0)}${item.userSurname.charAt(0)}`}
              size={48}
            />
          )
        }
        right={(props) => (
          <View style={styles.timeContainer}>
            <List.Subheader>
              {new Date(item.lastMesageTime).toLocaleDateString()}
            </List.Subheader>
            <List.Icon
              {...props}
              icon={item.isRead ? 'check-circle' : 'circle-outline'}
              color={item.isRead ? '#4caf50' : '#f44336'}
            />
          </View>
        )}
      />
      <Divider />
    </TouchableOpacity>
  );
  

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            {/* Geri butonu */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
            <Text style={styles.heading}>Message Kutusu</Text>
        </View>
         <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId.toString()}
        />
 
            
        <View style={styles.navbarContainer}>
            <Navbar />
         </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 1,
    marginTop:'8%'
  }, header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  heading: {
    flex: 1, 
    textAlign: 'center',
    fontSize: 18,
  },
  scrollView:{
    flex: 1, 
  },
  timeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default MessageBox;
