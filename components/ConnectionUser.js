import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import GoogleSignIn from "./GoogleSignin";
import { login } from "../reducers/user";

const ConnectionUser = ({ navigation, setModalVisible }) => {
  // Initialisation du hook dispatch pour envoyer des actions à Redux
  const dispatch = useDispatch();
  // Utilisation du hook useSelector pour accéder à l'état de l'utilisateur dans Redux
  const user = useSelector((state) => state.user.value);
  // État pour gérer la visibilité du modal

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  //                                                                    FLIP CARD                                                                           //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // État pour gérer l'animation de retournement
  const [isFlipped, setIsFlipped] = useState(false);
  // État pour gérer l'animation
  const [flipAnimation, setFlipAnimation] = useState(new Animated.Value(0));

  // Fonction pour activer/désactiver le retournement de la carte
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1, // Transition entre 0 et 1 pour l'animation
      duration: 800, // Durée de l'animation en millisecondes
      easing: Easing.inOut(Easing.ease), // Fonction d'easing pour l'animation
      useNativeDriver: true, // Utilisation du driver natif pour des performances optimales
    }).start(); // Démarrage de l'animation
  };

  // Interpolation pour faire pivoter la carte autour de l'axe Y
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Rotation de 0 à 180 degrés
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"], // Rotation de 180 à 360 degrés
  });

  // Styles animés pour les côtés avant et arrière de la carte
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                    SIGN IN                                                                             //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // États pour gérer les champs de connexion
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  // État pour afficher les erreurs
  const [error, setError] = useState(false);

  // Fonction pour gérer la connexion de l'utilisateur
  const handleConnection = () => {
    fetch("http://192.168.100.78:3000/users/signin", {
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
          // Si la connexion réussit, envoyer les informations à Redux et réinitialiser les champs
          dispatch(
            login({
              username: data.data.username,
              token: data.data.token,
              email: data.data.email,
            })
          );
          setSignInUsername("");
          setSignInPassword("");
          setModalVisible(false);
          // Navigation vers l'écran "Map"
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          // Afficher une erreur si la connexion échoue
          setError(true);
        }
      });
  };

  // Contenu du modal pour la connexion
  let modalContent;
  if (!user.isConnected) {
    modalContent = (
      <View style={styles.registerContainer}>
        <View style={styles.registerSection}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#303F4A"
            style={styles.input}
            onChangeText={(value) => setSignInUsername(value)}
            value={signInUsername}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#303F4A"
            style={styles.input}
            onChangeText={(value) => setSignInPassword(value)}
            value={signInPassword}
          />
          {error && <Text style={styles.error}>* Invalid field</Text>}
          <View style={styles.google}>
            <GoogleSignIn />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleConnection()}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                    SIGN UP                                                                             //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // États pour gérer les champs d'inscription
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  // États pour afficher les erreurs
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  // RegEx pour valider les adresses email
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // RegEx pour password doit avoir au moins
  const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // Fonction pour gérer l'inscription de l'utilisateur
  const handleRegister = () => {
    if (!EMAIL_REGEX.test(signUpEmail)) {
      // Vérifier la validité de l'email
      setEmailError(true);
      return;
    } else if (signUpUsername.length === 0) {
      // Vérifier si le nom d'utilisateur est vide
      setUsernameError(true);
      return;
    }

    if (!PASSWORD_REGEX.test(signUpPassword)) {
      setPasswordError(true);
      return;
    }

    fetch("http://192.168.100.78:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signUpEmail,
        username: signUpUsername,
        password: signUpPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Si l'inscription réussit, envoyer les informations à Redux et réinitialiser les champs
          dispatch(
            login({
              username: data.data.username,
              token: data.data.token,
              email: data.data.email,
            })
          );
          // Navigation vers l'écran "Map"
          setSignUpEmail("");
          setSignUpUsername("");
          setSignUpPassword("");
          setModalVisible(false);
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else if (data.source === "user") {
          // Afficher une erreur si le nom d'utilisateur existe déjà
          setUsernameError(true);
        } else if (data.source === "email") {
          // Afficher une erreur si l'email est déjà utilisé
          setEmailError(true);
        }
      });
  };

  // Contenu du modal pour l'inscription
  let modalContent2;
  if (!user.isConnected) {
    modalContent2 = (
      <View style={styles.registerContainer}>
        <View style={styles.registerSection}>
          <Text style={styles.title}>Sign up</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#303F4A"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
            onChangeText={(value) => setSignUpEmail(value)}
            value={signUpEmail}
          />
          {emailError && (
            <Text style={styles.error}>Invalid email address</Text>
          )}
          <TextInput
            placeholder="Username"
            placeholderTextColor="#303F4A"
            style={styles.input}
            onChangeText={(value) => setSignUpUsername(value)}
            value={signUpUsername}
          />
          {usernameError && (
            <Text style={styles.error}>Username already exists</Text>
          )}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#303F4A"
            style={styles.input}
            onChangeText={(value) => setSignUpPassword(value)}
            value={signUpPassword}
          />
          {passwordError && (
            <Text style={styles.error}>
              Min 8 characters, one letter, one number and one special character
            </Text>
          )}
          <View style={styles.google2}>
            <GoogleSignIn />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRegister()}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <View style={styles.switchContainer}>
        <Switch
          value={isFlipped}
          onValueChange={toggleFlip}
          trackColor={{ true: "#C1DBF0", false: "#C1DBF0" }}
        />
        <View style={styles.cardSide}>
          <Text style={[styles.label, !isFlipped && styles.activeLabel]}>
            Log in
          </Text>
          <Text style={[styles.label, isFlipped && styles.activeLabel]}>
            Sign up
          </Text>
        </View>
      </View>
      <View style={styles.flipCardContainer}>
        {!isFlipped ? (
          <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
            <View style={styles.flipCardSide}>{modalContent}</View>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.flipCard, backAnimatedStyle]}>
            <View style={styles.flipCardSide}>{modalContent2}</View>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  switchContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  cardSide: {
    position: "relative",
    width: 150,
    height: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C1DBF0",
  },
  activeLabel: {
    textDecorationLine: "underline",
  },
  flipCardContainer: {
    width: 300,
    height: 350,
    perspective: 1000,
  },
  flipCard: {
    width: 300,
    height: 350,
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  flipCardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  flipCardSide: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C1DBF0",
    borderRadius: 5,
    borderColor: "#323232",
    borderWidth: 2,
    boxShadow: "4px 4px #323232",
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: "900",
    color: "#303F4A",
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
    width: 120,
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
    fontSize: 17,
    fontWeight: "600",
    color: "#323232",
  },

  error: {
    marginTop: -15,
    color: "red",
  },

  google: {
    zIndex: 99,
    position: "absolute",
    top: 175,
    left: 200,
    width: 35,
    height: 35,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#323232",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  google2: {
    zIndex: 99,
    position: "absolute",
    top: 235,
    left: 200,
    width: 35,
    height: 35,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#323232",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConnectionUser;
