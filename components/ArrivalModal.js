import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { useState, useEffect } from "react";

export default function ArrivalModal() {
    const [modalVisible, setModalVisible] = useState(false);

    if (location.coord === details.geometry.location) {
        setModalVisible(true);
    }

    return (
        <View>
            <Modal visible={modalVisible} animationType="fade">
                <View style={styles.modalView}>
                    <TouchableOpacity>
                        <Text>DESTINATION REACHED !</Text>
                        <Fontawesome></Fontawesome>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({});
