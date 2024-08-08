import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import AntIcon from "react-native-vector-icons/AntDesign";

export default function ArrivalModal() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.containerModal}>
      <Button title="Show modal" onPress={toggleModal} />

      <Modal isVisible={isModalVisible}>
        <View style={styles.container}>
          <Text style={styles.text}>Destination reached!</Text>
          <AntIcon
            name="like2"
            color="#C1DBF0"
            size={250}
            onPress={toggleModal}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    minHeight: "50%",
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50",
  },
  text: {
    fontSize: "30%",
    color: "#C1DBF0",
    marginBottom: "10%",
  },
});
