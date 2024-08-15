import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";

export default function Bike(props) {
  return (
    <FontAwesome
      style={styles.bikes}
      name="bicycle"
      color={
        props.bikeType === "velib"
          ? "#2280F5"
          : props.bikeType === "lime"
          ? "#07D603"
          : props.bikeType === "dott"
          ? "#1AABEB"
          : props.bikeType === "tier"
          ? "#172156"
          : ""
      }
      size={props.isSelected ? 50 : 30} //utiliser la propriété isSelected
    />
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
