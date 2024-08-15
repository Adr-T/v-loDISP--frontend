import { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Bike(props) {
    return (
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
    );
}
