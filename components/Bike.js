import { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

export default function Bike(props) {
    const [isPressed, setIsPressed] = useState(false);
    return (
        <Marker
            coordinate={props.coords}
            style={{ display: props.isVisible ? "flex" : "none" }}
            /*appeler via la prop onPress la fonction qui permet d'afficher la BikeModal et modifier l'état isPressed*/
            onPress={() => props.onPress() && setIsPressed(true)}
        >
            {isPressed ? (
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
                    size={35}
                />
            ) : (
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
                    size={25}
                />
            )}
        </Marker>
    );
}
