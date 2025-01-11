import React, { useState } from "react";
import { View, Button, StyleSheet, Text, ScrollView } from "react-native";
import { TextInput as PaperTextInput, Checkbox, Card, Title, Paragraph, Snackbar } from "react-native-paper";
import { BASE } from '@env'; 
import { useNavigation } from "@react-navigation/native";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("USER");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userActive, setUserActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Error message for registration
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility
  const navigation = useNavigation(); // Sayfa yönlendirme için

  const handleSubmit = async () => {
    const userData = {
      userName,
      password,
      name,
      surname,
      email,
      userType,
      phoneNumber,
      userActive,
      created: new Date().toISOString(),
    };
  
    try {
      const response = await fetch(`${BASE}/User/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (response.status === 200) {
        navigation.navigate('Login');
      } else {
        // Try to parse JSON if the response seems to be valid JSON
        try {
          const errorData = await response.json();
          const errorMessage = errorData.message || "User registration failed";
          setErrorMessage(errorMessage);
        } catch (e) {
          setErrorMessage("Error parsing response: " + e.message); // Log the raw response if parsing fails
        }
        setSnackbarVisible(true);
      }
    } catch (error) {
      const errorMessage = "An error occurred: " + error.message;
      setErrorMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Kayıt Ol</Title>
          <Paragraph>
            Hesabınız var mı?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')} // Ensure correct navigation
            >
              Giriş Yap
            </Text>
          </Paragraph>

          <PaperTextInput
            label="Kullanıcı Adı"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />
          <PaperTextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <PaperTextInput
            label="Ad"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <PaperTextInput
            label="Soyad"
            value={surname}
            onChangeText={setSurname}
            style={styles.input}
          />
          <PaperTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <PaperTextInput
            label="Telefon Numarası"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
          />
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={userActive ? "checked" : "unchecked"}
              onPress={() => setUserActive(!userActive)}
            />
            <Text>Aktif Kullanıcı</Text>
          </View>

          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <Button title="Kaydol" onPress={handleSubmit} style={styles.button} />
        </Card.Content>
      </Card>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Tamam",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
    marginTop: '8%',
  },
  card: {
    width: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    height: 50,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    height: 50,
    backgroundColor: "#6200ea",
    borderRadius: 5,
  },
  link: {
    color: "#6200ea",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default RegisterPage;
