import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, Dimensions, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Linking } from "react-native";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const BACKEND_ADDRESS = "http://http://192.168.100.237:3000";

const App = () => {
    const [region, setRegion] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const handleMapPress = (e) => {
        setDestination(e.nativeEvent.coordinate);
    };

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

    const openGoogleMaps = () => {
        if (origin && destination) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
            Linking.openURL(url);
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
                    styles={{
                        textInputContainer: styles.autocompleteContainer,
                        textInput: styles.autocompleteInput,
                        listView: styles.listView,
                        description: styles.description,
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
                    styles={{
                        textInputContainer: styles.autocompleteContainer,
                        textInput: styles.autocompleteInput,
                        listView: styles.listView,
                        description: styles.description,
                    }}
                />
            </View>
            <Button title="Open in Google Maps" onPress={openGoogleMaps} />
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
        marginTop: 20,
        width: "80%",
        height: "15%",
    },
    autocompleteContainer: {
        backgroundColor: "transparent",
    },
    autocompleteInput: {
        color: "#000",
    },
    listView: {
        backgroundColor: "#fff",
    },
    description: {
        color: "#000",
    },
});

export default App;
