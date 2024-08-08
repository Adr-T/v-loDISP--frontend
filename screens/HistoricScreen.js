import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ArrivalModal from "./ArrivalModal";

export default function HistoricScreen() {
  return <View style={styles.container}>{/* <ArrivalModal /> */}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
  },

  // title: {
  //   fontSize: 35,
  // },
});
