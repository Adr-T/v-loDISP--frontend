import { useState } from "react";
import {
    GooglePlaceDetail,
    GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";

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
                onPress={(data, details = null) => {
                    onPlaceSelected(details);
                }}
                query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: "pt-BR",
                }}
            />
        </>
    );
}

<View style={styles.inputContainer}>
    <InputAutocomplete
        style={styles.inputFrom}
        placeholder={"From..."}
        onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
        }}
    />
    <InputAutocomplete
        style={styles.inputFrom}
        placeholder={"From..."}
        onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
        }}
    />
</View>;

//Balises autocomplete

<View style={styles.inputContainer}>
    <InputAutocomplete
        style={styles.inputFrom}
        placeholder={"From..."}
        onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
        }}
    />
    <InputAutocomplete
        style={styles.inputFrom}
        placeholder={"To..."}
        onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
        }}
    />
</View>;

//préparation du fetch velib
const [velibParkingId, setVelibParkingId] = useState([]);

const [velibParkingCoord, setVelibParkingCoord] = useState([
    { lat: null, lon: null },
]);
const [velibNumberAvailable, setVelibNumberAvailable] = useState([
    { numBikesAvailable: null },
]);

fetch(`${BACKEND_ADDRESS}/bikes`)
    .then((response) => response.json())
    .then((data) => {
        data.velibParkingAavailable.map((e) =>
            setVelibParkingCoord([
                ...velibParkingCoord,
                { lat: e.lat, lon: e.lon },
            ])
        );
        setVelibParkingId(data.velibParkingAavailable[0].station_id);
        setVelibParkingCoord([
            ...velibParkingCoord,
            {
                lat: data.velibParkingAavailable[0].lat,
                lon: data.velibParkingAavailable[0].lon,
            },
        ]);
        setVelibNumberAvailable(velibVeloAavailable[0].numBikesAvailable);
    });

console.log(velibParkingCoord);

//idée modale à l'arrivée
const [isModalVisible, setIsModalVisible] = useState(false);

if (location.coord === details.geometry.location) {
    setIsModalVisible(true);
}
