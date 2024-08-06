import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";

export default function BikeDisplay() {
    //Déclarer l'adresse du backend
    const BACKEND_ADDRESS = "http://192.168.100.237:3000";

    const [currentPosition, setCurrentPosition] = useState(null);

    const [velibBike, setVelibBike] = useState([]);

    useEffect(() => {
        //Récupérer les données des vélos
        fetch(`${BACKEND_ADDRESS}/bikes`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.velibParkingAavailbale[0].lat);
            });
    }, []);

    //afficher les vélos disponibles
    // const displayBikes = () => {
    //     fetch(`${BACKEND_ADDRESS}/bikes`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data);
    //             return (
    //                 <Bikes

    //                 data.velibParkingAavailable.lat;
    //                 data.velibParkingAavailable.lon;
    //             )
    //         });
    // };
    // displayBikes();

    return (
        <View>
            <Text>BikeDisplay</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
