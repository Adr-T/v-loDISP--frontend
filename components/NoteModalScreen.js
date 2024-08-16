import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import Entypo from "react-native-vector-icons/Entypo";
import { useSelector } from "react-redux";

const FRONTEND_ADDRESS = process.env.EXPO_PUBLIC_FRONTEND_ADDRESS;

export default function NoteModalScreen({
  NoteModalVisible,
  setNoteModalVisible,
}) {
  const [noteRide, setNoteRide] = useState("");

  const token = useSelector((state) => state.user.value.token);

  useEffect(() => {
    if (noteRide) {
      fetch(`${process.env.EXPO_PUBLIC_FRONTEND_ADDRESS}/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          noteRide: noteRide,
          token: token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("succes:", data);
        })
        .catch((error) => {
          // console.error("error:", error);
        });
    }
  }, [noteRide]);

  const handleClick = (emoji) => {
    setNoteRide(emoji);
    setTimeout(() => {
      setNoteModalVisible(false);
    }, 2000);
  };

  return (
    <View style={styles.containerModal}>
      <Modal isVisible={NoteModalVisible}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              setNoteModalVisible(false);
            }}
          >
            <Text style={styles.close}>x</Text>
          </TouchableOpacity>

          <View style={styles.emojiContainer}>
            <View style={styles.emoji}>
              <Entypo
                style={noteRide === "bad" ? styles.effet : styles.btn}
                name="emoji-sad"
                size={45}
                onPress={() => {
                  handleClick("bad");
                }}
              />
              <Entypo
                style={noteRide === "moyen" ? styles.effet : styles.btn}
                name="emoji-neutral"
                size={45}
                onPress={() => {
                  handleClick("moyen");
                }}
              />
              <Entypo
                style={noteRide === "top" ? styles.effet : styles.btn}
                name="emoji-happy"
                size={45}
                onPress={() => {
                  handleClick("top");
                }}
              />
            </View>
            <Text style={styles.textRate}>How was your ride?</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    minHeight: "50%",
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "60",
  },
  close: {
    position: "absolute",
    top: -115,
    right: -135,
    color: "#C0DCF0",
    fontSize: 20,
    fontWeight: "bold",
  },

  textRate: {
    marginTop: "10%",
    color: "#C0DCF0",
    fontSize: "20%",
  },
  btn: {
    fontSize: "70%",
    color: "#C0DCF0",
  },
  effet: {
    transform: [{ scale: 2 }],
    color: "#fff",
  },
  emojiContainer: {
    width: "100%",
    alignItems: "center",
  },
  emoji: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
