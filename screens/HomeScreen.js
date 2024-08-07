import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import React from "react";

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignin = () => {
    navigation.navigate("Signin");
    setModalVisible(false);
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.user}>
        <FontAwesome
          name="user"
          onPress={() => setModalVisible(true)}
          size={25}
          color="#C1DBF0"
        />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.signin}
              onPress={() => handleSignin()}
            >
              <Text style={styles.textSign}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signup}
              onPress={() => handleSignup()}
            >
              <Text style={styles.textSign}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View>
        <Text style={styles.logo}>Ø</Text>
        <Text style={styles.title}>VéloDISPØ</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("TabNavigator", { screen: "Map" })}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Start</Text>
      </TouchableOpacity>
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
    fontSize: 40,
    fontWeight: "600",
  },

  logo: {
    fontFamily: "playfair display",
    color: "white",
    width: "80%",
    fontSize: 180,
    // fontWeight: "600",
  },

  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    // marginTop: 30,
    backgroundColor: "#C1DBF0",
    borderRadius: 10,
    // marginBottom: 80,
  },
  textButton: {
    color: "#303F4A",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },

  user: {
    height: "100%",
    width: "80%",
    marginTopTop: "5%",
    flex: 0.1,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    margin: 20,
    backgroundColor: "#303F4A",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btn: {
    backgroundColor: "#37678A",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  signin: {
    backgroundColor: "#C1DBF0",
    borderRadius: 10,
    width: "70%",
    height: 30,
  },

  signup: {
    backgroundColor: "#C1DBF0",
    borderRadius: 10,
    width: "70%",
    height: 30,
  },

  textSign: {
    color: "#303F4A",
    fontWeight: "bold",
    textAlign: "center",
  },
});
