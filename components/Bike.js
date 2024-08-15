import { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function Bike(props) {
  return (
    // <Marker
    //   coordinate={props.coords}
    //   style={{ display: props.isVisible ? "flex" : "none" }}
    //   /*onPress appeler via la prop onPress la fonction de MapScreen qui permet d'afficher la BikeModal*/
    //   //   onPress={() => props.onPress()}
    //   //   onPress={() => console.log("coucou")}
    // >
    <FontAwesome
      style={styles.bikes}
      name="bicycle"
      color={
        props.bikeType === "velib"
          ? "#2280F5"
          : "lime"
          ? "#07D603"
          : "dott"
          ? "#1AABEB"
          : "tier"
          ? "#172156"
          : ""
      }
      size={props.isSelected ? 50 : 30} //utiliser la propriété isSelected
    />
    // </Marker>
  );
}
const styles = StyleSheet.create({
  bikes: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
});
