import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { mapStyle } from "../styles/mapstyle";
import { Linking } from "react-native"; // pour permettre de rediriger vers GoogleMaps
import FontAwesome from "react-native-vector-icons/FontAwesome";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const MapScreen = () => {
  // Déclaration des états avec les hooks useState
  const [region, setRegion] = useState(null); // État pour la région actuelle
  const [origin, setOrigin] = useState(null); // État pour le point de départ
  const [destination, setDestination] = useState(null); // État pour le point d'arrivée
  const [routeCoordinates, setRouteCoordinates] = useState([]); // État pour les coordonnées de l'itinéraire
  const [steps, setSteps] = useState([]); // État pour les étapes du trajet
  const [distance, setDistance] = useState(""); // État pour la distance du trajet
  const [duration, setDuration] = useState(""); // État pour la durée du trajet
  const mapRef = useRef(null); // Référence pour la carte

  // Utilisation de useEffect pour obtenir la localisation actuelle lors du montage du composant
  useEffect(() => {
    (async () => {
      // Demander la permission d'accéder à la localisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Obtenir la localisation actuelle
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      // Définir le point de départ comme la localisation actuelle
      setOrigin(location.coords);
    })();
  }, []);

  // Gérer la création d'une destination en appuyant sur la carte
  const handleMapPress = (e) => {
    setDestination(e.nativeEvent.coordinate);
  };

  // Fonction appelée lorsque les directions sont prêtes
  const handleDirectionsReady = (result) => {
    setRouteCoordinates(result.coordinates); // Définir les coordonnées de l'itinéraire
    setSteps(result.legs[0].steps); // Définir les étapes du trajet
    setDistance(result.legs[0].distance.text); // Définir la distance du trajet
    setDuration(result.legs[0].duration.text); // Définir la durée du trajet
    if (mapRef.current) {
      // Ajuster la vue de la carte pour inclure toutes les coordonnées de l'itinéraire
      mapRef.current.fitToCoordinates(result.coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  // Réinitialiser les états
  const resetRoute = () => {
    setRouteCoordinates([]);
    setSteps([]);
    setDistance("");
    setDuration("");
  };

  // Gérer la sélection des lieux avec autocomplétion
  const handlePlaceSelect = (type, details) => {
    const { geometry } = details;
    const location = {
      latitude: geometry.location.lat,
      longitude: geometry.location.lng,
    };
    resetRoute();
    if (type === "origin") {
      setOrigin(location);
    } else if (type === "destination") {
      setDestination(location);
    } else if (geometry === null) {
      setOrigin(location.coords);
    }
  };
  // redirection vers google maps méthode linking/deeplink
  const openGoogleMaps = () => {
    if (origin && destination) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=bicycling`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            // customMapStyle={mapStyle}
            // provider={
            //   Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            // }
            initialRegion={region}
            showsUserLocation
            onLongPress={handleMapPress} // Appelée lorsque l'utilisateur appuie longtemps sur la carte
          >
            {origin && (
              <Marker coordinate={origin} title="Origin">
                <FontAwesome name="map-marker" color="#37678A" size={45} />
              </Marker> // Marqueur pour la destination
            )}
            {destination && (
              <Marker coordinate={destination} title="Destination">
                <FontAwesome name="map-marker" color="#37678A" size={45} />
              </Marker> // Marqueur pour la destination
            )}
            {routeCoordinates.length > 0 && (
              <>
                <Polyline
                  coordinates={routeCoordinates} // Tracer l'itinéraire sur la carte
                  strokeWidth={6}
                  strokeColor="#37678A"
                />
              </>
            )}
          </MapView>
          {/* Container pour les champs de saisie */}
          <View style={styles.inputContainer}>
            <GooglePlacesAutocomplete
              placeholder="Origin"
              fetchDetails={true}
              onPress={(data, details = null) =>
                handlePlaceSelect("origin", details)
              }
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
                types: "geocode",
                radius: 5000,
              }}
            />
            <GooglePlacesAutocomplete
              placeholder="Destination"
              fetchDetails={true}
              onPress={(data, details = null) =>
                handlePlaceSelect("destination", details)
              }
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
                types: "geocode",
              }}
            />
            {/* <Button
              style={styles.directionBtn}
              title="Get Directions"
              onPress={() => {
                handlePlaceSelect;
              }}
            /> */}
          </View>
          {origin && destination && (
            <MapViewDirections
              origin={origin} // Point de départ
              destination={destination} // Point d'arrivée
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="#37678A"
              onReady={handleDirectionsReady} // Appelée lorsque les directions sont prêtes
            />
          )}
          {steps.length > 0 && (
            <View style={styles.directionsContainer}>
              <View style={styles.kmTps}>
                <Text style={styles.txtdirections}>Distance: {distance}</Text>
                <Text style={styles.txtdirections}>Time: {duration}</Text>
              </View>
              <View style={styles.directionBtn}>
                <TouchableOpacity onPress={openGoogleMaps}>
                  <FontAwesome
                    name="arrow-circle-right"
                    size={45}
                    color="#C1DBF0"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    position: "absolute",
    top: 50,
    width: "90%",
    backgroundColor: "#303F4A",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 1,
  },

  directionsContainer: {
    bottom: 0,
    backgroundColor: "#303F4A",
    width: "100%",
    height: "10%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },

  txtdirections: {
    color: "#C1DBF0",
    fontSize: 16,
    fontWeight: "bold",
  },

  directionBtn: {
    shadowColor: "#C1DBF0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});

export default MapScreen;
