import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TitleComponent } from '../components/title';
import { BodyComponent } from '../components/BodyComponent';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/Config';

export default function LoginScreen({ navigation }: any) {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");

    // Animaciones
    const rotateMiddle = new Animated.Value(0); 

    useEffect(() => {
        
        Animated.loop(
            Animated.timing(rotateMiddle, {
                toValue: 1,
                duration: 2000, 
                useNativeDriver: true, 
            })
        ).start();
    }, []);

    function login() {
        if (!correo || !contraseña) {
            // Validación para campos vacíos
            Alert.alert('Error', 'Por favor ingrese los datos en todos los campos.');
            return;
        }
        signInWithEmailAndPassword(auth, correo, contraseña)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                navigation.navigate('dificultad');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                let titulo = '';
                let mensaje = '';
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
            <TitleComponent title='Iniciar Sesión' />
            <Text>{'\n'}</Text>
            <BodyComponent>
                <View>
                    <Text style={styles.titleBody}>Bienvenido!</Text>
                    <Text style={styles.descriptionBody}>Inicia sesión para acceder al juego.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Animated.Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/128/4351/4351196.png" }}
                        style={[styles.img, {
                            transform: [{
                                rotateY: rotateMiddle.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '720deg'] 
                                })
                            }]
                        }]}
                    />
                    <Animated.Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/128/4614/4614235.png" }}
                        style={[styles.img, {
                            transform: [{
                                rotateY: rotateMiddle.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '720deg'] 
                                })
                            }]
                        }]}
                    />
                    <Animated.Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/128/4351/4351463.png" }}
                        style={[styles.img, {
                            transform: [{
                                rotateY: rotateMiddle.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '720deg']
                                })
                            }]
                        }]}
                    />
                </View>

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
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Restablecer')}>
                        <Text style={styles.restableco}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btn} onPress={() => login()}>
                    <Text style={styles.titleBody}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </BodyComponent>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        marginTop: 30,
        width: '80%', 
    },
    img: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
        borderRadius: 55, 
    },
    continput: {
        flexDirection: "column", 
        alignItems: 'center', 
        marginTop: 20,
        width: '85%', 
        alignSelf: 'center', 
    },
    input: {
        backgroundColor: '#FFF8E1', 
        paddingVertical: 15, 
        paddingHorizontal: 18,
        borderRadius: 10, 
        marginBottom: 15,
        width: '100%', 
        fontFamily: 'Georgia', 
        fontSize: 18,
        borderColor: '#D3A36E', 
        borderWidth: 2,
    },
    input2: {
        backgroundColor: '#FFF8E1', 
        paddingVertical: 15, 
        paddingHorizontal: 18,
        borderRadius: 10, 
        marginBottom: 15,
        width: '100%', 
        fontFamily: 'Georgia', 
        fontSize: 18,
        borderColor: '#D3A36E', 
        borderWidth: 2,
    },
    titleBody: {
        fontSize: 25, 
        fontWeight: 'bold',
        color: '#9E5A3E', 
        textAlign: 'center',
        fontFamily: 'Papyrus', 
        textShadowColor: '#D28F1D', 
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10,
    },
    descriptionBody: {
        fontSize: 18,
        color: '#6F4F30', 
        fontFamily: 'Georgia', 
        textAlign: 'center',
        marginTop: 10,
    },
    btn: {
        backgroundColor: '#FFF8E1', 
        paddingVertical: 5, 
        paddingHorizontal: 18,
        borderRadius: 0, 
        marginBottom: 15,
        width: '100%', 
        fontFamily: 'Georgia', 
        fontSize: 18,
        borderColor: '#D3A36E', 
        borderWidth: 2,
    },
    btnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Arial', 
    },
    smallText: {
        fontSize: 12,
        color: '#9E5A3E', 
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Georgia', 
    },
    restableco:{
        fontSize: 16,
        color: '#ee1133',
        textDecorationLine: 'underline',
    }
});
