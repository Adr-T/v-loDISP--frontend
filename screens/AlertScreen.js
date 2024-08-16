import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";

// déclaration de la variable d'environnement
const FRONTEND_ADDRESS = process.env.EXPO_PUBLIC_FRONTEND_ADDRESS;

export default function AlertScreen() {
    // state pour recupere data de l'alert

    const [dataAlert, setDataAlert] = useState(null);
    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_FRONTEND_ADDRESS}/alerts`)
            .then((response) => response.json())
            .then((data) => {
                setDataAlert(data.dataOriginal);
            });
    }, []);

    // on boucle la data et on va mettre dans un variable pour afficher et retourner le resultat
    const afficheAlert =
        dataAlert &&
        dataAlert.map((el, index) => {
            return (
                <View style={styles.alertContainer} key={index}>
                    <View style={styles.iconAlert}>
                        <FontAwesome
                            name="bell"
                            size={25}
                            color="white"
                        ></FontAwesome>
                    </View>
                    <View style={styles.textAlertContainer}>
                        <Text style={styles.textAlert}>ALERT</Text>
                        <Text style={styles.text}>{el.name}</Text>
                    </View>
                </View>
            );
        });
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} indicatorStyle="white">
                {afficheAlert}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#303F4A",
        alignItems: "center",
        justifyContent: "center",
    },
    alertContainer: {
        alignContent: "center",
        flexDirection: "row",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "white",
        marginBottom: "1%",
        padding: 15,
        width: "99%",
        borderRadius: 10,
    },
    iconAlert: {
        alignItems: "center",
        justifyContent: "center",
        width: "30%",
    },
    text: {
        color: "white",
        fontSize: "16%",
        marginBottom: "2%",
    },
    textAlert: {
        color: "white",
        fontSize: "16%",
        marginBottom: "2%",
        letterSpacing: 3,
        fontWeight: "bold",
        color: "#C0DCF0",
    },
    textAlertContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "70%",
    },
});
