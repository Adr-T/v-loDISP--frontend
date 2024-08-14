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
  Modal,
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
import Bike from "../components/Bike"; //importer le composant Bike afin de l'utiliser dans Mapscreen
import BikeFilter from "../components/BikeFilter"; //importer le composant BikeFilter afin de l'utiliser dans Mapscreen
import BikeModal from "../components/BikeModal"; //importer le composant BikeModal afin de l'utiliser dans Mapscreen
import ArrivalModal from "../components/ArrivalModal";
import * as geolib from "geolib";
import EditProfile from "../components/EditProfile";
import { useSelector } from "react-redux";
const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS;

const MapScreen = () => {
  // Bouton qui mène à la modale pour editer le profile, params etc
  const [modalEdit, setModalEdit] = useState(false);
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
          const earthRadius = 6371000; // Rayon de la Terre en mètres
          const zoomDistance = 400; // Zoom de 400 mètres
          // Calcul pour afficher un delta de 400 mètres autour de la position
          const latitudeDelta = (zoomDistance / earthRadius) * (180 / Math.PI); // Est calculé en utilisant une approximation simple de la distance en latitude pour 400 mètres
          const longitudeDelta =
            (zoomDistance /
              (earthRadius *
                Math.cos((Math.PI * location.coords.latitude) / 180))) *
            (180 / Math.PI); // Est ajusté en fonction de la latitude actuelle de l'utilisateur
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
  //                                                                    MODAL ARRIVÉE                                                                       //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // geolib methode pour calculer la distance entre 2 adress
  const getModal = async () => {
    const dist = await geolib.getDistance(
      // la location ou on est
      {
        latitude: region?.latitude ? region.latitude : null,
        longitude: region?.longitude ? region.longitude : null,
      },
      // location ou on va
      {
        latitude: destination?.latitude ? destination.latitude : null,
        longitude: destination?.longitude ? destination.longitude : null,
      }
    );
    const disTanceInMeteres = dist / 10000;
    if (disTanceInMeteres < 0.2) {
      //   console.log("destination reached  ");

      setModalVisible(true);
    }
  };
  const toggleModal = () => {
    setModalVisible(false);
  };
  getModal();

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

  //créer un état pour afficher la modale par vélo
  const [bikeModalVisible, setBikeModalVisible] = useState(false);
  // console.log(bikeModalVisible);

  //Mise en place d'un état pour stocker temprairement le type de vélo (velib, ...)
  const [selectedBikeType, setSelectedBikeType] = useState("");

  //Mise en place d'un état pour stocker temporairement les coordonnées d'un vélo pour l'isoler des autres
  const [selectedCoords, setSelectedCoords] = useState(null);

  //Mise en place d'une fonction closeModal permettant de faire passer de nouveau la valeur de bikeModalVisible à false et stocker cette valeur dans le reducer bikeSize
  const closeModal = () => {
    setBikeModalVisible(false);
    setSelectedCoords(null); //réinitialiser l'état selectedCoords
  };

  //afficher la modale onPress sur l'icône d'un vélo
  const handlePressBike = (company, coords = null) => {
    //type de vélo passé en argument de la fonction
    setBikeModalVisible(true); //passer la modale à visible
    setSelectedBikeType(company); //stocker le type de vélo
    setSelectedCoords(coords); //stocker les coordonnées d'un vélo pour pouvoir l'isoler des autres
  };

  const fetchBikes = () => {
    fetch(`${FRONTEND_ADDRESS}/bikes/${region.latitude}/${region.longitude}`)
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

  let allFilters = [
    <BikeFilter
      key="all bikes"
      handleFilterPress={() => handleFilterPress()}
      bikeType="all"
    />,
  ];

  const handleFilterPress = (str) => {
    if (!str) {
      setVisibleCompanies(["velib", "lime", "dott", "tier"]);
    } else {
      setVisibleCompanies([str]);
    }
  };

  for (const company of companies) {
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
            //Mise en place d'une propriété isSelected afin de la faire passer au composant Bike (qu'elle soit null ou non pour l'utiliser et adapter la taille de l'icône)
            isSelected={
              bike.latitude === selectedCoords?.latitude &&
              bike.longitude === selectedCoords?.longitude
            }
            onPress={() => handlePressBike(company, coordinates)} //invoquer la fonction handlePressBike avec en arguments la marque et les coordonnées du vélo
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
            isSelected={
              bike.latitude === selectedCoords?.latitude &&
              bike.longitude === selectedCoords?.longitude
            }
            onPress={() => handlePressBike(company, coordinates)} //invoquer la fonction handlePressBike avec en arguments la marque et les coordonnées du vélo
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
            isSelected={
              bike.latitude === selectedCoords?.latitude &&
              bike.longitude === selectedCoords?.longitude
            }
            onPress={() => handlePressBike(company, coordinates)} //invoquer la fonction handlePressBike avec en arguments la marque et les coordonnées du vélo
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
            isSelected={
              bike.latitude === selectedCoords?.latitude &&
              bike.longitude === selectedCoords?.longitude
            }
            onPress={() => handlePressBike(company, coordinates)} //invoquer la fonction handlePressBike avec en arguments la marque et les coordonnées du vélo
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
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  //                                                                    RECUPERER HISTORIQUE DE TRAJET                                                      //
  //                                                                                                                                                        //
  //                                                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const token = useSelector((state) => state.user.value.token);

  useEffect(() => {
    if (origin && destination && duration) {
      token &&
        fetch("http://172.20.10.2:3000/rides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            depart: origin,
            arrival: destination,
            travelTime: duration,
            token: token,
          }),
        })
          .then((response) => response.json())
          .then(() => {});
    }
  }, [duration]);

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
          <Modal animationType="fade" transparent={true} visible={modalEdit}>
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.btnBack}>
                  <FontAwesome
                    onPress={() => {
                      setModalEdit(false);
                    }}
                    name="backward"
                    size={20}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                <EditProfile />
              </View>
            </View>
          </Modal>

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
            {/* Modal Edit user */}
            <View style={styles.user}>
              <FontAwesome
                name="user"
                onPress={() => setModalEdit(true)}
                size={25}
                color="#303F4A"
              />
            </View>
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
          <View style={styles.filters}>
            <TouchableOpacity
              style={styles.refreshBikes}
              onPress={() => {
                handleRefreshBikes;
              }}
            >
              <FontAwesome name="refresh" size={20} />
            </TouchableOpacity>

            <ScrollView
              alwaysBounceHorizontal={true}
              horizontal={true}
              contentContainerStyle={styles.filtersScrollViewContent}
            >
              <View style={styles.bikeFiltersContainer}>{allFilters}</View>
            </ScrollView>
          </View>
          {origin && destination && (
            <MapViewDirections
              origin={origin} // Point de départ
              destination={destination} // Point d'arrivée
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="#37678A"
              onReady={handleDirectionsReady}
            />
          )}

          {isModalVisible && <ArrivalModal toggleModal={toggleModal} />}
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
      {/* Mise en place de la balise type BikeModal avec 3 propriétés passées en props vers son composant enfant */}
      <BikeModal
        bikeType={selectedBikeType}
        modalVisible={bikeModalVisible}
        closeModal={() => closeModal()}
        style={styles.bikeModal}
      />
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
    zindex: 2,
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    position: "absolute",
    top: 180,
    width: "90%",
  },
  filtersScrollViewContent: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  refreshBikes: {
    width: 25,
    height: 25,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#323232",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  bikeFiltersContainer: {
    flexDirection: "row",
    width: "100%",
  },
  bikeModal: {
    zIndex: 99,
    position: "absolute",
    bottom: 180,
  },

  modalView: {
    height: "100%",
    width: "40%",
    borderRadius: 20,
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
  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    height: "90.25%",
  },
  btnBack: {
    position: "absolute",
    zIndex: 99,
    top: 45,
    right: -20,
  },
  user: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default MapScreen;
