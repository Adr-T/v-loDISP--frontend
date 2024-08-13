import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import AlertScreen from "./screens/AlertScreen";
import HistoricScreen from "./screens/HistoricScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

const store = configureStore({
    reducer: { user },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName = "";

                    if (route.name === "Historic") {
                        iconName = "book";
                    } else if (route.name === "Map") {
                        iconName = "bicycle";
                    } else if (route.name === "Alert") {
                        iconName = "bell";
                    }

                    return (
                        <FontAwesome
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: "#C1DBF0",
                tabBarInactiveTintColor: "#335561",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Historic" component={HistoricScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Alert" component={AlertScreen} />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen
                        name="TabNavigator"
                        component={TabNavigator}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
