import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Juego() {
    return (
        <View>
            <Text style={styles.text}>Juego</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    }
})