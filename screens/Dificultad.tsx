import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";



const Dificultad = ( { navigation }: any) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona una dificultad</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('JuegoM')}
            >
                <Text style={styles.buttonText}>Memory (Fácil)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('JuegoD')}
            >
                <Text style={styles.buttonText}>Doom (Intermedio)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('JuegoP')}
            >
                <Text style={styles.buttonText}>Poker (Difícil)</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#1e293b",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Dificultad;
