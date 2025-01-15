import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

export default function WelcomeScreen({ navigation }: any) {
  const rotation = useRef(new Animated.Value(0)).current;
  const colorChange = useRef(new Animated.Value(0)).current; // Valor para la animación del color

  // Efecto de rotación de la imagen
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 3000, // Duración de la rotación (puedes ajustarla)
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 3000, // Duración de la rotación (puedes ajustarla)
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotation]);

  // Interpolación para la rotación
  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Gira de 0 a 180 grados
  });

  // Interpolación para cambiar el color del texto
  const colorInterpolation = colorChange.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ['#FAD7A0', '#A9DFBF', '#AED6F1', '#F9E79F', '#D7BDE2', '#F5CBA7'], // Colores para el cambio
  });

  // Inicia la animación del color del texto
  useEffect(() => {
    Animated.loop(
      Animated.timing(colorChange, {
        toValue: 1,
        duration: 5000, // Duración de la animación del color
        useNativeDriver: false,
      })
    ).start();
  }, [colorChange]);

  return (
    <ImageBackground
      source={require('../assets/img/cartas.jpg')} // Imagen de fondo.
      style={styles.background}
    >
      <View style={styles.container}>
        <Animated.Image
          source={require('../assets/img/tarjetas.png')}
          style={[styles.logo, { transform: [{ rotateY: rotateInterpolation }] }]} // Aplica el efecto de rotación
        />
        <View style={styles.textBox}>
          {/* Aplicar color interpolado al texto */}
          <Animated.Text style={[styles.title, { color: colorInterpolation }]}>
            ¡Bienvenido a "Caza Pares"!
          </Animated.Text>
          <Text style={styles.subtitle}>
            ¡Prepárate para poner a prueba tu memoria y agilidad visual!
          </Text>
        </View>
        {/* Usamos Animated.View en lugar de TouchableOpacity */}
        <Animated.View
          style={[styles.buttonContainer, { backgroundColor: colorInterpolation }]} // Cambia el color del botón
        >
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semitransparente.
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semitransparente.
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semitransparente.
    borderRadius: 0,
    textAlign: 'center',
  },
  buttonContainer: {
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
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
