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
import { useState, useEffect } from "react";
import React from "react";
import ConnectionUser from "../components/ConnectionUser";

// Rest of the import statements
import {
  PlayfairDisplay_400Regular,
  useFonts,
} from "@expo-google-fonts/playfair-display";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const [loaded, error] = useFonts({
    PlayfairDisplay_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.user}>
        <FontAwesome
          name="user"
          onPress={() => setModalVisible(true)}
          size={35}
          color="white"
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
            <TouchableOpacity style={styles.btnClose}>
              <FontAwesome
                onPress={() => {
                  setModalVisible(false);
                }}
                name="close"
                size={35}
                color="#C1DBF0"
              />
            </TouchableOpacity>
            <ConnectionUser
              navigation={navigation}
              setModalVisible={setModalVisible}
            />
          </View>
        </View>
      </Modal>
      <View>
        <Text
          style={{ ...styles.logo, fontFamily: "PlayfairDisplay_400Regular" }}
        >
          Ø
        </Text>
        <Text
          style={{ ...styles.title, fontFamily: "PlayfairDisplay_400Regular" }}
        >
          VéloDISPØ
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("TabNavigator", { screen: "Map" })}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  title: {
    color: "white",
    fontSize: 35,
    fontWeight: "600",
  },

  logo: {
    color: "white",
    fontSize: 222,
  },

  button: {
    color: "#FAFAFA",
    textTransform: "uppercase",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FAFAFA",
    backgroundColor: "#303F4A",
    shadowColor: "#FAFAFA",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FAFAFA",
    fontFamily: "monospace",
    fontSize: 16,
    textTransform: "uppercase",
  },

  user: {
    zIndex: 99,
    position: "absolute",
    top: 50,
    left: 25,
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

  btnClose: {
    zIndex: 99,
    position: "absolute",
    top: -320,
    right: 0,
  },
});
