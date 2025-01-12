import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import Card from "../components/Card";
import { db } from '../config/Config';
import { ref, set } from 'firebase/database'; 

const doomCards: string[] = [
    "🕹️", "💀", "🔫", "🩸", "🔥", "👾",
    "🕹️", "💀", "🔫", "🩸", "🔥", "👾",
    "⚔️", "⚔️", "💣", "💣"
];


type RootStackParamList = {
    JuegoDoom: undefined;
    ScoreScreen: { score: number };
};

export default function JuegoDoom() {
    const [board, setBoard] = React.useState<string[]>(() => shuffle([...doomCards]));
    const [selectedCards, setSelectedCards] = React.useState<number[]>([]);
    const [matchedCards, setMatchedCards] = React.useState<number[]>([]);
    const [score, setScore] = React.useState<number>(0);
    const [timeLeft, setTimeLeft] = React.useState<number>(90); // Tiempo inicial en segundos

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'JuegoDoom'>>();

    useEffect(() => {
        if (timeLeft === 0) {
            navigation.navigate("ScoreScreen", { score });
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, score, navigation]);

    useEffect(() => {
        if (selectedCards.length < 2) return;

        if (board[selectedCards[0]] === board[selectedCards[1]]) {
            setMatchedCards((prev) => [...prev, ...selectedCards]);
            setScore((prev) => prev + 20);
            setTimeLeft((prev) => prev + 5);
            setSelectedCards([]);
        } else {
            const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [selectedCards, board]);

    useEffect(() => {
        if (matchedCards.length === board.length) {
            setTimeLeft((prev) => prev + 15);
            resetGame();
        }
    }, [matchedCards]);

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

    const saveScore = async () => {
        await set(ref(db, 'scores'), {
            score: score,
            timestamp: new Date().toISOString(),
        });
    };

    const { width } = Dimensions.get("window");
    const cardSize = width / 5 - 12;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Memory Doom</Text>
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

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
