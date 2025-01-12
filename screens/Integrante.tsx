import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Integrante() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integrantes del equipo</Text>
      <View style={styles.integrante}>
        <Text style={styles.name}>Brian Rodiguez</Text>
        <Text style={styles.info}>Usuario: Darkspace-45 Email: bsrp2005@gmail.com</Text>
      </View>
      <View style={styles.integrante}>
        <Text style={styles.name}>Emilio Chacha</Text>
        <Text style={styles.info}>Usuario: emilio211204 Email: joseulcuango32@gmail.com</Text>
      </View>
      <View style={styles.integrante}>
        <Text style={styles.name}>Daniel llumiquinga</Text>
        <Text style={styles.info}>Usuario: dannielsLlumy Email: danielllumiquinga20102004@gmail.com</Text>
      </View>
      <View style={styles.integrante}>
        <Text style={styles.name}>Jose Franco</Text>
        <Text style={styles.info}>Usuario: kotesu103 Email: josefranco20102004@gmail.com</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  integrante: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
})