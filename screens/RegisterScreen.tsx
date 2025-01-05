import { Image, StatusBar, StyleSheet, Text, TextInput, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { BodyComponent } from '../components/BodyComponent'
import { TitleComponent } from '../components/title'
import { INPUT_COLOR, PRIMARY_COLOR, SECUNDARY_COLOR } from '../commons/constans'



export default function RegisterScreen() {

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [correo, setCorreo] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [vcontraseña, setVcontraseña] = useState("")
  const [edad, setEdad] = useState("")

  const handleRegister = () => {
    if (nombre === "" || apellido === "" || correo === "" || contraseña === "" || vcontraseña === "" || edad === "") {
      alert("Por favor, coloque los datos solicitados");
    } else {
      setNombre("");
      setApellido("");
      setCorreo("");
      setContraseña("");
      setVcontraseña("");
      setEdad("");
      alert("Se ha registrado un nuevo usuario");
    }
  };
  

  return (
    <View>
      <StatusBar backgroundColor={INPUT_COLOR} />
      <TitleComponent title='Registro de Marine' />
      <BodyComponent>
      <View>
      <Text style={styles.titleBody}>Bienvenido marine!</Text>
      <Text style={styles.descriptionBody}>Listo para matar y desgarrar demonios!</Text>
                </View>
      <View style={styles.contimf}>
      <Image source={{ uri: "https://art.pixilart.com/e09926b6c235457.png" }} 
      style={styles.img}/>
      </View>
      <Text style={styles.titleBody2}>Ingrese su nombre y apellido: </Text>
      <View style={styles.continput}>
        <TextInput
          placeholder='Nombre'
          placeholderTextColor={'black'}
          style={styles.input2}
          onChangeText={ (texto)=> setNombre(texto) }
          value= {nombre}
        />
        <TextInput
          placeholder='Apellido'
          placeholderTextColor={'black'}
          style={styles.input}
          onChangeText={ (texto)=> setApellido(texto) }
          value= {apellido}
        />
        </View>
        <Text style={styles.titleBody2}>Ingrese su correo: </Text>
        <TextInput
          placeholder='Correo'
          placeholderTextColor={'black'}
          style={styles.input3}
          onChangeText={ (texto)=> setCorreo(texto) }
          value= {correo}
        />
        <Text style={styles.titleBody2}>Ingrese su contraseña: </Text>
        <View style={styles.continput}>
        <TextInput
          placeholder='Contraseña'
          placeholderTextColor={'black'}
          style={styles.input2}
          onChangeText={ (texto)=> setContraseña(texto) }
          value= {contraseña}
          secureTextEntry={true}

        />
        <TextInput
          placeholder='Verifique Contraseña'
          placeholderTextColor={'black'}
          style={styles.input}
          onChangeText={ (texto)=> setVcontraseña(texto) }
          value= {vcontraseña}
          secureTextEntry={true}
        />
        </View>
        <Text style={styles.titleBody2}>Ingrese su edad: </Text>
        <TextInput
          placeholder='Edad'
          placeholderTextColor={'black'}
          style={styles.input3}
          onChangeText={ (texto)=> setEdad(texto) }
          value= {edad}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.titleBody}>Registarse</Text>
        </TouchableOpacity>
      </BodyComponent>
    </View>
  )
}

const styles = StyleSheet.create({
    img:{
        width:150,
        height:150,
        resizeMode:'contain',
        borderRadius:100,
        marginTop:10
    },
    contimf:{
      alignItems:'center'
    },
    input:{
        backgroundColor: INPUT_COLOR,
        paddingVertical: 10,
        paddingHorizontal:10,
        borderRadius: 10,
        marginTop:15,
        width:'50%'
    },    
    input2:{
        backgroundColor: INPUT_COLOR,
        paddingVertical: 10,
        paddingHorizontal:10,
        borderRadius: 10,
        marginTop:15,
        width:'50%',
        marginRight:10
    },
    input3:{
      backgroundColor: INPUT_COLOR,
      paddingVertical: 10,
      paddingHorizontal:10,
      borderRadius: 10,
      marginTop:15,
      marginRight:10
  },
    continput:{
      flexDirection:"row",
      alignItems:'center'
    },
    titleBody: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'black'
  },
  titleBody2: {
    fontSize: 18,
    color: 'black',
    marginTop:15
  },
  descriptionBody: {
      fontSize: 15
  },
  btn:{
    marginTop:20,
    textAlign:'center',
    alignItems:'center',
    alignSelf:'center',
    backgroundColor:'#90e683',
    paddingVertical:15,
    width:'60%',
    borderRadius:20
  }
})