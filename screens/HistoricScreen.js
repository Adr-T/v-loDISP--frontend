import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function HistoricScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome name="book" size={25} color="white">
        <Text> Past rides</Text>
      </FontAwesome>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 35,
  },
});
