import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Thêm để lưu vào Firestore
import Toast from 'react-native-toast-message'; // Import thư viện Toast

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
      });
      
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Registration Successful!',
        text2: 'You can now log in to your account.',
      });

      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Registration Failed',
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Already have an account? Login
      </Text>

      {/* Thêm Toast Container để hiển thị thông báo */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 10,
  },
  link: {
    marginTop: 20,
    color: "blue",
  },
});
