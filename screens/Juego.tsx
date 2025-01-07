import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import Card from "../components/Card";
import { db } from '../config/Config'; // Importa la configuración de Firebase
import { ref, set } from 'firebase/database'; // Importa las funciones de Firebase

const cards: string[] = [
    "🐷",
    "🪝",
    "⚛️",
    "🔑",
    "🥕",
    "🥑",
];

type RootStackParamList = {
    Juego: undefined;
    ScoreScreen: { score: number };
};

export default function Juego() {
    const [board, setBoard] = React.useState<string[]>(() => shuffle([...cards, ...cards]));
    const [selectedCards, setSelectedCards] = React.useState<number[]>([]);
    const [matchedCards, setMatchedCards] = React.useState<number[]>([]);
    const [score, setScore] = React.useState<number>(0);
    const [timeLeft, setTimeLeft] = React.useState<number>(30); // Tiempo inicial en segundos (1 minuto)

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Juego'>>();

    // Efecto para el temporizador
    useEffect(() => {
        if (timeLeft === 0) {
            // Si el tiempo se agotó, navega a la pantalla de puntajes
            navigation.navigate("ScoreScreen", { score });
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000); // Disminuye cada segundo

        return () => clearInterval(timerId); // Limpiar el temporizador cuando el componente se desmonte
    }, [timeLeft, score, navigation]);

    useEffect(() => {
        if (selectedCards.length < 2) return;

        if (board[selectedCards[0]] === board[selectedCards[1]]) {
            setMatchedCards((prev) => [...prev, ...selectedCards]);
            setScore((prev) => prev + 15);
            setSelectedCards([]);
        } else {
            const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [selectedCards, board]);

    useEffect(() => {
        if (matchedCards.length === board.length) {
            navigation.navigate("ScoreScreen", { score });
        }
    }, [matchedCards, navigation, score]);

    // Guarda el puntaje en el Realtime Database
    useEffect(() => {
        saveScore();
    }, [score]);

    const handleTapCard = (index: number): void => {
        if (selectedCards.length >= 2 || selectedCards.includes(index)) return;
        setSelectedCards((prev) => [...prev, index]);
    };

    const didPlayerWin = (): boolean => matchedCards.length === board.length;

    const saveScore = async () => {
        await set(ref(db, 'scores'), {
            score: score,
            timestamp: new Date(),
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                {didPlayerWin() ? "Felicitaciones 🎉" : "Memory"}
            </Text>
            <Text style={styles.title}>Score: {score}</Text>
            <Text style={styles.title}>Tiempo restante: {timeLeft}s</Text>
            <View style={styles.board}>
                {board.map((card, index) => {
                    const isTurnedOver =
                        selectedCards.includes(index) || matchedCards.includes(index);
                    return (
                        <Card
                            key={index}
                            isTurnedOver={isTurnedOver}
                            onPress={() => handleTapCard(index)}
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
        justifyContent: "center",
        flexWrap: "wrap",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "snow",
        marginVertical: 15,
    },
});

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
