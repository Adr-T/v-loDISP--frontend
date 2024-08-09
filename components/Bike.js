import React from "react";
import { Marker } from "react-native-maps";

export default function Bike(props) {
    return (
        <Marker
            key={i}
            coordinate={props.coords}
            bikeType={props.bikeType}
            style={{ display: props.isVisible ? "flex" : "none" }}
        >
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
            />
        </Marker>
    );
}
