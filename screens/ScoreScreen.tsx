import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

    // Función para leer los puntajes y el nombre de usuario de Firebase
    const leer = () => {
        if (user && user.uid) {
            const starCountRef = ref(db, 'usuarios/' + user.uid);  // Ruta del usuario en Firebase
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                setUserName(data?.nombre);  // Obtén el nombre desde la base de datos de Firebase
                setRecord({
                    username: data?.nombre || 'Usuario',  // Asume que 'nombre' es el campo donde guardas el nombre
                    score: data?.score || 0,  // Asegúrate de tener el campo score en tu base de datos
                });
            });
        }
    };

    useEffect(() => {
        leer();  // Llamar la función para obtener los datos desde Firebase
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
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    rankingTitle: {
        fontSize: 20,
        fontFamily: "Retro", // Asegúrate de que la fuente Retro esté cargada
        textAlign: "center",
        color: "#FFD700", // Color dorado
        textShadowColor: "#000000", // Sombra negra
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 15,
        letterSpacing: 2.0, // Separación ligera entre las letras
    },
    title: {
        fontSize: 20,
        fontFamily: "Retro", // Asegúrate de que la fuente Retro esté cargada
        textAlign: "center",
        textShadowColor: "#000000", // Sombra negra
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 15,
        letterSpacing: 2.0, // Separación ligera entre las letras
    },
    recordContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    recordText: {
        fontSize: 14,
        textShadowColor: "#FFF",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
        fontFamily: "Retro", // Asegúrate de que la fuente Retro esté cargada
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 15,
    },
    
    rankingText: {
        fontSize: 14,
        color: "#00FFFF", // Color cian brillante
        textShadowColor: "#FFF",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
        fontFamily: "Retro", // Asegúrate de que la fuente Retro esté cargada
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 15,
    },
    volverButton: {
        backgroundColor: "#8B0000",
        padding: 15,
        borderRadius: 10,
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF6347", // Sombra naranja
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    volverText: {
        fontSize: 14,
        color: "#00FFFF", // Color cian brillante
        textShadowColor: "#FFF",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
        fontFamily: "Retro", // Asegúrate de que la fuente Retro esté cargada
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 15,
    },
});
