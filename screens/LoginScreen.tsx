import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { INPUT_COLOR, PRIMARY_COLOR} from '../commons/constans'
import { TitleComponent } from '../components/title'
import { BodyComponent } from '../components/BodyComponent'

export default function LoginScreen() {
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")

    return (
        <View>
            <StatusBar backgroundColor={PRIMARY_COLOR} />
            <TitleComponent title='Iniciar Sesión' />
            <Text>{'\n'}</Text>
            <BodyComponent>
                <View>
                    <Text style={styles.titleBody}>Bienvenido Soldado!</Text>
                    <Text style={styles.descriptionBody}>Inicia sesión para acceder a tu cuenta.</Text>
                </View>
                <View style={styles.contimf}>
                    <Image source={{ uri: "https://art.pixilart.com/e09926b6c235457.png" }}
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
                    />
                </View>
                <TouchableOpacity style={styles.btn}>
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
    container:{
        color: '#235f52'
    }
})