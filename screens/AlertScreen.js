import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function AlertScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome name="bell" size={25} color="white">
        <Text style={styles.title}> Alerts</Text>
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
