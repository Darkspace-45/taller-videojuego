import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/hue.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a "Doom Epic"!</Text>
      <Text style={styles.subtitle}>¡Bienvenido, soldado! Prepárate para la batalla y vence a tus enemigos.</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>¡Jugar ahora!</Text>
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
});