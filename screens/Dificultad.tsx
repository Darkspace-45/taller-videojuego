import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Dificultad({ navigation }: any) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Selecciona una dificultad</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("JuegoM")}
            >
                <Text style={styles.buttonText}>Memory (Fácil)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("JuegoD")}
            >
                <Text style={styles.buttonText}>Doom (Intermedio)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("JuegoP")}
            >
                <Text style={styles.buttonText}>Poker (Difícil)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>👤</Text>
                </View>
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        position: "absolute",
        top: 0,
        right: 0,
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1e293b",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    icon: {
        fontSize: 24,
        color: "#fff",
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