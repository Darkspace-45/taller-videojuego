import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../config/Config';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function RestablecerScreen({ navigation }: any) {
    const [correo, setcorreo] = useState('');
    function restablecer() {
        sendPasswordResetEmail(auth, correo)
            .then(() => {
                // Password reset email sent!
                // ..
                Alert.alert('Mensaje, se envio un mensaje al correo')
                navigation.navigate('Login')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                Alert.alert(errorCode, errorMessage)
            });
    } 
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Restablece tu contraseña</Text>
            <TextInput
                placeholder='Ingresar Correo'
                style={styles.input}
                keyboardType='email-address'
                onChangeText={setcorreo} />
            <TouchableOpacity style={styles.button} onPress={() => restablecer()}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        fontSize: 20,
        margin: 10,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        width: '90%',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 40,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
})