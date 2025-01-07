import * as React from "react";
import { SafeAreaView, StyleSheet, Text, FlatList } from "react-native";
import { dbs } from "../config/Config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

type Score = {
    id: string;
    score: number;
    timestamp: Date;
    playerName: string; // Campo para el nombre del jugador
};

export default function ScoreScreen() {
    const [scores, setScores] = React.useState<Score[]>([]);

    React.useEffect(() => {
        const scoresQuery = query(
            collection(dbs, "scores"),
            orderBy("score", "desc"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(scoresQuery, (snapshot) => {
            const fetchedScores = snapshot.docs.map((doc) => ({
                id: doc.id,
                score: doc.data().score,
                timestamp: doc.data().timestamp.toDate(),
                playerName: doc.data().playerName, // Obtener el nombre del jugador
            }));
            setScores(fetchedScores);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Tabla de Puntuación:</Text>
            <FlatList
                data={scores}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Text style={styles.scoreItem}>
                        {index + 1}. {item.playerName}: Score: {item.score} - Date: {item.timestamp.toLocaleDateString()}
                    </Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "snow",
        marginBottom: 20,
        marginTop: 20
    },
    scoreItem: {
        fontSize: 18,
        color: "#94a3b8",
        marginVertical: 5,
    },
});
