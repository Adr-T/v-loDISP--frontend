//imports react native
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

//imports utiles à Google Maps
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";

//imports expo
import * as Location from "expo-location";
import Constants from "expo-constants";

//imports react
import { useRef, useState, useEffect } from "react";

//imports des composants utilisés
import BikeFilter from "../components/BikeFilter";
import BikeDisplay from "../components/BikeDisplay";

//Mise en place de la clé d'API Google avec une variable d'environnement
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function MapScreen() {
  //Mise en place de l'état de départ d'un trajet
  const [origin, setOrigin] = useState();

  //Mise en place de l'état d'arrivée d'un trajet
  const [destination, setDestination] = useState();

  //Mise en place de l'affichage d'un itinéraire
  const [showDirections, setShowDirections] = useState(false);

  //Mise en place de deux états stockant la distance et la durée estimée du trajet
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  //Affichage du trajet recherché sur la carte
  const mapRef = useRef(null);

  //Mise en place d'un état pour la position actuelle
  const [currentPosition, setCurrentPosition] = useState(null);
  // console.log(currentPosition);

  //Déclarer la taille de la fenêtre affichant la carte
  const { width, height } = Dimensions.get("window");

  //paramétrage initial de la cartographie
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const INITIAL_POSITION = {
    latitude: currentPosition?.latitude || 48.86666,
    longitude: currentPosition?.longitude || 2.33333,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  useEffect(() => {
    (async () => {
      //Demander l'autorisation d'accès à la position de l'utilisateur
      const result = await Location?.requestForegroundPermissionsAsync();
      const status = result?.status;

      //Si autorisation acceptée, on récupère une position mise à jour tous les 10m
      if (status === "granted") {
        Location?.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
  }, []);

  //Déclarer une fonction à revoir
  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  //Déclarer un réglage de base de l'affichage (zoom)
  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  //Vérifier si le départ et l'arrivée ont été remplis dans les inputs, puis afficher le trajet
  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding,
      });
    }
  };

  //Au clic sur le bouton Trace route, mise à des états distance et duration
  const traceRouteOnReady = (args) => {
    if (args) {
      // args.distance
      // args.duration
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  //Récupérer les données de géolocalisation des lieux recherchés
  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry?.location.lat || 0,
      longitude: details?.geometry?.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };

  //Mise en place d'une fonction Autocomplete pour les champs de saisie Google Maps
  function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
    return (
      <>
        <Text>{label}</Text>
        <GooglePlacesAutocomplete
          styles={{ textInput: styles.input }}
          placeholder={placeholder || ""}
          placeholderTextColor={"#ffffff"}
          fetchDetails
          onPress={(data, details = null) => {
            onPlaceSelected(details);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "pt-BR",
          }}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        region={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>
      <BikeDisplay />
      <View style={styles.searchContainer}>
        <InputAutocomplete
          style={styles.inputFrom}
          // label="Origin"
          placeholder={"From..."}
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <InputAutocomplete
          style={styles.inputTo}
          // label="Destination"
          placeholder={"To..."}
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "destination");
          }}
        />
        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace route</Text>
        </TouchableOpacity>
        <BikeFilter />
        {distance && duration ? (
          <View>
            <Text>Distance: {distance.toFixed(2)}</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    alignContent: "flex-start",
    width: "90%",
    backgroundColor: "transparent",
    // shadowColor: "black",
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    // elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    backgroundColor: "#303F4A",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20,
    margin: 0,
    padding: 0,
  },
  button: {
    backgroundColor: "#303F4A",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
  },
});
