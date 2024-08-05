import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React from "react";

export default function HomeScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.user}>
        <FontAwesome
          name="user"
          //   onPress={() => dispatch(addUser(data.name))}
          size={25}
          color="#C1DBF0"
        />
      </View>
      <View>
        <Text style={styles.logo}>Ø</Text>
        <Text style={styles.title}>VéloDISPØ</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("TabNavigator")}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Start</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303F4A",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: "playfair display",
    color: "white",
    width: "80%",
    fontSize: 40,
    fontWeight: "600",
  },

  logo: {
    fontFamily: "playfair display",
    color: "white",
    width: "80%",
    fontSize: 180,
    // fontWeight: "600",
  },

  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    // marginTop: 30,
    backgroundColor: "#C1DBF0",
    borderRadius: 10,
    // marginBottom: 80,
  },
  textButton: {
    color: "#303F4A",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },

  user: {
    height: "100%",
    width: "80%",
    marginTopTop: "5%",
    backgroundColor: "white",
    flex: 0.1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
