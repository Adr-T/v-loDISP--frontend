import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
export default function HistoricScreen() {
  // variable pour recuperer les donee
  const [data, setData] = useState(null);
  useEffect(() => {
    // fetch pour recuperer les donné
    fetch(`http://192.168.100.119:3000/rides/ss`)
      .then((response) => response.json())
      .then((data) => {
        // on recuper la data
        setData(data.trajet);
        // console.log(data.trajet);
      });
  }, []);
  // on utilise une variable pour afficher a la fin les element retourne apres d'avoir utiliser le map sur la data q'on  a recu
  const historique =
    data &&
    data.map((el, index) => {
      // console.log(el);

      return (
        <View style={styles.historiqueContainer} key={index}>
          <View style={styles.iconContainer}>
            <FontAwesome name="map-pin" size={25} color="white"></FontAwesome>
          </View>
          <View style={styles.adresseContainer}>
            <Text style={styles.text}>Depart: {el.departure}</Text>
            <Text style={styles.text}>arrival: {el.arrival}</Text>
            <Text style={styles.text}>traveltime: {el.travelTime}</Text>
            <Text style={styles.text}>date: {el.date}</Text>
          </View>
        </View>
      );
    });
  return (
    <View style={styles.container}>
      <Text>{historique}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  historiqueContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
    marginBottom: "1%",
    padding: 15,
    width: "100%",
  },
  adresseContainer: {
    width: "100%",
    paddingLeft: "10%",
  },
  text: {
    color: "white",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "2%",
  },
});
