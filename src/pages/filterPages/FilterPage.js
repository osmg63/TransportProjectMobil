import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"; // İkon için import
import Navbar from "../../navigation/Navbar";
import { useNavigation } from "@react-navigation/native";

const FiterPage = ({ route }) => {
  const { apiResponse, departureCity, destinationCityName } = route.params; // route.params içinden alınan değerler
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departureCityState, setDepartureCityState] = useState(""); // departureCity için state
  const [destinationCityState, setDestinationCityState] = useState(""); // destinationCityName için state
  const navigation = useNavigation(); // Sayfa yönlendirme için

  useEffect(() => {
    if (apiResponse && apiResponse.items) {
      setData(apiResponse.items);
    } else {
      setData([]);
    }

    // departureCity ve destinationCityName'yi state'e atama
    if (departureCity) {
      setDepartureCityState(departureCity);
    }
    if (destinationCityName) {
      setDestinationCityState(destinationCityName);
    }

    setLoading(false);
  }, [apiResponse, departureCity, destinationCityName]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('FilterDetailPage', { item }) } // Tıklandığında DetailPage yönlendirmesi
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
              Başlangıç: {item.departureNeighborhoodName}, {item.departureDistrictName},{" "}
              {item.departureCityName}
            </Text>
            <Text>
              Varış: {item.destinationNeighborhoodName}, {item.destinationDistrictName},{" "}
              {item.destinationCityName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Yükleniyor...</Text>
        <View style={styles.navbarContainer}>
          <Navbar />
        </View>
      </View>
    );
  }
  
  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Icon name="error-outline" size={60} color="#ff6b6b" />
        <Text style={styles.noDataText}>Veri Bulunamadı</Text>
        <Text style={styles.noDataSubtext}>Lütfen filtreleme kriterlerinizi kontrol edin.</Text>
        <View style={styles.navbarContainer}>
          <Navbar />
        </View>
      </View>
    );
  }

  return (
    <>

    <View style={styles.container}>
      {/* Filtreleme Barı */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="search" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.filterText}>{departureCityState} → {destinationCityState}</Text>
      </View>

      {/* Liste */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      {/* Navbar */}

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
    marginTop: '8%',
    backgroundColor: "#fff",
    marginBottom: '10%',
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderRadius: 8,
    margin: 10,
  },
  filterText: {
    fontSize: 18,
    fontWeight: "600",
    marginEnd: '30%',
    color: "#333",
  },
  iconContainer: {
    padding: 5,
    borderRadius: 20,
    marginLeft: '5%',
  },
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
  navbarContainer: {
   
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  noDataSubtext: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default FiterPage;
