import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Animated,
    Easing,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ConnectionUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const [isModalVisible, setIsModalVisible] = useState(true);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                        //
    //                                                                                                                                                        //
    //                                                                    FLIP CARD                                                                           //
    //                                                                                                                                                        //
    //                                                                                                                                                        //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [isFlipped, setIsFlipped] = useState(false);
    const [flipAnimation, setFlipAnimation] = useState(new Animated.Value(0));

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
        Animated.timing(flipAnimation, {
            toValue: isFlipped ? 0 : 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "360deg"],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                        //
    //                                                                    SIGN IN                                                                             //
    //                                                                                                                                                        //
    //                                                                                                                                                        //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [signInUsername, setSignInUsername] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [error, setError] = useState(false);

    const handleConnection = () => {
        fetch("http://192.168.100.237:3000/users/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: signInUsername,
                password: signInPassword,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    dispatch(
                        login({ username: signInUsername, token: data.token })
                    );
                    setSignInUsername("");
                    setSignInPassword("");
                    setIsModalVisible(false);
                }
                if (!data.result) {
                    setError(true);
                }
            });
    };

    let modalContent;
    if (!user.isConnected) {
        modalContent = (
            <View className={styles.registerContainer}>
                <View className={styles.registerSection}>
                    <Text style={styles.title}>Login VéloDISPØ</Text>
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#303F4A"
                        style={styles.input}
                        onChangeText={(value) => setSignInUsername(value)}
                        value={signInUsername}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#303F4A"
                        style={styles.input}
                        onChangeText={(value) => setSignInPassword(value)}
                        value={signInPassword}
                    />
                    {error && <Text style={styles.error}>* Invalid field</Text>}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleConnection()}
                    >
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                                                        //
    //                                                                    SIGN UP                                                                             //
    //                                                                                                                                                        //
    //                                                                                                                                                        //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpUsername, setSignUpUsername] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    //RegEx pour être sure que l'adresse email est une adresse email
    const EMAIL_REGEX =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleRegister = () => {
        if (!EMAIL_REGEX.test(signUpEmail)) {
            setEmailError(true);
            return;
        } else if (signUpUsername.length === 0) {
            setUsernameError(true);
            return;
        }

        fetch("http://192.168.100.237:3000/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                signUpEmail: signUpEmail,
                signUpUsername: signUpUsername,
                signUpPassword: signUpPassword,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.result) {
                    dispatch(
                        login({
                            email: signUpEmail,
                            username: signUpUsername,
                            token: data.token,
                        })
                    );
                    navigation.navigate("TabNavigator", { screen: "Map" });
                    setSignUpEmail("");
                    setSignUpUsername("");
                    setSignUpPassword("");
                    setIsModalVisible(false);
                } else if (data.source === "user") {
                    setUsernameError(true);
                } else if (data.source === "email") {
                    setEmailError(true);
                }
            });
    };

    let modalContent2;
    if (!user.isConnected) {
        modalContent2 = (
            <View className={styles.registerContainer}>
                <View className={styles.registerSection}>
                    <Text style={styles.title}>Sign up VéloDISPØ</Text>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#303F4A"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoComplete="email"
                        style={styles.input}
                        onChangeText={(value) => setSignUpEmail(value)}
                        value={signUpEmail}
                    />
                    {emailError && (
                        <Text style={styles.error}>Invalid email address</Text>
                    )}
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#303F4A"
                        style={styles.input}
                        onChangeText={(value) => setSignUpUsername(value)}
                        value={signUpUsername}
                    />

                    {usernameError && (
                        <Text style={styles.error}>
                            Username already exists
                        </Text>
                    )}
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#303F4A"
                        style={styles.input}
                        onChangeText={(value) => setSignUpPassword(value)}
                        value={signUpPassword}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleRegister()}
                    >
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.switchContainer}>
                <Switch
                    value={isFlipped}
                    onValueChange={toggleFlip}
                    trackColor={{ true: "#C1DBF0", false: "#C1DBF0" }}
                />
                <View style={styles.cardSide}>
                    <Text
                        style={[styles.label, !isFlipped && styles.activeLabel]}
                    >
                        Log in
                    </Text>
                    <Text
                        style={[styles.label, isFlipped && styles.activeLabel]}
                    >
                        Sign up
                    </Text>
                </View>
            </View>
            <View style={styles.flipCardContainer}>
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                    <View style={styles.flipCardSide}>{modalContent}</View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.flipCard,
                        styles.flipCardBack,
                        backAnimatedStyle,
                    ]}
                >
                    <View style={styles.flipCardSide}>{modalContent2}</View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    switchContainer: {
        marginBottom: 60,
        alignItems: "center",
    },
    cardSide: {
        position: "relative",
        width: 150,
        height: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#C1DBF0",
    },
    activeLabel: {
        textDecorationLine: "underline",
    },
    flipCardContainer: {
        width: 300,
        height: 350,
        perspective: 1000,
    },
    flipCard: {
        width: 300,
        height: 350,
        position: "absolute",
        backfaceVisibility: "hidden",
    },
    flipCardBack: {
        transform: [{ rotateY: "180deg" }],
    },
    flipCardSide: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C1DBF0",
        borderRadius: 5,
        borderColor: "#323232",
        borderWidth: 2,
        boxShadow: "4px 4px #323232",
    },
    title: {
        marginBottom: 20,
        fontSize: 25,
        fontWeight: "900",
        color: "#303F4A",
    },

    input: {
        width: 250,
        height: 40,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#303F4A",
        backgroundColor: "#fff",
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 15,
        fontWeight: "600",
        color: "#323232",
    },
    button: {
        width: 120,
        height: 40,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#323232",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#323232",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#323232",
    },

    error: {
        marginTop: 10,
        color: "red",
    },
});

export default ConnectionUser;
