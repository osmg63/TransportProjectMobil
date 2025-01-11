import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Login from "../pages/authsPages/Login"; // Profil ekranı
import { useNavigation } from "@react-navigation/native";
import AddJob from "../pages/AddPages/AddJob";

const Tab = createBottomTabNavigator();

export default function Navbar() {
  // Renk ve stil parametrelerini manuel olarak belirliyoruz
  const primarycolor = "#3498db"; // Aktif sekme rengi
  const bgcolor = "#f5f5f5"; // Arka plan rengi
  const cardcolor = "#ffffff"; // Alt çubuğun rengi
  const navigation = useNavigation(); // Sayfa yönlendirme için

  return (
    <View style={{ backgroundColor: bgcolor, flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Başlık gizli
          tabBarShowLabel: false, // Etiketler gizli
          tabBarActiveTintColor: primarycolor, // Aktif sekme rengi
          tabBarStyle: {
            position: "absolute",
           // bottom: 3,
            marginHorizontal: 5,
            elevation: 10,
            borderRadius: 15,
            height: 60,
            backgroundColor: cardcolor, // Alt çubuğun rengi
            borderTopWidth: 0,
          },
        }}
      >
        {/* Search Tab */}
        <Tab.Screen
          name="Search"
          component={Login}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" color={color} size={20} />
            ),
          }}
          listeners={{
            tabPress: () => {
              navigation.navigate("HomePage");
            },
          }}
        />

        {/* Add Job Tab (Orta Buton - Sekme gibi) */}
        <Tab.Screen
          name="AddJob"
          component={AddJob}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add" color={color} size={24} />
            ),
          }}
          listeners={{
            tabPress: () => {
              navigation.navigate("AddJobScreen");  
            },
          }}
        />
        <Tab.Screen
          name="MessageBox"
          component={AddJob}
          options={{
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={24} /> // Mesaj kutusu simgesi
            ),
          }}
          listeners={{
            tabPress: () => {
              navigation.navigate("MessageBox");
            },
          }}
        />

        {/* Profile Tab */}
        <Tab.Screen
          name="Profile"
          component={Login}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={color} size={20} />
            ),
          }}
          listeners={{
            tabPress: () => {
              navigation.navigate("OptionPage");
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
