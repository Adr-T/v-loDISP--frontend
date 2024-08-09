import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState } from "react";
import { useEffect } from "react";
import FontAwesome, { bicycle } from "react-native-fontawesome";

export default function BikeDisplay(props) {
    //Déclarer l'adresse du backend
    const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

    const [velib, setVelib] = useState([]);
    const [lime, setLime] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const [currentFilter, setCurrentFilter] = useState("All");

    //idée pour filtrer: déclarer un état isVisible par marque initialisé à true, puis onPress sur button on passe les autres marques à false
    const getMarkers = () => {
        switch (currentFilter) {
            case "velib":
                return velib;
            case "lime":
                return lime;
            case "dott":
                return dott;
            case "tier":
                return tier;
            default:
                return [...velib, ...lime, ...dott, ...tier];
        }
    };

    const onFilterClick = (filter) => {
        setCurrentFilter(filter);
    };

    //afficher les vélos disponibles par marque
    useEffect(() => {
        fetch(`${BACKEND_ADDRESS}/bikes`)
            .then((response) => response.json())
            .then((data) => {
                setVelib(data.velibData);
                setLime(data.limeData);
            });
    }, []);

    //créer marker vélib
    const VelibMarkers = velib.map((data, i) => {
        return (
            <Marker
                key={i}
                coordinate={{
                    latitude: data.latitude,
                    longitude: data.longitude,
                }}
                style={{ display: isVisible ? "flex" : "none" }}
                // title={}
            >
                <FontAwesome name="bicycle" color="#2280F5" />
            </Marker>
        );
    });

    //créer marker lime
    const LimeMarkers = lime.map((data, i) => {
        return (
            <Marker
                key={i}
                coordinate={{
                    latitude: data.latitude,
                    longitude: data.longitude,
                }}
                style={{ display: isVisible ? "flex" : "none" }}
                // title={}
            >
                <FontAwesome name="bicycle" color="#07D603" />
            </Marker>
        );
    });
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.velib}
                    onPress={onFilterClick()}
                >
                    <Text style={styles.velibText}>Vélib'</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dott} onPress={onFilterClick()}>
                    <Text style={styles.dottText}>Dott</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tier} onPress={onFilterClick()}>
                    <Text style={styles.tierText}>Tier</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.lime} onPress={onFilterClick()}>
                    <Text style={styles.limeText}>Lime</Text>
                </TouchableOpacity>
            </View>

            {VelibMarkers}
            {LimeMarkers}
        </>
    );
}

const styles = StyleSheet.create({
    velib: {
        backgroundColor: "#2280F5",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "22%",
        height: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    velibText: {
        color: "#ffffff",
    },
    dott: {
        backgroundColor: "#1AABEB",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "22%",
        height: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    dottText: {
        color: "#ffffff",
    },
    tier: {
        backgroundColor: "#172156",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "22%",
        height: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    tierText: {
        color: "#ffffff",
    },
    lime: {
        backgroundColor: "#07D603",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "22%",
        height: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    limeText: {
        color: "#ffffff",
    },
});
