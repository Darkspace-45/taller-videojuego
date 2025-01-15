import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, Dimensions, ImageBackground } from "react-native";
import { auth, db } from "../config/Config";
import { get, ref, set } from "firebase/database";
import Card from "../components/Card";
import { useFonts } from "expo-font"; // Asegúrate de importar useFonts para cargar la fuente

const doomCards = ["🐷", "🪝", "⚛️", "🔑", "🥕", "🥑", "🐷", "🪝", "⚛️", "🔑", "🥕", "🥑"];

export default function JuegoMemory({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Memoria: require("../assets/fonts/MemoriaVestri.ttf"),
    });

    const [board, setBoard] = React.useState(() => shuffle([...doomCards]));
    const [selectedCards, setSelectedCards] = React.useState<number[]>([]);
    const [matchedCards, setMatchedCards] = React.useState<number[]>([]);
    const [incorrectCards, setIncorrectCards] = React.useState<number[]>([]); // Para cartas incorrectas
    const [score, setScore] = React.useState(0);
    const [timeLeft, setTimeLeft] = React.useState(40);

    const user = auth.currentUser;

    // Timer para el juego
    useEffect(() => {
        if (timeLeft <= 0) {
            navigation.navigate("Tabs");
            return;
        }

        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, score, navigation]);

    if (!fontsLoaded) {
        return <Text>Cargando fuentes...</Text>; // Muestra un mensaje mientras las fuentes cargan
    }

    // Lógica de coincidencia de cartas
    useEffect(() => {
        if (selectedCards.length < 2) return;

        if (board[selectedCards[0]] === board[selectedCards[1]]) {
            setMatchedCards((prev) => [...prev, ...selectedCards]);
            setScore((prev) => prev + 20);
            setTimeLeft((prev) => prev + 2);
        } else {
            setIncorrectCards((prev) => [...prev, ...selectedCards]); // Agregar a las cartas incorrectas
        }

        const timeoutId = setTimeout(() => {
            setSelectedCards([]);
            setIncorrectCards([]); // Limpiar las cartas incorrectas después de un breve delay
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [selectedCards, board]);

    // Reinicia el juego si todas las cartas coinciden
    useEffect(() => {
        if (matchedCards.length === board.length) {
            setTimeLeft((prev) => prev + 5);
            resetGame();
        }
    }, [matchedCards]);

    // Guarda el puntaje en Firebase
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
        setBoard(shuffle([...doomCards]));
        setSelectedCards([]);
        setMatchedCards([]);
    };

    const { width } = Dimensions.get("window");
    const cardSize = width / 4 - 5;

    return (
        <ImageBackground source={require("../assets/img/Iconos.jpg")} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Memory</Text>
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
                    const isIncorrect = incorrectCards.includes(index); // Verifica si es incorrecta
                    let borderColor = "white"; // Color por defecto

                    // Si la carta está emparejada, poner verde
                    if (isMatched) {
                        borderColor = "green";
                    }
                    // Si las dos cartas son incorrectas, poner rojo
                    if (isIncorrect && !isMatched) {
                        borderColor = "red";
                    }

                    return (
                        <Card
                            key={index}
                            isTurnedOver={isTurnedOver}
                            onPress={() => handleTapCard(index)}
                            style={{
                                width: cardSize,
                                height: cardSize,
                                ...styles.card,
                                borderColor: borderColor, // Cambiar color del borde
                            }}
                        >
                            {isTurnedOver ? card : "❓"}
                        </Card>
                    );
                })}
            </View>
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
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontFamily: "Memoria", // Fuente específica para el botón de "Memory"
        fontSize: 35,
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
        fontFamily: "Memoria", // Fuente específica para el botón de "Memory"
        fontSize: 35,
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
});

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
