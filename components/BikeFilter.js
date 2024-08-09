import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BikeFilter(props) {
  //Mise en place de la mécanique d'inverse data flow pour la fonction handleFilterPress
  const handleFilter = () => {
    props.handleFilterPress(props.bikeType);
  };

  return (
    //Créer un bouton pour chaque type de filtre en utilisant la mécanique de props
    <TouchableOpacity
      style={styles[props.bikeType]}
      onPress={() => handleFilter()}
    >
      <Text style={{ color: "#ffffff" }}>{props.bikeType}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: "red",
    width: 150,
  },
  velib: {
    backgroundColor: "#2280F5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "22%",
    height: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  dott: {
    backgroundColor: "#1AABEB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "22%",
    height: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  tier: {
    backgroundColor: "#172156",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "22%",
    height: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  lime: {
    backgroundColor: "#07D603",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "22%",
    height: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
