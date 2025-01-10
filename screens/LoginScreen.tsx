import { Alert, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { INPUT_COLOR, PRIMARY_COLOR } from '../commons/constans'
import { TitleComponent } from '../components/title'
import { BodyComponent } from '../components/BodyComponent'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { dbs } from '../config/Config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/Config';

export default function LoginScreen({ navigation }: any) {
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    function login() {
        if (!correo || !contraseña) {
            // Validación para campos vacíos
            Alert.alert('Error', 'Por favor ingrese los datos en todos los campos.');
            return;
        }
        signInWithEmailAndPassword (auth, correo, contraseña)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                navigation.navigate('Juego');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                let titulo = '';
                let mensaje = '';
                // ...
                if (errorCode === 'auth/invalid-credential') {
                    titulo = 'Credenciales inválidas';
                    mensaje = 'Las credenciales son incorrectas, Verificar!';
                } else if (errorCode === 'auth/invalid-email') {
                    titulo = 'Error en el correo electrónico';
                    mensaje = 'Verificar la dirección de correo electrónico';
                } else {
                    titulo = 'Error';
                    mensaje = 'Verificar correo electrónico y contraseña';
                }
                Alert.alert(titulo, mensaje);
            });
    }

    return (
        <View>
            <StatusBar backgroundColor={PRIMARY_COLOR} />
            <TitleComponent title='Iniciar Sesión' />
            <Text>{'\n'}</Text>
            <BodyComponent>
                <View>
                    <Text style={styles.titleBody}>Bienvenido!</Text>
                    <Text style={styles.descriptionBody}>Inicia sesión para acceder al juego.</Text>
                </View>
                <View style={styles.contimf}>
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/994/994195.png" }}
                        style={styles.img} />
                </View>
                <Text style={styles.titleBody2}>Ingrese su correo y contraseña:</Text>
                <View style={styles.continput}>
                    <TextInput
                        placeholder='Correo'
                        placeholderTextColor={'black'}
                        style={styles.input2}
                        onChangeText={(texto) => setCorreo(texto)}
                        value={correo}
                    />
                    <TextInput
                        placeholder='Contraseña'
                        placeholderTextColor={'black'}
                        style={styles.input}
                        onChangeText={(texto) => setContraseña(texto)}
                        value={contraseña}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={styles.btn} onPress={() => login()}>
                    <Text style={styles.titleBody}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </BodyComponent>
        </View>
    )
}
const styles = StyleSheet.create({
    img: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 100,
        marginTop: 10
    },
    contimf: {
        alignItems: 'center'
    },
    input: {
        backgroundColor: INPUT_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 15,
        width: '50%'
    },
    input2: {
        backgroundColor: INPUT_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 15,
        width: '50%',
        marginRight: 10
    },
    continput: {
        flexDirection: "row",
        alignItems: 'center'
    },
    titleBody: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
    },
    titleBody2: {
        fontSize: 18,
        color: 'black',
        marginTop: 15
    },
    descriptionBody: {
        fontSize: 15,
        textAlign: 'center'
    },
    btn: {
        marginTop: 20,
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#90e683',
        paddingVertical: 15,
        width: '60%',
        borderRadius: 20
    },
    container: {
        color: '#235f52'
    }
})