import * as React from "react";
import { Button, Platform, TouchableOpacity, StyleSheet } from "react-native";
import * as AuthSession from "expo-auth-session";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Détermine si l'on utilise le proxy Expo (généralement true sauf si sur le web)
const useProxy = Platform.select({ web: false, default: true });

// Crée une URI de redirection pour le processus d'authentification
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

// Configuration des endpoints pour l'authentification Google
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
  revocationEndpoint: "https://accounts.google.com/o/oauth2/revoke",
};

export default function GoogleSignIn() {
  // Configure la requête d'authentification en utilisant Google OAuth
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // ID client Google OAuth, à remplacer par le tien
      scopes: ["profile", "email"], // Les informations demandées à l'utilisateur
      redirectUri, // URI de redirection configurée plus haut
    },
    discovery // Les endpoints d'authentification définis plus haut
  );

  // Effet déclenché lorsque la réponse de l'authentification est reçue
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response; // Récupère les informations d'authentification
      console.log(authentication);
    }
  }, [response]);

  return (
    <TouchableOpacity
      disabled={!request}
      onPress={() => promptAsync({ useProxy })}
    >
      <FontAwesome name="google" size={25} color="#303F4A" />
    </TouchableOpacity>
  );
}
