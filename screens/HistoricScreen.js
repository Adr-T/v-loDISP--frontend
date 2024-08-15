import { StyleSheet, Text, View } from "react-native";
import React from "react";
// librairie qui convertir la date
import { format } from "date-fns";

import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function HistoricScreen() {
  // variable declarer avec useSelector pour recuperer token de lutilisateur depuis recuer
  const token = useSelector((state) => state.user.value.token);
  const [statData, setStatData] = useState([]);

  // variable pour recuperer les donee
  const [data, setData] = useState(null);
  useEffect(() => {
    // fetch pour recuperer les donné
    token &&
      fetch("http://192.168.100.78:3000/rides/historique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // condition si on a la resultat true on vas le faire une methode map pour afficher le trajet
          if (data.result) {
            setData(data.trajet);
          }
        });
  }, []);
  useEffect(() => {
    token &&
      fetch(`http://192.168.100.78:3000/stats/${token}`)
        .then((response) => response.json())
        .then((data) => {
          // condition si on a la resultat true on vas le faire une methode map pour afficher le trajet
          setStatData(data.stat.stats);
        });
  }, [token]);
  let array = [];

  if (statData && data) {
    statData.map((e) => {
      array.push(e.noteRide);
    });
    for (let i = 0; i < data.length; i++) {
      data[i].note = array[i];
    }
  }

  // on utilise une variable pour afficher a la fin les element retourne apres d'avoir utiliser le map sur la data q'on  a recu
  const historique =
    data &&
    data.map((el, index) => {
      return (
        <View style={styles.historiqueContainer} key={index}>
          <View style={styles.iconContainer}>
            <FontAwesome name="map-pin" size={25} color="white"></FontAwesome>
          </View>
          <View style={styles.adresseContainer}>
            <Text style={styles.text}>Depart: {el.departure}</Text>
            <Text style={styles.text}>arrival: {el.arrival}</Text>
            <Text style={styles.text}>traveltime: {el.travelTime}</Text>
            <Text style={styles.text}>
              date: {format(el.date, "MM/dd/yyyy")}
            </Text>
            <Text style={styles.text}>note: {strUcFirst(el.note)}</Text>
          </View>
        </View>
      );
    });
  // on declare une variable pour pouvoir afficher le message si j'aimeis lutilisateur n'et pa conneecté
  let user = (
    <View style={styles.UserNotFound}>
      <Text style={styles.text}>
        Please create an account to view historical journey 🫣
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text>{historique ? historique : user}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
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
  UserNotFound: {
    borderWidth: 1,
    borderColor: "white",
    marginBottom: "1%",
    padding: 15,
    width: "100%",
  },
});
