import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    Platform,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { Linking } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

//Créer un composant BikeModal avec 3 propriétés en argument
export default function BikeModal({ modalVisible, closeModal, bikeType }) {
    // console.log(bikeType);

    //rediriger vers une app externe
    const openExternalApp = () => {
        //condition si la props bikeType est égale à velib
        if (bikeType === "velib") {
            const url = () => {
                return Platform.OS === "ios"
                    ? "https://apps.apple.com/fr/app/v%C3%A9lib-app-officielle/id577807727"
                    : "https://play.google.com/store/apps/details?id=com.paris.velib&hl=fr";
            };
            Linking.openURL(url());
        } else if (bikeType === "lime") {
            const url = () => {
                return Platform.OS === "ios"
                    ? "https://apps.apple.com/us/app/lime-ridegreen/id1199780189"
                    : "https://play.google.com/store/apps/details?id=com.limebike&hl=fr";
            };
            Linking.openURL(url());
        } else if (bikeType === "dott") {
            const url = () => {
                return Platform.OS === "ios"
                    ? "https://apps.apple.com/be/app/dott-unlock-your-city/id1440301673"
                    : "https://play.google.com/store/apps/details?id=com.ridedott.rider&hl=fr";
            };
            Linking.openURL(url());
        } else if (bikeType === "tier") {
            const url = () => {
                return Platform.OS === "ios"
                    ? "https://apps.apple.com/fr/app/tier-move-better/id1436140272"
                    : "https://play.google.com/store/apps/details?id=com.tier.app&hl=en&gl=US";
            };
            Linking.openURL(url());
        }
    };

    return (
        <View>
            {/*Créer la balise Modal avec propriété visible passée avec la props modalVisible*/}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity>
                        <FontAwesome
                            style={styles.closeBtn}
                            name="close"
                            size={30}
                            //Faire passer en inverse data flow la valeur (true ou false) de la props closeModal
                            onPress={() => closeModal()}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.openAppBtn}
                        onPress={() => openExternalApp()}
                    >
                        <Text>unlock and pay this bike !</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCloseModal()}>
                        <Text>X</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalView: {
        // flex: 1,
        width: "60%",
        height: "40%",
        backgroundColor: "#ffffff",
        justifyContent: "center",
    },
    closeBtn: {
        justifyContent: "flex-end",
    },
    openAppBtn: {
        justifyContent: "center",
    },
});
