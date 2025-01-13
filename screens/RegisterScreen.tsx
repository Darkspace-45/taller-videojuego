import { Alert, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { BodyComponent } from '../components/BodyComponent';
import { TitleComponent } from '../components/title';
import { INPUT_COLOR } from '../commons/constans';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/Config';
import { ref, set } from 'firebase/database';

export default function RegisterScreen({ navigation }: any) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [vcontraseña, setVcontraseña] = useState("");
  const [edad, setEdad] = useState("");

  function registro() {
    if (contraseña !== vcontraseña) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    createUserWithEmailAndPassword(auth, correo, contraseña)
      .then((userCredential) => {
        const user = userCredential.user;
        set(ref(db, 'usuarios/' + nombre), {
          apellido: apellido,
          correo: correo,
          edad: edad,
        });
        Alert.alert('Registro exitoso', 'Usuario registrado correctamente.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        let titulo = '';
        let mensaje = '';

        if (errorCode === 'auth/weak-password') {
          titulo = 'Contraseña débil';
          mensaje = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (errorCode === 'auth/email-already-in-use') {
          titulo = 'Correo ya registrado';
          mensaje = 'Este correo ya está en uso.';
        } else {
          titulo = 'Error';
          mensaje = 'Verifique los detalles ingresados.';
        }
        Alert.alert(titulo, mensaje);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={INPUT_COLOR} barStyle="light-content" />
      <TitleComponent title="Registro de Usuario" />
      <BodyComponent>
        <View>
          <Text style={styles.titleBody}>¡Bienvenido!</Text>
          <Text style={styles.descriptionBody}>
            Ingresa los datos solicitados para continuar
          </Text>
        </View>
        {/* Nombre y Apellido */}
        <View>
          <Text style={styles.titleBody2}>Ingrese su nombre y apellido:</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Nombre"
              placeholderTextColor={'#888'}
              style={[styles.input, styles.halfWidth]}
              onChangeText={(texto) => setNombre(texto)}
              value={nombre}
            />
            <TextInput
              placeholder="Apellido"
              placeholderTextColor={'#888'}
              style={[styles.input, styles.halfWidth]}
              onChangeText={(texto) => setApellido(texto)}
              value={apellido}
            />
          </View>
        </View>
        {/* Correo */}
        <View>
          <Text style={styles.titleBody2}>Ingrese su correo:</Text>
          <TextInput
            placeholder="Correo"
            placeholderTextColor={'#888'}
            style={styles.input}
            onChangeText={(texto) => setCorreo(texto)}
            value={correo}
          />
        </View>
        {/* Contraseña */}
        <View>
          <Text style={styles.titleBody2}>Ingrese su contraseña:</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor={'#888'}
              style={[styles.input, styles.halfWidth]}
              onChangeText={(texto) => setContraseña(texto)}
              value={contraseña}
              secureTextEntry={true}
            />
            <TextInput
              placeholder="Verifique Contraseña"
              placeholderTextColor={'#888'}
              style={[styles.input, styles.halfWidth]}
              onChangeText={(texto) => setVcontraseña(texto)}
              value={vcontraseña}
              secureTextEntry={true}
            />
          </View>
        </View>
        {/* Edad */}
        <View>
          <Text style={styles.titleBody2}>Ingrese su edad:</Text>
          <TextInput
            placeholder="Edad"
            placeholderTextColor={'#888'}
            style={styles.input}
            onChangeText={(texto) => setEdad(texto)}
            value={edad}
            keyboardType="numeric"
          />
        </View>
        {/* Botón */}
        <TouchableOpacity style={styles.btn} onPress={() => registro()}>
          <Text style={styles.btnText}>Registrarse</Text>
        </TouchableOpacity>
      </BodyComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  titleBody: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 10,
  },
  descriptionBody: {
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleBody2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 0,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#dcdde1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  halfWidth: {
    width: '48%',
  },
  btn: {
    marginTop: 30,
    backgroundColor: '#2980b9',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});
