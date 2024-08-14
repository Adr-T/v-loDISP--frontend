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

export default function EditProfile({ navigation }) {
  // Initialisation du hook dispatch pour envoyer des actions à Redux
  const dispatch = useDispatch();
  // Utilisation du hook useSelector pour accéder à l'état de l'utilisateur dans Redux
  const user = useSelector((state) => state.user.value);
  // État pour gérer la visibilité du modal
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [modalUsername, setModalUsername] = useState(false);
  const [modalPwd, setModalPwd] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                  UPDATE PASSWORD                                                                       //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const handleNewPassword = () => {
    if (!PASSWORD_REGEX.test(signUpPassword)) {
      setPasswordError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Error passwords don't match");
      return;
    }

    fetch(`${FRONTEND_ADDRESS}/users/updatepwd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newPassword: newPassword,
        token: data.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result && currentPassword === data.currentPassword) {
          Alert.alert("Success", "You changed your password !");
          setNewPassword("");
          setIsModalVisible(false);
        } else if (currentPassword !== data.currentPassword) {
          Alert.alert("Error", "Change denied !");
        }
      });
  };

  // Contenu du modal pour changement mdp
  let passwordChange;
  if (!user.isConnected) {
    passwordChange = (
      <View>
        <TouchableOpacity style={styles.btnClose}>
          <FontAwesome
            onPress={() => {
              setModalPwd(false);
            }}
            name="close"
            size={20}
            color="#303F4A"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Update password</Text>
        <TextInput
          placeholder="Current password"
          placeholderTextColor="#303F4A"
          style={styles.input}
          onChangeText={(value) => setCurrentPassword(value)}
          value={currentPassword}
        />
        <TextInput
          placeholder="New password"
          placeholderTextColor="#303F4A"
          style={styles.input}
          onChangeText={(value) => setNewPassword(value)}
          value={newPassword}
        />
        {passwordError && (
          <Text style={styles.error}>
            Min 8 characters, one letter, one number and one special character
          </Text>
        )}
        <TextInput
          placeholder="confirm password"
          placeholderTextColor="#303F4A"
          style={styles.input}
          onChangeText={(value) => setConfirmPassword(value)}
          value={confirmPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNewPassword()}
        >
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                  UPDATE USERNAME                                                                       //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [newUsername, setNewUsername] = useState("");

  const handleNewUsername = () => {
    fetch(`${FRONTEND_ADDRESS}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUsername,
        token: data.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Si le changement est réussit, envoyer les informations à Redux et réinitialiser les champs
          dispatch(updateUsername({ username: newUsername }));
          setNewUsername("");
          setIsModalVisible(false);
        }
      });
  };

  // Contenu du modal pour changement username
  let usernameUpdate;
  if (!user.isConnected) {
    usernameUpdate = (
      <View>
        <TouchableOpacity
          onPress={() => setModalUsername(false)}
          style={styles.btnClose}
        >
          <FontAwesome name="close" size={20} color="#303F4A" />
        </TouchableOpacity>
        <Text style={styles.title}>Change username</Text>
        <TextInput
          placeholder="New username"
          placeholderTextColor="#303F4A"
          style={styles.input}
          onChangeText={(value) => setNewUsername(value)}
          value={newUsername}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNewUsername()}
        >
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                  LOG OUT  / DELETE ACCOUNT                                                                             //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("TabNavigator", { screen: "Home" });
  };

  const handleDelete = () => {
    fetch(`${FRONTEND_ADDRESS}`, {
      method: "Delete",
    })
      .then((response) => response.json())
      .then(() => {
        navigation.navigate("TabNavigator", { screen: "home" });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <Text style={styles.settings}>SETTINGS</Text>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => setModalPwd(true)}
          style={styles.button2}
        >
          <Text style={styles.buttonText2}>Change password</Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalPwd}
          onRequestClose={() => {
            setModalPwd(false);
          }}
          style={styles.container}
        >
          <View style={styles.container}>{passwordChange}</View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalUsername(true)}
          style={styles.button2}
        >
          <Text style={styles.buttonText2}>Change username </Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalUsername}
          onRequestClose={() => setModalUsername(false)}
          style={styles.container}
        >
          <View style={styles.container2}>{usernameUpdate}</View>
        </Modal>
        <TouchableOpacity onPress={() => handleLogout()} style={styles.button2}>
          <Text style={styles.buttonText2}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete()} style={styles.button2}>
          <Text style={styles.buttonText2}>Delete account</Text>
        </TouchableOpacity>
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
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 100,
  },

  container: {
    marginTop: 60,
    marginLeft: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C1DBF0",
    borderRadius: 5,
    borderColor: "#323232",
    borderWidth: 2,
    boxShadow: "4px 4px #323232",
    width: 300,
    height: 350,
  },

  container2: {
    marginTop: 200,
    marginLeft: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C1DBF0",
    borderRadius: 5,
    borderColor: "#323232",
    borderWidth: 2,
    boxShadow: "4px 4px #323232",
    width: 300,
    height: 250,
  },

  input: {
    width: 250,
    height: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#303F4A",
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#323232",
  },
  button: {
    width: 130,
    height: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#323232",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#323232",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#323232",
  },

  settings: {
    position: "abolue",
    top: 115,
    color: "#FAFAFA",
    fontSize: 16,
    borderBottomColor: "#FAFAFA",
    borderBottomWidth: 1,
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

  title: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: "900",
    color: "#303F4A",
  },

  error: {
    marginTop: -15,
    color: "red",
  },

  btnClose: {
    position: "absolute",
    right: -15,
    top: -30,
  },
});
