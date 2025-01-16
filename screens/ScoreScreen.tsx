import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/Config";
import { onValue, ref } from "firebase/database";
import { useFonts } from "expo-font";

// Definimos la interfaz Record para representar un récord individual
interface Record {
    username: string;
    score: number;
}

export default function ScoreScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Retro: require("../assets/fonts/PressStart2P-Regular.ttf"), // Fuente retro de arcade
    });

    if (!fontsLoaded) {
        return <Text>Cargando fuentes...</Text>; // Muestra un mensaje mientras las fuentes cargan
    }

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

    // Array con los colores que quieres que el texto de puntaje cambie
    const colors = ["#FFD700", "#FF4500", "#32CD32", "#1E90FF", "#FF69B4"];

    // Estado para controlar el índice de color
    const [colorIndex, setColorIndex] = useState(0);

    // Cambiar el color cada 500ms
    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex(prevIndex => (prevIndex + 1) % colors.length);
        }, 500); // Cambiar de color cada medio segundo

        return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    return (
        <ImageBackground source={require('../assets/img/videojuego1.jpg')} style={styles.backgroundImage}>
            <SafeAreaView style={styles.container}>
                <Text style={[styles.title, { color: colors[colorIndex] }]}>🏆Tu Puntaje🏆</Text>
                {record ? (
                    <View style={styles.recordContainer}>
                        <Text style={[styles.recordText, { color: colors[colorIndex] }]}>Puntaje: {record.score}</Text>
                    </View>
                ) : (
                    <Text style={styles.recordText}>Cargando puntaje...</Text>
                )}
                <View>
                    {/* Mostrar el ranking general */}
                    <Text style={styles.rankingTitle}>🌟 Ranking 🌟</Text>
                    {allRecords.map((item, index) => (
                        <Text key={index} style={styles.rankingText}>
                            {index + 1}.{item.username}:{item.score}
                        </Text>
                    ))}
                </View>
                <TouchableOpacity style={styles.volverButton} onPress={() => navigation.navigate('dificultad')}>
                    <Text style={styles.volverText}>🔙 Volver</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
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
