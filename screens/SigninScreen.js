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

export default function SigninScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleConnection = () => {
    fetch("http://192.168.100.119:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ username: signInUsername, token: data.token }));
          setSignInUsername("");
          setSignInPassword("");
          setIsModalVisible(false);
        }
      });
  };

  let modalContent;
  if (!user.isConnected) {
    modalContent = (
      <View className={styles.registerContainer}>
        <View className={styles.registerSection}>
          <Text style={styles.logo}>Ø</Text>
          <Text style={styles.title}>Sign in VéloDISPØ</Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#303F4A"
            style={styles.signinHolder}
            onChangeText={(value) => setSignInUsername(value)}
            value={signInUsername}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#303F4A"
            style={styles.signinHolder}
            onChangeText={(value) => setSignInPassword(value)}
            value={signInPassword}
          />
          <TouchableOpacity
            style={styles.signinBtn}
            onPress={() => handleConnection()}
          >
            <Text style={styles.SigninTxt}>Sign in</Text>
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

  signinHolder: {
    backgroundColor: "#C1DBF0",
    borderRadius: 10,
    width: "70%",
    height: 30,
  },

  signinBtn: {
    width: "70%",
    backgroundColor: "#37678A",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },

  SigninTxt: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
