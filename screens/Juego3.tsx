import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, ImageBackground, Animated, TouchableOpacity } from "react-native";
import { auth, db } from "../config/Config";
import { get, ref, set } from "firebase/database";
import { useFonts } from "expo-font"; // Asegúrate de importar useFonts para cargar la fuente
import Card2 from "../components/Card2";

const pokerCards: string[] = [
    "A♥", "A♦", "A♣", "A♠",
    "2♥", "2♦", "2♣", "2♠",
    "3♥", "3♦", "3♣", "3♠",
    "4♥", "4♦", "4♣", "4♠",
    "5♥", "5♦", "5♣", "5♠",
];

// Duplicar las cartas y mezclarlas
const duplicatedPokerCards = shuffle([...pokerCards, ...pokerCards.slice(0, 24)]);

type RootStackParamList = {
    JuegoPoker: undefined;
    ScoreScreen: { score: number };
};

export default function JuegoPoker({ navigation }: any) {

    const [fontsLoaded] = useFonts({
        Memoria: require("../assets/fonts/Poker.ttf"),
    });

    const [board, setBoard] = React.useState(() => shuffle([...duplicatedPokerCards]));
    const [selectedCards, setSelectedCards] = React.useState<number[]>([]);
    const [matchedCards, setMatchedCards] = React.useState<number[]>([]);
    const [incorrectCards, setIncorrectCards] = React.useState<number[]>([]);
    const [score, setScore] = React.useState(0);
    const [timeLeft, setTimeLeft] = React.useState(110);

    const [showCongratulation, setShowCongratulation] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // Estado para pausar el contador
    const [buttonColor] = useState(new Animated.Value(0));

    const user = auth.currentUser;


    // Timer para el juego
    useEffect(() => {
        if (timeLeft <= 0) {
            navigation.navigate("Tabs");
            return;
        }

        if (isPaused) return; // Detener el temporizador si el juego está en pausa

        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, isPaused, navigation]);

    if (!fontsLoaded) {
        return <Text>Cargando fuentes...</Text>;
    }

    // Lógica de coincidencia de cartas
    useEffect(() => {
        if (selectedCards.length < 2) return;

        if (board[selectedCards[0]] === board[selectedCards[1]]) {
            setMatchedCards((prev) => [...prev, ...selectedCards]);
            setScore((prev) => prev + 20);
            setTimeLeft((prev) => prev + 5);
        } else {
            setIncorrectCards((prev) => [...prev, ...selectedCards]); // Agregar a las cartas incorrectas
        }

        const timeoutId = setTimeout(() => {
            setSelectedCards([]);
            setIncorrectCards([]);// Limpiar las cartas incorrectas después de un breve delay
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [selectedCards, board]);

    // Reinicia el juego si todas las cartas coinciden
    useEffect(() => {
        if (matchedCards.length === board.length) {
            setShowCongratulation(true); // Mostrar felicitación
            setIsPaused(true); // Pausar el contador
        }
    }, [matchedCards]);

    useEffect(() => {
        if (showCongratulation) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(buttonColor, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(buttonColor, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        }
    }, [showCongratulation]);

    const saveScore = async (): Promise<void> => {
        if (user && user.uid) {
            const scoresRef = ref(db, `users/${user.uid}/score`);
            const snapshot = await get(scoresRef);

            const currentScore = snapshot.val() || 0;
            const newScore = Math.max(currentScore, score);

            await set(scoresRef, newScore);
        }
    };

    useEffect(() => {
        saveScore();
    }, [score]);

    const handleTapCard = (index: number): void => {
        if (selectedCards.length >= 2 || selectedCards.includes(index)) return;
        setSelectedCards((prev) => [...prev, index]);
    };

    const resetGame = (): void => {
        setBoard(shuffle([...duplicatedPokerCards]));
        setSelectedCards([]);
        setMatchedCards([]);
        setShowCongratulation(false); // Ocultar felicitación
        setIsPaused(false); // Reanudar temporizador
    };

    const { width } = Dimensions.get("window");
    const cardSize = width / 6 - 10;

    return (
        <ImageBackground source={require("../assets/img/Naipes2.jpg")} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Poker Memory</Text>
                <Text style={styles.title}>Score: {score}</Text>
                <View style={styles.timeContainer}>
                    <Text style={styles.title}>Tiempo restante: </Text>
                    <Text style={[styles.time, timeLeft <= 10 && styles.timeLow]}>{timeLeft}s</Text>
                </View>
            </View>
            <View style={[styles.board, { paddingHorizontal: cardSize / 5 }]}>
                {board.map((card, index) => {
                    const isTurnedOver = selectedCards.includes(index) || matchedCards.includes(index);
                    const isMatched = matchedCards.includes(index);
                    const isIncorrect = incorrectCards.includes(index);
                    let borderColor = "white";

                    if (isMatched) {
                        borderColor = "green";
                    }
                    if (isIncorrect && !isMatched) {
                        borderColor = "red";
                    }

                    return (
                        <Card2
                            key={index}
                            isTurnedOver={isTurnedOver}
                            onPress={() => handleTapCard(index)}
                            style={{
                                width: cardSize,
                                height: cardSize,
                                ...styles.card,
                                borderColor: borderColor,
                            }}
                        >
                            {isTurnedOver ? card : "❓"}
                        </Card2>
                    );
                })}
            </View>
            {showCongratulation && (
                <View style={styles.congratulationContainer}>
                    <Text style={styles.congratulationText}>¡FELICIDADES, DESEAS MÁS DIFICULTAD?</Text>

                    <View style={styles.buttonsContainer}>
                        <Animated.View
                            style={[styles.button, {
                                backgroundColor: buttonColor.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#FF6347', '#4CAF50']
                                })
                            }]}
                        >
                            <TouchableOpacity onPress={() => navigation.navigate("Tabs")}>
                                <Text style={styles.buttonText1}>👉 PUNTUACIÓN</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View
                            style={[styles.button, {
                                backgroundColor: buttonColor.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#FF6347', '#4CAF50']
                                })
                            }]}
                        >
                            <TouchableOpacity onPress={resetGame}>
                                <Text style={styles.buttonText2}>🎮 CONTINUAR JUGANDO</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            )}

            <StatusBar style="light" />
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
    },
    headerContainer: {
        backgroundColor: "rgba(0,0,0,0.9)",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontFamily: "Poker", // Fuente específica para el botón de "Poker"
        fontSize: 45,
        color: "#FFFF",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    time: {
        fontFamily: "Poker", // Fuente específica para el botón de "Poker"
        fontSize: 45,
        color: "#FFFF",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    timeLow: {
        color: "red",
    },
    board: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    card: {
        margin: 5,
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e293b",
        borderRadius: 5,
    },
    congratulationContainer: {
        position: "absolute",
        top: "50%",
        left: "40%",
        transform: [{ translateX: -150 }, { translateY: -50 }],
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,

    },
    congratulationText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "Memoria",
        marginBottom: 15,
    },
    button: {
        paddingVertical: 1,
        paddingHorizontal: 1,
        borderRadius: 5,
    },
    buttonText1: {
        color: "#fff",
        fontSize: 28,
        fontFamily: "Memoria",
    },
    buttonText2: {
        color: "#fff",
        fontSize: 28,
        fontFamily: "Memoria",
    },
    buttonsContainer: {
        flexDirection: "column",  // Cambiar para que los botones estén uno debajo del otro
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,  // Espacio entre los botones y el mensaje
        gap: 20, // Espacio entre los botones
    },

});

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}