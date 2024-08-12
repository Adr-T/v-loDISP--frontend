import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Popover } from "react-native-popover";

const App = () => {
  return (
    <View>
      <TouchableOpacity>
        <Text>Show Popover</Text>
      </TouchableOpacity>
      <Popover
        anchor={
          <View>
            <Text>Anchor Element</Text>
          </View>
        }
      >
        <View>
          <Text>Popover Content</Text>
        </View>
      </Popover>
    </View>
  );
};
