import React, { useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { TextInput, Button, Card, Title, Paragraph, Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base1 } from "@env";

const Login = () => {
  const [userName, setUserName] = useState("osman63");
  const [password, setPassword] = useState("Osman*6327");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const navigation = useNavigation();
  const saveData = async (key, value) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Veri kaydedilemedi:", error);
    }
  };

  const handleLogin = async () => {
    console.log(Base1);
    const loginData = {
      userName: userName,
      password: password,
    };
    try {
      const response = await fetch(`${Base1}/User/Login`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.status === 200) {
        const token = await response.text();

        if (token) {
          await saveData("jwtToken", token); // Token'ı sakla

          const userInfoResponse = await fetch(
            `${Base1}/User/GetByUserName/${userName}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // JWT token'ını Authorization başlığında ekliyoruz
              },
            }
          );

          if (userInfoResponse.status === 200) {
            const userInfo = await userInfoResponse.json();
            await saveData("userInfo", JSON.stringify(userInfo)); // Kullanıcı verilerini sakla
            navigation.navigate("HomePage"); // Başarılı giriş sonrası yönlendirme
          } else {
            setErrorMessage("Kullanıcı bilgileri alınamadı.");
            setSnackbarVisible(true);
          }
        } else {
          setErrorMessage("Token alınamadı.");
          setSnackbarVisible(true);
        }
      } else {
        setErrorMessage("Giriş bilgileri hatalı");
        setSnackbarVisible(true);
      }
    } catch (error) {
      setErrorMessage("Bir hata oluştu: " + error.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Giriş Yap</Title>
          <Paragraph>
            Hesabınız yok mu?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("RegisterPage")}
            >
              Üye Ol
            </Text>
          </Paragraph>

          <TextInput
            label="Kullanıcı Adı veya Email"
            mode="outlined"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />

          <TextInput
            label="Şifre"
            mode="outlined"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Giriş Yap
          </Button>

          <View style={styles.twoCol}>
            <Button
              mode="text"
              compact
              onPress={() => console.log("Beni Hatırla")}
            >
              Beni Hatırla
            </Button>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Parolanızı mı unuttunuz?
            </Text>
          </View>
        </Card.Content>
      </Card>

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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "90%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Login;
