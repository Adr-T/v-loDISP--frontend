import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

import {
    GooglePlaceDetail,
    GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import Bike from "../components/Bike";
import BikeFilter from "../components/BikeFilter";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

const App = () => {
    const [region, setRegion] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const mapRef = useRef(null);

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

    //afficher les vélos disponibles par marque
    useEffect(() => {
        fetch(`${BACKEND_ADDRESS}/bikes`)
            .then((response) => response.json())
            .then((data) => {
                setVelib(data.velibData);
                setLime(data.limeData);
                // setDott(data.dottData);
                // setTier(data.tierData);
            });
    }, []);

    const companies = ["velib", "lime", "dott", "tier"];
    let allBikes = [];

    let allFilters = [];

    // let companyName = "";

    const handleFilterPress = (str) => {
        setVisibleCompanies(str);
    };

    for (const company of companies) {
        // companyName = company;
        let coordinates = {};

        if (company === "velib") {
            for (const bike of velib) {
                coordinates.latitude = bike.latitude;
                coordinates.longitude = bike.longitude;
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
                allFilters.push(
                    <BikeFilter
                        handleFilterPress={handleFilterPress}
                        bikeType={company}
                    />
                );
            }
        } else if (company === "lime") {
            for (const bike of lime) {
                coordinates.latitude = bike.latitude;
                coordinates.longitude = bike.longitude;
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
                allFilters.push(
                    <BikeFilter
                        handleFilterPress={handleFilterPress}
                        bikeType={company}
                    />
                );
            }
        } else if (company === "dott") {
            for (const bike of dott) {
                coordinates.latitude = bike.latitude;
                coordinates.longitude = bike.longitude;
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
                allFilters.push(
                    <BikeFilter
                        handleFilterPress={handleFilterPress}
                        bikeType={company}
                    />
                );
            }
        } else if (company === "tier") {
            for (const bike of tier) {
                coordinates.latitude = bike.latitude;
                coordinates.longitude = bike.longitude;
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
                allFilters.push(
                    <BikeFilter
                        handleFilterPress={handleFilterPress}
                        bikeType={company}
                    />
                );
            }
        }
    }
    console.log(companyName);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            //Si l'autorisation n'est pas acceptée, on envoie un message d'erreur à la console
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            //Mise en place de la région initiale dans l'état region
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            //Mise en place du départ dans l'état origin
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const [velibParking, setVelibParking] = useState([
        { station_id: null, lat: null, lon: null },
    ]);
    const [velibNumberAvailable, setVelibNumberAvailable] = useState([
        { station_id: null, numBikesAvailable: null },
    ]);

    //Créer une destination en appuyant sur la carte
    const handleMapPress = (e) => {
        setDestination(e.nativeEvent.coordinate);
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

    //Mise en place d'une fonction Autocomplete pour les champs de saisie GoogleMaps
    function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
        return (
            <>
                <Text>{label}</Text>
                <GooglePlacesAutocomplete
                    styles={{ textInput: styles.input }}
                    placeholder={placeholder || ""}
                    placeholderTextColor={"#ffffff"}
                    fetchDetails
                    query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: "en",
                    }}
                    // textInputProps={{ placeholderTextColor: "#ffffff" }}
                    // onPress={(data, details = null) => {
                    //     onPlaceSelected(details);
                    // }}
                />
            </>
        );
    }

    const handlePlaceSelect = (type, details) => {
        const { geometry } = details;
        const location = {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
        };
        if (type === "origin") {
            setOrigin(location);
        } else if (type === "destination") {
            setDestination(location);
        }
    };

    return (
        <View style={styles.container}>
            {region && (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                    onLongPress={handleMapPress}
                    showsUserLocation
                >
                    {allBikes}
                    {allFilters}
                    {/* {origin && <Marker coordinate={origin} title="Origin" />} */}
                    {destination && (
                        <Marker coordinate={destination} title="Destination" />
                    )}
                    {origin && destination && (
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                            onReady={(result) => {
                                setRouteCoordinates(result.coordinates);
                            }}
                        />
                    )}
                    {routeCoordinates.length > 0 && (
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeWidth={3}
                            strokeColor="hotpink"
                        />
                    )}
                </MapView>
            )}
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
                    }}
                    // styles={autocompleteStyles}
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
                    // styles={autocompleteStyles}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    inputContainer: {
        // flex: 0.5,
        marginTop: 20,
        width: "80%",
        height: "15%",
    },
    input: {
        width: "80%",
    },
});

export default App;
