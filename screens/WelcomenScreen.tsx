import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

export default function WelcomeScreen({navigation} : any) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/sensorial.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a "Caza Pares"!</Text>
      <Text style={styles.subtitle}>¡Bienvenido! Prepárate para poner a prueba tu memoria</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={()=> navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.registercont}>
      <Text style={styles.subtitle2}>¿No tienes cuenta? Registrate aquí: </Text>
      <TouchableOpacity
      onPress={()=> navigation.navigate("Register")} >
        <Text style={styles.subtitle2}>Registrarse</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign:'center'
  },
  subtitle2: {
    fontSize: 14,
    color: '#fff',
    marginTop: 15
  },
  buttonContainer: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  registercont:{
    flexDirection: 'row'
  }
});