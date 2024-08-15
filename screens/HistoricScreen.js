import { StyleSheet, Text, View } from "react-native";
import React from "react";

// librairie qui convertir la date
import { format } from "date-fns";

import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
// import NoteModalScreen from "../components/NoteModalScreen";

// déclaration de la variable d'environnement
const FRONTEND_ADDRESS = process.env.EXPO_PUBLIC_FRONTEND_ADDRESS;

export default function HistoricScreen() {
  // fonction utilisant useSelector pour lire le token de l'utilisateur depuis le reducer
  const token = useSelector((state) => state.user.value.token);

  // état pour stocker temporairement les notes des trajets
  const [statData, setStatData] = useState([]);

  // état pour stocker temporairement les données de l'historique
  const [data, setData] = useState(null);

  // création d'un useEffect permettant de récupérer l'historique des trajets
  useEffect(() => {
    // fetch pour recuperer les donné
    token &&
      fetch(`${FRONTEND_ADDRESS}/rides/historique`, {
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
            console.log(data.trajet);

            setData(data.trajet);
          }
        });
  }, []);

  // création d'un deuxième useEffect permettant de récupérer les notes des trajets
  useEffect(() => {
    token &&
      fetch(`${FRONTEND_ADDRESS}/stats/${token}`)
        .then((response) => response.json())
        .then((data) => {
          // condition si on a la resultat true on vas le faire une methode map pour afficher le trajet
          setStatData(data.stat.stats);
        });
  }, []);
  let array = [];

  if (statData && data) {
    statData.map((e) => {
      array.push(e.noteRide);
    });
    for (let i = 0; i < data.length; i++) {
      data[i].note = array[i];
    }
  }

  console.log(data);

  // déclarer la fonction historique permettant d'afficher le trajet effectué
  const historique =
    data &&
    data.map((el, index) => {
      console.log(el);

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
            {el.note && (
              <Text style={styles.text}>
                note: {el.note[0].toUpperCase() + el.note.slice(1)}
              </Text>
            )}
            {/* <Text style={styles.text}>
              note: {el.note[0].toUpperCase() + el.note.slice(1)}
            </Text> */}
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
    borderRadius: 15,
  },
});
