import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/Config";
import { onValue, ref } from "firebase/database";

export default function ScoreScreen({ navigation }: any) {
    const [record, setRecord] = useState<{ username: string, score: number } | null>(null); // Estado para almacenar el récord del usuario
    const [userName, setUserName] = useState<string | null>(null); // Estado para almacenar el nombre del usuario
    const [allRecords, setAllRecords] = useState<any[]>([]);  // Estado para almacenar todos los récords
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

    // Verifica que el nombre de usuario y los datos estén disponibles antes de renderizar
    if (!userName) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Cargando usuario...</Text>  {/* Cargando usuario */}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Bienvenido {userName}</Text> {/* Mostrar el nombre del usuario */}
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
