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
import Bike from "../components/Bike";
import BikeFilter from "../components/BikeFilter";
import { getDistance } from "geolib";
import * as geolib from "geolib";
import ArrivalModal from "../screens/ArrivalModal";
import Modal from "react-native-modal";
import AntIcon from "react-native-vector-icons/AntDesign";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

const MapScreen = () => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  //                                                                    MAP                                                                                 //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  //                                                                    MAP                                                                                 //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Déclaration des états avec les hooks useState
  const [region, setRegion] = useState(null); // État pour la région actuelle
  const [origin, setOrigin] = useState(null); // État pour le point de départ
  const [destination, setDestination] = useState(null); // État pour le point d'arrivée
  const [routeCoordinates, setRouteCoordinates] = useState([]); // État pour les coordonnées de l'itinéraire
  const [steps, setSteps] = useState([]); // État pour les étapes du trajet
  const [distance, setDistance] = useState(""); // État pour la distance du trajet
  const [duration, setDuration] = useState(""); // État pour la durée du trajet
  const [locationLoaded, setLocationLoaded] = useState(false);
  const mapRef = useRef(null); // Référence pour la carte
  const [isModalVisible, setModalVisible] = useState(false); //on utilise pour afficher modal

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
      Location.watchPositionAsync(
        {
          distanceInterval: 50,
          accuracy: Location.Accuracy.BestForNavigation,
        },
        (location) => {
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          // Définir le point de départ comme la localisation actuelle
          setOrigin(location.coords);
          !locationLoaded && setLocationLoaded(true);
        }
      );
    })();
  }, []);

  // geolib methode pour calculer la distance entre 2 adress
  // console.log(destination.latitude, destination.longitude);
  const reset = () => {
    setModalVisible(true);
    disTanceInMeteres = 5000000;
  };
  // console.log(region.latitude, region.longitude);
  const getModal = async () => {
    const dist = await geolib.getDistance(
      // la location ou on est
      {
        latitude: region.latitude ? region.latitude : null,
        longitude: region.longitude ? region.longitude : null,
      },
      // location ou on va
      {
        latitude: destination.latitude ? destination.latitude : null,
        longitude: destination.longitude ? destination.longitude : null,
      }
    );
    const disTanceInMeteres = dist / 10000;
    if (disTanceInMeteres < 0.2) {
      console.log("destination reached  ");

      setModalVisible(true);
    }
  };
  const toggleModal = () => {
    setModalVisible(false);
  };
  console.log(getModal());

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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  //                                                                    BIKES                                                                               //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //créer un état pour stocker la data pour chaque marque de vélo
  const [velib, setVelib] = useState([]);
  const [lime, setLime] = useState([]);
  const [dott, setDott] = useState([]);
  const [tier, setTier] = useState([]);

  //créer un état pour stocker/filtrer les marques devant être visibles
  const [visibleCompanies, setVisibleCompanies] = useState([
    "velib",
    "lime",
    "dott",
    "tier",
  ]);

  const fetchBikes = () => {
    fetch(
      `http://192.168.100.78:3000/bikes/${region.latitude}/${region.longitude}`
    )
      .then((response) => response.json())
      .then((data) => {
        setVelib(data.velibData);
        setLime(data.limeData);
        // setDott(data.dottData);
        // setTier(data.tierData);
      });
  };

  const handleRefreshBikes = () => {
    fetchBikes();
  };

  //afficher les vélos disponibles par marque
  useEffect(() => {
    region && fetchBikes();
  }, [locationLoaded]);

  const companies = ["velib", "lime", "dott", "tier"];
  let allBikes = [];

  let allFilters = [];

  // let companyName = "";

  const handleFilterPress = (str) => {
    if (visibleCompanies.length === 1) {
      setVisibleCompanies(["velib", "lime", "dott", "tier"]);
    } else {
      setVisibleCompanies([str]);
    }
  };

  for (const company of companies) {
    // companyName = company;

    if (company === "velib") {
      for (const bike of velib) {
        let coordinates = {
          latitude: bike.latitude,
          longitude: bike.longitude,
        };

        allBikes.push(
          <Bike
            key={bike.stationId}
            coords={coordinates}
            bikeType={company}
            isVisible={
              visibleCompanies.length === 0
                ? true
                : visibleCompanies.some((e) => company === e)
            }
          />
        );
      }
      allFilters.push(
        <BikeFilter
          key={company}
          handleFilterPress={(e) => handleFilterPress(e)}
          bikeType={company}
        />
      );
    } else if (company === "lime") {
      for (const bike of lime) {
        let coordinates = {
          latitude: bike.latitude,
          longitude: bike.longitude,
        };
        allBikes.push(
          <Bike
            key={bike.bikeId}
            coords={coordinates}
            bikeType={company}
            isVisible={
              visibleCompanies.length === 0
                ? true
                : visibleCompanies.some((e) => company === e)
            }
          />
        );
      }
      allFilters.push(
        <BikeFilter
          key={company}
          handleFilterPress={handleFilterPress}
          bikeType={company}
        />
      );
    } else if (company === "dott") {
      for (const bike of dott) {
        let coordinates = {
          latitude: bike.latitude,
          longitude: bike.longitude,
        };
        allBikes.push(
          <Bike
            key={bike.bikeId}
            coords={coordinates}
            bikeType={company}
            isVisible={
              visibleCompanies.length === 0
                ? true
                : visibleCompanies.some((e) => company === e)
            }
          />
        );
      }
      allFilters.push(
        <BikeFilter
          key={company}
          handleFilterPress={handleFilterPress}
          bikeType={company}
        />
      );
    } else if (company === "tier") {
      for (const bike of tier) {
        let coordinates = {
          latitude: bike.latitude,
          longitude: bike.longitude,
        };
        allBikes.push(
          <Bike
            key={bike.bikeId}
            coords={coordinates}
            bikeType={company}
            isVisible={
              visibleCompanies.length === 0
                ? true
                : visibleCompanies.some((e) => company === e)
            }
          />
        );
      }
      allFilters.push(
        <BikeFilter
          key={company}
          handleFilterPress={handleFilterPress}
          bikeType={company}
        />
      );
    }
  }

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
            // showsUserLocation
            onLongPress={handleMapPress} // Appelée lorsque l'utilisateur appuie longtemps sur la carte
          >
            {allBikes}
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
            <View style={styles.filters}>{allFilters}</View>

            {/* <Button
                        style={styles.directionBtn}
                        title="Get Directions"
                        onPress={() => {
                        handlePlaceSelect;
                        }}
                        /> */}
            <TouchableOpacity
              style={styles.refreshBikes}
              onPress={() => {
                handleRefreshBikes;
              }}
            >
              <Text>refresh available bikes</Text>
            </TouchableOpacity>
          </View>
          {origin && destination && (
            <MapViewDirections
              origin={origin} // Point de départ
              destination={destination} // Point d'arrivée
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="#37678A"
              onReady={handleDirectionsReady}

              // Appelée lorsque les directions sont prêtes
            />
          )}
          {isModalVisible && (
            <View style={styles.containerModal}>
              <Button title="Show modal" onPress={toggleModal} />

              <Modal isVisible={isModalVisible}>
                <View style={styles.container}>
                  <Text style={styles.text}>Destination reached!</Text>
                  <AntIcon
                    name="like2"
                    color="#C1DBF0"
                    size={250}
                    onPress={toggleModal}
                  />
                </View>
              </Modal>
            </View>
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
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  refreshBikes: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    height: 30,
    backgroundColor: "#719DBD",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // containerModal: {
  //   // flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // container: {
  //   minHeight: "50%",
  //   backgroundColor: "#303F4A",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderRadius: "50",
  // },
  // text: {
  //   fontSize: "30%",
  //   color: "#C1DBF0",
  //   marginBottom: "10%",
  // },
});

export default MapScreen;
