import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={require('../assets/img/cartas.jpg')} // Imagen de fondo.
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/img/tarjetas.png')}
          style={styles.logo}
        />
        <View style={styles.textBox}>
          <Text style={styles.title}>¡Bienvenido a "Caza Pares"!</Text>
          <Text style={styles.subtitle}>
            ¡Prepárate para poner a prueba tu memoria y agilidad visual!
          </Text>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.subtitle2}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}> Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente.
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  title: {
    fontSize: 32,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'serif', // Cambia a una fuente temática.
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'serif', // Fuente acorde con naipes.
  },
  subtitle2: {
    fontSize: 20,
    color: '#FFD700', // Color dorado para que destaque.
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente.
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0,
    textAlign: 'center',
  },
  registerText: {
    fontSize: 20, // Aumenté el tamaño.
    color: '#1E90FF', // Cambié a dorado para coherencia temática.
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textDecorationLine: 'underline', // Subrayado para resaltar como un enlace.
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente.
    borderRadius: 0,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
