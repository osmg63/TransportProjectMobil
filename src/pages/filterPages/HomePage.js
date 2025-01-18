import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, Button, Card, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import resim from "../../../assets/Foto12.jpg";
import Navbar from "../../navigation/Navbar";
import { useNavigation } from "@react-navigation/native";
import { Base1 } from '@env'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [departureCity, setDepartureCity] = useState("");
  const [destinationCityName, setdestinationCityName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [today, setToday] = useState(new Date());

  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Sayfa yönlendirme için

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const buildFilters = () => {
    const filters = [];
  
    // Kalkış şehri varsa filtre ekle
    if (departureCity) {
      filters.push({ field: "departureCityName", operator: "contains", value: departureCity });
    }
  
    // Varış şehri varsa filtre ekle
    if (destinationCityName) {
      filters.push({ field: "destinationCityName", operator: "contains", value: destinationCityName });
    }
    if (selectedDate) {
      filters.push({ field: "jobDate", operator: "gte", value: selectedDate });
      filters.push({ field: "active", operator: "equals", value: true });

    }
    

  
  
    // Eğer herhangi bir filtre yoksa boş obje döndür
    return filters.length > 0 ? { logic: "and", filters } : {};
  };
  
  

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    setIsLoading(true);
    setError(null);
  
    const filters = buildFilters();
    const requestPayload = {
      offset: 0,
      limit: 200,
      filter: filters,
    };
    try {
      const response = await fetch(`${Base1}/Job/Pagination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });
  
      if (!response.ok) {
        throw new Error("Bir hata oluştu. API yanıtı başarısız.");
      }
  
      const data = await response.json();
  
      // Navigation or further processing
      navigation.navigate("FilterPage", { apiResponse: data,departureCity,destinationCityName }); 
    } catch (err) {
      console.error("API Hatası:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: "cash",
      title: "Düşük Maliyetler",
      description:
        "Boş araç dönüşlerini en aza indirerek tasarruf edin. Platformumuz, nakliye işlemlerinizde hem maliyeti düşürmek hem de kaynakları en verimli şekilde kullanmanıza olanak tanır.",
    },
    {
      icon: "leaf",
      title: "Çevre Dostu",
      description:
        "Çevreye duyarlı nakliye çözümlerimizle karbon ayak izinizi azaltabilirsiniz. Hem iş hedeflerinize ulaşabilir hem de çevreyi koruyabilirsiniz.",
    },
    {
      icon: "speedometer",
      title: "Hızlı Çözümler",
      description:
        "Hız, nakliye süreçlerinde en önemli unsurlardan biridir. Platformumuz, ihtiyacınız olan nakliye işlemlerini en kısa sürede sonuçlandırmanıza yardımcı olur.",
    },
  ];

  return (
    <>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.homepage}>
          {/* Hero Section */}
          <Card style={styles.heroSection}>
            <ImageBackground source={resim} style={styles.ctaImage}>
              <View style={styles.ctaOverlay}>
                <Text style={styles.ctaText}>Nakliye işleriniz için hızlı çözümler</Text>
              </View>
            </ImageBackground>
          </Card>

          {/* Search Section */}
          <Card style={styles.searchSection}>
            <Card.Content style={styles.searchContent}>
              <TextInput
                mode="outlined"
                label="Kalkış Yeri"
                style={styles.input}
                value={departureCity}
                onChangeText={(text) => setDepartureCity(text.trim())}
              />
              <TextInput
                mode="outlined"
                label="Varış Yeri"
                style={styles.input}
                value={destinationCityName}
                onChangeText={(text) => setdestinationCityName(text.trim())}
                />
              <View style={styles.datePickerContainer}>
                <IconButton
                  icon="calendar"
                  size={24}
                  onPress={() => setShowDatePicker(!showDatePicker)}
                />
                <TextInput
                  mode="outlined"
                  value={selectedDate.toISOString().split("T")[0]}
                  editable={false}
                  style={styles.dateInput}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    minimumDate={today}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <Button mode="contained" style={styles.searchButton} onPress={fetchData}>
                  Ara
                </Button>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </Card.Content>
          </Card>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            {features.map((feature, index) => (
              <Card key={index} style={styles.featureCard}>
                <Card.Content>
                  <IconButton icon={feature.icon} size={40} style={styles.featureIcon} />
                  <Text variant="titleMedium" style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    {/* Navbar */}
    {!isKeyboardVisible && (
        <View style={styles.navbarContainer}>
          <Navbar />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: "8%",
    backgroundColor: "#fff",
    marginBottom: '10%',

  },
  scrollContent: {
  },
  homepage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroSection: {
    height: 300,
  },
  ctaImage: {
    width: "100%",
    height: "100%",
  },
  ctaOverlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(137, 122, 122, 0.5)",
  },
  ctaText: {
    color: "#fff",
    marginTop: "3%",
    fontSize: 20,
    padding: 10,
  },
  searchSection: {
    marginHorizontal: 15,
    marginTop: "-20%",
    borderRadius: 10,
    elevation: 3,
  },
  searchContent: {
    gap: 10,
  },
  input: {
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    marginLeft: 10,
  },
  searchButton: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  featuresSection: {
    marginTop: 20,
    marginHorizontal: 15,
    gap: 15,
  },
  featureCard: {
    borderRadius: 10,
    elevation: 3,
    padding: 15,
  },
  featureIcon: {
    alignSelf: "center",
  },
  featureTitle: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  featureDescription: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default HomePage;
