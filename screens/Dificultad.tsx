import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Animated } from "react-native";
import { useFonts } from "expo-font";

export default function Dificultad({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Retro: require("../assets/fonts/PressStart2P-Regular.ttf"),
        Poker: require("../assets/fonts/Poker.ttf"),
        Memoria: require("../assets/fonts/MemoriaVestri.ttf"),
        Doom: require("../assets/fonts/AmazDooMLeft.ttf"),
    });

    const [rotationLeft] = useState(new Animated.Value(0));
    const [rotationRight] = useState(new Animated.Value(0));

    useEffect(() => {
        // Rotación de la imagen de la izquierda (gira a la derecha)
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotationLeft, {
                    toValue: 1,
                    duration: 3000, // Duración de la rotación (puedes ajustarla)
                    useNativeDriver: true,
                }),
                Animated.timing(rotationLeft, {
                    toValue: 0,
                    duration: 3000, // Duración de la rotación (puedes ajustarla)
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Rotación de la imagen de la derecha (gira a la izquierda)
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotationRight, {
                    toValue: 1,
                    duration: 3000, // Duración de la rotación (puedes ajustarla)
                    useNativeDriver: true,
                }),
                Animated.timing(rotationRight, {
                    toValue: 0,
                    duration: 3000, // Duración de la rotación (puedes ajustarla)
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // Interpolación para los ángulos de rotación
    const rotateInterpolationLeft = rotationLeft.interpolate({
        inputRange: [0, 2],
        outputRange: ["0deg", "360deg"], // Rotación de 0 a 180 grados hacia la derecha
    });

    const rotateInterpolationRight = rotationRight.interpolate({
        inputRange: [0, 2],
        outputRange: ["0deg", "-360deg"], // Rotación de 0 a -180 grados hacia la izquierda
    });

    if (!fontsLoaded) {
        return <Text>Cargando fuentes...</Text>; // Muestra un mensaje mientras las fuentes cargan
    }

    return (
        <ImageBackground
            source={require("../assets/img/videojuego.gif")} // Ruta a tu imagen de fondo
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title1}>Selecciona una dificultad</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("JuegoM")}
                >
                    <Animated.Image
                        source={require("../assets/img/arcada.png")}
                        style={[styles.iconGif, { transform: [{ rotateY: rotateInterpolationLeft }] }]} // Aplica la rotación al ícono de la izquierda
                    />
                    <Text style={[styles.title2]}>MEMORY (FÁCIL)</Text>
                    <Animated.Image
                        source={require("../assets/img/arcada.png")}
                        style={[styles.iconGif, { transform: [{ rotateY: rotateInterpolationRight }] }]} // Aplica la rotación al ícono de la derecha
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("JuegoD")}
                >
                    <Animated.Image
                        source={require("../assets/img/doomskullgif.gif")}
                        style={[styles.iconGif, { transform: [{ rotateY: rotateInterpolationLeft }] }]} // Aplica la rotación al ícono de la izquierda
                    />
                    <Text style={[styles.title3]}>Doom (Intermedio)</Text>
                    <Animated.Image
                        source={require("../assets/img/doomskullgif.gif")}
                        style={[styles.iconGif, { transform: [{ rotateY: rotateInterpolationRight }] }]} // Aplica la rotación al ícono de la derecha
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("JuegoP")}
                >
                    <Animated.Image
                        source={require("../assets/img/cartas-de-poquer.png")}
                        style={[styles.iconGif, { transform: [{ rotateY: rotateInterpolationLeft }] }]} // Aplica la rotación al ícono de la izquierda
                    />
                    <Text style={[styles.title4]}>Poker (Difícil)</Text>
                    <Animated.Image
                        source={require("../assets/img/cartas-de-poquer.png")}
                        style={[styles.iconGif, { transform: [{ rotateY: rotateInterpolationRight }] }]} // Aplica la rotación al ícono de la derecha
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Tabs")}>
                    <View style={styles.iconContainer}>
                        <Image source={require("../assets/img/usuario.png")} style={styles.iconPng} />
                    </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.1)", // Fondo oscuro semitransparente
        padding: 10,
    },
    header: {
        marginBottom: 30,
    },
    title1: {
        fontSize: 30,  // Ajusta el tamaño de la fuente según prefieras
        fontFamily: "Retro",  // Aquí usas el nombre de la fuente personalizada
        color: "#FFD700",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1e293b",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 15,
        marginVertical: 10,
        width: "90%",
        borderWidth: 2,
        borderColor: "#FFD700",
    },
    buttonText1: {
        color: "#FFD700",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    title2: {
        fontFamily: "Memoria", // Fuente específica para el botón de "Memory"
        fontSize: 24,
        color: "#FFFF",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    title3: {
        fontFamily: "Doom", // Fuente específica para el botón de "Doom"
        fontSize: 24,
        color: "#FFFF",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    title4: {
        fontFamily: "Poker", // Fuente específica para el botón de "Poker"
        fontSize: 24,
        color: "#FFFF",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    iconGif: {
        width: 30,
        height: 30,
    },
    iconPng: {
        width: 30,
        height: 30,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#1e293b",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        borderWidth: 2,
        borderColor: "#FFD700",
    },
});
