import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
// import AntIcon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";

export default function ArrivalModal() {
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isModalVisible, setModalVisible] = useState(true);

  const [rating, setRating] = useState(0);

  const handleStarPress = (starIndex) => {
    setRating(starIndex + 1);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i < rating;
      const starColor = isFilled ? "#C0DCF0" : "DCDCDC";
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <FontAwesome name="star" size={"44%"} color={starColor} />
        </TouchableOpacity>
      );
    }

    return stars;
  };
  return (
    <View style={styles.containerModal}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.container}>
          <View style={styles.header}>
            <FontAwesome
              style={styles.btn}
              name="close"
              size={25}
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <Text style={styles.text}>back to VeloDISPØ</Text>
          </View>
          <View style={styles.main}>
            <Text>{renderStars()}</Text>

            <Text style={styles.textRate}>Rate your Bake!</Text>
          </View>
          <View style={styles.emojiContainer}>
            <View style={styles.emoji}>
              <Entypo
                style={styles.btn}
                name="emoji-sad"
                size={25}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
              <Entypo
                style={styles.btn}
                name="emoji-neutral"
                size={25}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
              <Entypo
                style={styles.btn}
                name="emoji-happy"
                size={25}
                onPress={() => {
                  setModalVisible(false);
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

// import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";

// import React, { useEffect, useState, useRef } from "react";
// import FontAwesome from "react-native-vector-icons/FontAwesome";

// export default function NoteModalScreen() {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [bikeNote, setBikeNote] = useState(0);

//   let style = null;

//   const noteStars = [];
//   for (let i = 0; i < 5; i++) {
//     if (i < bikeNote) {
//       style = { color: "#2196f3" };
//     }
//     noteStars.push(
//       <FontAwesome
//         key={i}
//         name="star-o"
//         onPress={() => setBikeNote(i + 1)}
//         style={style}
//       />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//         }}
//       >
//         <FontAwesome
//           style={styles.btn}
//           name="close"
//           size={25}
//           onPress={() => {
//             setModalVisible(false);
//           }}
//         />
//         <View style={styles.starNote}>
//           <Text>{noteStars}</Text>
//           <Text>Rate your bike !</Text>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({});
