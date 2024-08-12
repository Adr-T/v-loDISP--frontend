import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
// import AntIcon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ArrivalModal() {
  const [isModalVisible, setModalVisible] = useState(true);
  const [bikeNote, setBikeNote] = useState(0);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  let style = null;

  const noteStars = [];
  for (let i = 0; i < 5; i++) {
    if (i < bikeNote) {
      style = { color: "#2196f3" };
    }
    noteStars.push(
      <FontAwesome
        key={i}
        name="star-o"
        onPress={() => setBikeNote(i + 1)}
        style={style}
      />
    );
  }

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
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    minHeight: "50%",
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50",
  },
  text: {
    fontSize: "30%",
    color: "#C1DBF0",
    marginBottom: "10%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    fontSize: "50%",
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
