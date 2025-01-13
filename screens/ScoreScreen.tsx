import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/Config";
import { onValue, ref } from "firebase/database";

// Definimos la interfaz Record para representar un récord individual
interface Record {
    username: string;
    score: number;
}

export default function ScoreScreen({ navigation }: any) {
    const [record, setRecord] = useState<Record | null>(null);  // Estado para almacenar el récord del usuario actual
    const [allRecords, setAllRecords] = useState<Record[]>([]);  // Estado para almacenar todos los récords
    const user = auth.currentUser;  // Obtener el usuario autenticado

    // Función para leer los puntajes de Firebase
    const leer = () => {
        const starCountRef = ref(db, 'users/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            let lista: any = Object.keys(data).map(uid => ({ uid, ...data[uid] }));
            setAllRecords(lista);

            // Filtramos y encontramos el récord del usuario actual usando user.uid
            if (user && user.uid) {
                const userRecord = lista.find((item: any) => item.uid === user.uid);
                if (userRecord) {
                    setRecord({ username: userRecord.username, score: userRecord.score });
                }
            }
        });
    };

    useEffect(() => {
        leer();  // Llamar la función para obtener los puntajes desde Firebase
    }, [user]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Tu Puntaje</Text>
            {record ? (
                <View style={styles.recordContainer}>
                    <Text style={styles.recordText}>Puntaje: {record.score}</Text>
                </View>
            ) : (
                <Text style={styles.recordText}>Cargando puntaje...</Text>
            )}
            <View>
                {/* Si quieres mostrar todos los puntajes */}
                <Text style={styles.title}>Ranking</Text>
                {allRecords.map((item, index) => (
                    <Text key={index} style={styles.recordText}>
                        {item.username}: {item.score}
                    </Text>
                ))}
            </View>
            <TouchableOpacity style={styles.volverButton} onPress={() => navigation.navigate('dificultad')}>
                <Text style={styles.volverText}>Volver</Text>
            </TouchableOpacity>
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
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "snow",
        marginBottom: 20,
    },
    recordContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    recordText: {
        fontSize: 20,
        color: "snow",
    },
    volverButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    volverText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
