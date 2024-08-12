import { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Bike(props) {
    return (
        <Marker
            coordinate={props.coords}
            style={{ display: props.isVisible ? "flex" : "none" }}
            onPress={() => props.onPress()}
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
                size={25}
            />
        </Marker>
    );
}
