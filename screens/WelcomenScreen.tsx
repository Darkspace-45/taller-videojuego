import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

export default function WelcomeScreen({navigation} : any) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/hue.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a "Doom Epic"!</Text>
      <Text style={styles.subtitle}>¡Bienvenido, soldado! Prepárate para la batalla y vence a tus enemigos.</Text>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Iniciar Secion</Text>
      </TouchableOpacity>
      <View style={styles.registercont}>
      <Text style={styles.subtitle2}>O regístrate para ser un marine: </Text>
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