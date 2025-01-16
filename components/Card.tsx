import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface CardProps {
    isTurnedOver: boolean;
    onPress: () => void;
    children: React.ReactNode;
    style?: ViewStyle; // Asegúrate de que acepta la prop `style`
}

const Card: React.FC<CardProps> = ({ isTurnedOver, onPress, children, style }) => {
    return (
        <TouchableOpacity
            style={[styles.card, style, isTurnedOver && styles.turnedOver]}
            onPress={onPress}
        >
            <Text style={styles.text}>
                {isTurnedOver ? children : "?"}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 5,
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e293b",
        borderRadius: 5,
    },
    turnedOver: {
        backgroundColor: "#f87171",
    },
    text: {
        fontSize: 40,
        color: "white",
    },
});

export default Card;
