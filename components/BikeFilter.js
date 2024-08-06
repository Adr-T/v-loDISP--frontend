import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function BikeFilter() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.velib}>
                <Text style={styles.velibText}>Vélib'</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dott}>
                <Text style={styles.dottText}>Dott</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tier}>
                <Text style={styles.tierText}>Tier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lime}>
                <Text style={styles.limeText}>Lime</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
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
