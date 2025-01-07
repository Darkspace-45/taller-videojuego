import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList } from 'react-native';
import { db } from '../config/Config';
import { ref, get } from 'firebase/database';

type ScoreItem = {
    score: number;
    timestamp: Date;
};

export const ScoresScreen = () => {
    const [scores, setScores] = useState<ScoreItem[] | any>([]);

    useEffect(() => {
        const readScores = async () => {
            const scoresRef = ref(db, 'scores');
            const scoresSnapshot = await get(scoresRef);
            const scoresData = scoresSnapshot.val();
            setScores([scoresData]);
        };
        readScores();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Puntajes</Text>
            <FlatList
                data={scores}
                keyExtractor={(item) => item.timestamp ? item.timestamp.toString() : ''}
                renderItem={({ item }) => (
                    <Text style={styles.scoreItem}>
                        Puntaje: {item.score} 
                    </Text>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'snow',
        marginBottom: 20,
        marginTop: 20,
    },
    scoreItem: {
        fontSize: 18,
        color: '#94a3b8',
        marginVertical: 5,
    },
});