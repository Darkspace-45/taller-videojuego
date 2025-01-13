import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Card from "../components/Card";
import { auth, db } from "../config/Config";
import { get, ref, set } from "firebase/database";

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

export default function JuegoPoker() {
    const [board, setBoard] = React.useState<string[]>(() => shuffle([...duplicatedPokerCards]));
    const [selectedCards, setSelectedCards] = React.useState<number[]>([]);
    const [matchedCards, setMatchedCards] = React.useState<number[]>([]);
    const [score, setScore] = React.useState<number>(0);
    const [timeLeft, setTimeLeft] = React.useState<number>(100); // Tiempo inicial en segundos

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'JuegoPoker'>>();
    const user = auth.currentUser;

    // Timer para el juego
    useEffect(() => {
        if (timeLeft <= 0) {
            navigation.navigate("ScoreScreen", { score });
            return;
        }

        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, score, navigation]);

    // Lógica de coincidencia de cartas
    useEffect(() => {
        if (selectedCards.length < 2) return;

        if (board[selectedCards[0]] === board[selectedCards[1]]) {
            setMatchedCards((prev) => [...prev, ...selectedCards]);
            setScore((prev) => prev + 50);  
            setTimeLeft((prev) => prev + 10);  
        }

        const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
        return () => clearTimeout(timeoutId);
    }, [selectedCards, board]);

    // Reinicia el juego si todas las cartas coinciden
    useEffect(() => {
        if (matchedCards.length === 30) {
            setTimeLeft((prev) => prev + 30);  
            resetGame();
        }
    }, [matchedCards]);

    // Guarda el puntaje en Firebase
    const saveScore = async () => {
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
    };

    const { width } = Dimensions.get("window");
    const cardSize = width / 6 - 10;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Memory Poker</Text>
            <Text style={styles.title}>Score: {score}</Text>
            <Text style={styles.title}>Tiempo restante: {timeLeft}s</Text>
            <View style={[styles.board, { paddingHorizontal: cardSize / 5 }]}>
                {board.map((card, index) => {
                    const isTurnedOver =
                        selectedCards.includes(index) || matchedCards.includes(index);
                    return (
                        <Card
                            key={index}
                            isTurnedOver={isTurnedOver}
                            onPress={() => handleTapCard(index)}
                            style={{ width: cardSize, height: cardSize }}
                        >
                            {card}
                        </Card>
                    );
                })}
            </View>
            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
    },
    board: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "snow",
        marginVertical: 15,
    },
});

// Shuffle function
function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
