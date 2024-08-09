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

export default function BikeModal(props) {
    //à mettre probablement dans Mapscreen état pour afficher la modale
    const [modalVisible, setModalVisible] = useState(false);

    //afficher la modale onPress sur l'icône vélo
    handlePressBike = () => {
        setModalVisible(true);
    };

    //rediriger vers une app externe
    const openExternalApp = () => {
        if (props.bikeType === "velib") {
            const url = () => {
                Platform.OS === "ios"
                    ? "https://apps.apple.com/fr/app/v%C3%A9lib-app-officielle/id577807727"
                    : "https://play.google.com/store/apps/details?id=com.paris.velib&hl=fr";
            };
            Linking.openURL(url);
        } else if (props.bikeType === "lime") {
            const url = () => {
                Platform.OS === "ios"
                    ? "https://apps.apple.com/us/app/lime-ridegreen/id1199780189"
                    : "https://play.google.com/store/apps/details?id=com.limebike&hl=fr";
            };
            Linking.openURL(url);
        } else if (props.bikeType === "dott") {
            const url = () => {
                Platform.OS === "ios"
                    ? "https://apps.apple.com/be/app/dott-unlock-your-city/id1440301673"
                    : "https://play.google.com/store/apps/details?id=com.ridedott.rider&hl=fr";
            };
            Linking.openURL(url);
        } else if (props.bikeType === "tier") {
            const url = () => {
                Platform.OS === "ios"
                    ? "https://apps.apple.com/fr/app/tier-move-better/id1436140272"
                    : "https://play.google.com/store/apps/details?id=com.tier.app&hl=en&gl=US";
            };
            Linking.openURL(url);
        }
    };

    return (
        <View>
            <Modal visible={modalVisible} animationType="fade">
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={""}>
                        <Text>unlock and pay this bike !</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({});
