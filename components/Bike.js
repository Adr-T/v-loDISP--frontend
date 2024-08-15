import { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
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
