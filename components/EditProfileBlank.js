import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { logout } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ConnectionUser from "./ConnectionUser";

export default function EditProfileBlank({ navigation }) {
  const [modalLog, setModalLog] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#FAFAFA",
          position: "abolute",
          top: 115,
        }}
      >
        <Text style={styles.settings}>SETTINGS</Text>
      </View>
      <Text style={styles.notCo}>Not connected..</Text>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => setModalLog(true)}
          style={styles.button2}
        >
          <Text style={styles.buttonText2}>Get in</Text>
        </TouchableOpacity>
        {modalLog && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalLog}
            onRequestClose={() => {
              setModalLog(false);
            }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.btnClose}>
                  <FontAwesome
                    onPress={() => {
                      setModalLog(false);
                    }}
                    name="close"
                    size={35}
                    color="#C1DBF0"
                  />
                </TouchableOpacity>
                <ConnectionUser />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#303F4A",
    paddingLeft: 20,
  },

  mainContainer: {
    width: 130,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 100,
  },
  settings: {
    color: "#FAFAFA",
    fontSize: 16,
  },

  notCo: {
    color: "#FAFAFA",
    fontSize: 12,
    position: "absolute",
    top: 150,
    paddingLeft: 25,
  },

  button2: {
    color: "#FAFAFA",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FAFAFA",
    backgroundColor: "#303F4A",
    shadowColor: "#FAFAFA",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    width: 140,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText2: {
    color: "#FAFAFA",
    fontFamily: "monospace",
    fontSize: 14,
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
