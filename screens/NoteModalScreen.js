import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import React, { useEffect, useState, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function NoteModalScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bikeNote, setBikeNote] = useState(0);

  let style = null;

  const noteStars = [];
  for (let i = 0; i < 5; i++) {
    if (i < bikeNote) {
      style = { color: "#2196f3" };
    }
    noteStars.push(
      <FontAwesome
        key={i}
        name="star-o"
        onPress={() => setBikeNote(i + 1)}
        style={style}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <FontAwesome
          style={styles.btn}
          name="close"
          size={25}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <View style={styles.starNote}>
          <span>{noteStars}</span>
          <Text>Rate your bike !</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
