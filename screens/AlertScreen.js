import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
export default function AlertScreen() {
  // state pour recupere data de l'alert

  const [dataAlert, setDataAlert] = useState(null);
  useEffect(() => {
    fetch(`http://192.168.100.119:3000/alerts`)
      .then((response) => response.json())
      .then((data) => {
        setDataAlert(data.dataOriginal);
      });
  }, []);
  // on boucle la data et on va mettre dans un variable pour afficher et retourner le resultat
  const afficheAlert =
    dataAlert &&
    dataAlert.map((el, index) => {
      return (
        <View style={styles.alertContainer} key={index}>
          <View style={styles.iconAlert}>
            <FontAwesome name="bell" size={25} color="white"></FontAwesome>
          </View>
          <View style={styles.textAlertContainer}>
            <Text style={styles.text}>Alert</Text>
            <Text style={styles.text}>{el.name}</Text>
          </View>
        </View>
      );
    });
  return <View style={styles.container}>{afficheAlert}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303F4A",
    justifyContent: "center",
  },
  alertContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconAlert: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
  },
});
