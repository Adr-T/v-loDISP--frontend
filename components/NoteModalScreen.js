import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
// import AntIcon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";

const FRONTEND_ADDRESS = process.env.EXPO_PUBLIC_FRONTEND_ADDRESS;

export default function NoteModalScreen({
    NoteModalVisible,
    setNoteModalVisible,
}) {
    // variable pour utiliser de recuperer nombre detoile
    // const [rating, setRating] = useState(0);
    // variable pour noté velo
    // const [noteVelo, setNoteVelo] = useState(null);
    //variable  pour noté le trajet
    const [noteRide, setNoteRide] = useState("");
    // affichage des star
    // const [afficheStar, setAfficheStar] = useState(null);
    // pour calculer l'index ou on a clické
    const handleStarPress = (starIndex) => {
        setRating(starIndex + 1);
    };

    // const renderStars = () => {
    //   const stars = [];
    //   for (let i = 0; i < 5; i++) {
    //     const isFilled = i < rating;
    //     const starColor = isFilled ? "#C0DCF0" : "DCDCDC";
    //     stars.push(
    //       <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
    //         <FontAwesome name="star" size={"44%"} color={starColor} />
    //       </TouchableOpacity>
    //     );
    //   }
    //   setNoteVelo(rating);
    //   setAfficheStar(stars);
    //   return;
    // };
    // if (NoteModalVisible) {
    //   renderStars();
    // }
    // useEffect(() => {
    //   renderStars();
    // }, [rating]);
    useEffect(() => {
        fetch(`${FRONTEND_ADDRESS}/stats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // noteVelo: noteVelo,
                noteRide: noteRide,
            }),
        }).then((response) => response.json());
    }, [noteRide]);

    const handleClick = (emoji) => {
        setTimeout(() => {
            setNoteModalVisible(false);
        }, 2000);
        setNoteRide(emoji);
    };

    return (
        <View style={styles.containerModal}>
            <Modal isVisible={NoteModalVisible}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <FontAwesome
                            style={styles.btn}
                            name="close"
                            size={25}
                            onPress={() => {
                                setNoteModalVisible(false);
                            }}
                        />
                        <Text style={styles.text}>back to VeloDISPØ</Text>
                    </View>
                    {/* <View style={styles.main}>
            <Text>{afficheStar}</Text><Text style={styles.textRate}>Rate your Bake!</Text>
      </View> */}
                    <View style={styles.emojiContainer}>
                        <View style={styles.emoji}>
                            <Entypo
                                style={
                                    noteRide === "bad" ? styles.bad : styles.btn
                                }
                                name="emoji-sad"
                                size={25}
                                onPress={() => {
                                    handleClick("bad");
                                }}
                            />
                            <Entypo
                                style={
                                    noteRide === "moyen"
                                        ? styles.bad
                                        : styles.btn
                                }
                                name="emoji-neutral"
                                size={25}
                                onPress={() => {
                                    handleClick("moyen");
                                }}
                            />
                            <Entypo
                                style={
                                    noteRide === "top" ? styles.bad : styles.btn
                                }
                                name="emoji-happy"
                                size={25}
                                onPress={() => {
                                    handleClick("top");
                                }}
                            />
                        </View>
                        <Text style={styles.textRate}>How was your ride?</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    containerModal: {
        flex: 1,
        alignItems: "center",
    },
    container: {
        minHeight: "50%",
        backgroundColor: "#303F4A",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: "50",
    },
    text: {
        fontSize: "20%",
        color: "#C1DBF0",
        marginBottom: "10%",
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    iconStar: {
        fontSize: "44%",
        marginBottom: "40%",
        color: "#DCDCDC",
    },
    textRate: {
        marginTop: "5%",
        color: "#C0DCF0",
        fontSize: "20%",
    },
    btn: {
        fontSize: "50%",
        color: "#C0DCF0",
    },
    bad: {
        transform: [{ scale: 2 }],
        color: "#E3CF12",
    },
    emojiContainer: {
        alignItems: "center",
    },
    emoji: {
        width: "55%",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    main: {
        alignItems: "center",
        justifyContent: "center",
    },
});
