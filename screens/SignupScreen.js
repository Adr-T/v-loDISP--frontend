import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";
import { useState } from "react";

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  //RegEx pour être sure que l'adresse email est une adresse email
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleRegister = () => {
    if (!EMAIL_REGEX.test(signUpEmail)) {
      setEmailError(true);
      return;
    } else if (signUpUsername.length === 0) {
      setUsernameError(true);
      return;
    }

    fetch("http://192.168.100.119:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signUpEmail: signUpEmail,
        signUpUsername: signUpUsername,
        signUpPassword: signUpPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.result) {
          dispatch(
            login({
              email: signUpEmail,
              username: signUpUsername,
              token: data.token,
            })
          );
          navigation.navigate("TabNavigator", { screen: "Map" });
          setSignUpEmail("");
          setSignUpUsername("");
          setSignUpPassword("");
          setIsModalVisible(false);
        } else if (data.source === "user") {
          setUsernameError(true);
        } else if (data.source === "email") {
          setEmailError(true);
        }
      });
  };

  let modalContent;
  if (!user.isConnected) {
    modalContent = (
      <View className={styles.registerContainer}>
        <View className={styles.registerSection}>
          <Text style={styles.logo}>Ø</Text>
          <Text style={styles.title}>Sign up VéloDISPØ</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#303F4A"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.signupHolder}
            onChangeText={(value) => setSignUpEmail(value)}
            value={signUpEmail}
          />
          {emailError && (
            <Text style={styles.error}>Invalid email address</Text>
          )}
          <TextInput
            placeholder="Username"
            placeholderTextColor="#303F4A"
            style={styles.signupHolder}
            onChangeText={(value) => setSignUpUsername(value)}
            value={signUpUsername}
          />
          {usernameError && (
            <Text style={styles.error}>Username already exists</Text>
          )}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#303F4A"
            style={styles.signupHolder}
            onChangeText={(value) => setSignUpPassword(value)}
            value={signUpPassword}
          />
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => handleRegister()}
          >
            <Text style={styles.SignupTxt}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        {isModalVisible && (
          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
            >
              {modalContent}
            </Modal>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: "playfair display",
    color: "white",
    width: "80%",
    fontSize: 30,
    fontWeight: "600",
  },

  logo: {
    fontFamily: "playfair display",
    color: "white",
    width: "80%",
    fontSize: 180,
  },

  registerContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  registerSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },

  signupHolder: {
    backgroundColor: "#C1DBF0",
    borderRadius: 10,
    width: "70%",
    height: 30,
  },

  signupBtn: {
    width: "70%",
    backgroundColor: "#37678A",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },

  SignupTxt: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  error: {
    marginTop: 10,
    color: "red",
  },
});
