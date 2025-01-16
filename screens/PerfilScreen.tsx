import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    Alert, 
    Modal, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ImageBackground 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { update, ref as dbRef } from 'firebase/database';
import { db } from '../config/Config';
import { MaterialIcons } from '@expo/vector-icons'; 
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export default function PerfilScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); 
    const [apellido, setApellido] = useState('');
    const [edad, setEdad] = useState('');
    const [nombre, setNombre] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("");

    const DROPBOX_ACCESS_TOKEN = "sl.u.AFehxyp0WbeytoWspqZvfuAieagLgWChB6qAtWXiSlQkAZEj5rmUtuXJiFzzWw5q_fhgf1t2Q4VrxjqHo6EBCMIzSJ2QJvjCHXIPe58Tb4h6B9wWPTKBjR2Az0vTx68y5pDB4BZUJyepilds_mmVkyRA9RZj8zyePZ8_5ygtWe_8ZHGaKvqSK9UV-8vDWS8XbagJL2H3fI_cFsTduGkyvHC-N1OA10FcRWz7YmFZBD-tE6gE55PqPnAuiQhveWnl8XZv_XY7x7He80Y_tUOlvb8bufi202qb1ksk56RLB1Jof3RhdLxzGOkWrSq0ZZawpj_9xO800fdA3-nBrziolHx399-hGzu7K33OB6jAkamL0BD8h8p63kiJ2m2ft99VtZmd17YZxn4DW5UUJMCqTk23jTxsJYI2X-MqHGUXUw1umnhMGAYmi88CPugQjnnYyLM_EPXcuj_HLfgpoHsxeT4kWC_6mulcDsslDhgD2edHy594gre5c_HakFrXtqzn9BQT7SqEWc4mOQcKkYHmXQuBRGrWyr1A_wuG-lv4ZI0SzOVt6RColLeEJTw2T_OfCxs1IKd7-GvyKQrZLnBnqE9BtlINGbpen1MBIMv0hDBoNdIZaLNAJMCKSFBc9jsnno_cRkLWL4OsenTiJGx_27kja4Wj9daeYwJVmV6H8_zYwLuYqpA3oJLJhsg6XqM6t7MrUn3wGObHJpqZubxDUwD6KIRFgD1xcKVqKPrK3jlCRxNtGljWa85J2hJuudoWGHfGZGTdoh6WTX2eJgk30d1HuVxtWfD_XmPc2UqLWKrjw1ZYumKzHsKch8TDIK8wVmdwaoB68Qs8kuulBYMoFtb0ThRIqqN8XL_nNKWq5-EXwKHq-0DnfIX6Ew90Q_k-4keu7geVVCXu8oDaZcvin6ICfPSbwtYHG3YvYJJmXY7GthEdrnDyE1jOavrGk71tYWK0Q9nDpjeDcSRokR33R2nZg3Zc19yzcrXXO6n3cIHjVRHXUB1cOq948TCuvtfoe_Qb2Xw_6osisds36h-Gj_LvalbNbULmO5HuUzjU7C5CrARneXDSwe9tL6mMHZ8DZeZ4xh1qOKQjQ6MTrPk08gFnHHKzADGwQLToFko-7BzvMSdC7LrqHTNgUwAiI9nSdCgyKorttblutIGA-7CeWGQkZj4H588IIRu6eer6aaCJoQT7y6Wxx6zmbuTdoNniMDWnyVZfkKUasl9rEWIv0a5nWE7tyL0cwfL7CcpP1S09DNKj1_z1btglvGwZ2qPIHILp_lURgv7YzWdNaXSlLw9OolDOwaeWdi2ZyGBQG9IsHlfjxnYqUGNBv1Sx4GgMwxRSRTZ1D5PX7smZyGWjrXemG5_rEgmkB1MciblxpjU4Z9NWifQ-qxCb7YLF3XcHHhXXLFE-sWnVT-zmq0DzwSPZEVmaXU35Xs-7SdeJRbeG4Q"; // Reemplaza con tu token de Dropbox

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (user.displayName) {
                    setNombre(user.displayName);
                }
            } else {
                setUser(null);
            }
        });
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('¡Necesitas permisos para acceder a las imágenes!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const pickImageFromCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const subirImagen = async () => {
      if (!image) {
        Alert.alert('Error', 'Primero selecciona una imagen');
        return;
      }
  
      const ACCESS_TOKEN = DROPBOX_ACCESS_TOKEN; 
  
      try {

        const fileData = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
  

        const fileBuffer = Buffer.from(fileData, 'base64'); // Utiliza Buffer importado
  
        // Generar un nombre único basado en la fecha y hora actual
        const now = new Date();
        const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, ''); // YYYY-MM-DD_HH-MM-SS
        const fileName = `Imagen_${timestamp}.jpg`; // Puedes cambiar la extensión según el tipo de archivo
  
        const dropboxArg = {
          path: `/${fileName}`, 
          mode: 'add',
          autorename: true,
          mute: false,
        };
  
        // Subir el archivo binario a Dropbox
        const result = await axios.post(
          'https://content.dropboxapi.com/2/files/upload',
          fileBuffer,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              'Dropbox-API-Arg': JSON.stringify(dropboxArg),
              'Content-Type': 'application/octet-stream', 
            },
          }
        );
  
        console.log('Dropbox response:', result.data);
  
        // Después de la subida, obtener la URL de la imagen
        const filePath = result.data.path_display; 
  
        // Solicitar el enlace de descarga del archivo
        const sharedLinkResult = await axios.post(
          'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
          {
            path: filePath, // Ruta del archivo
            settings: {
              requested_visibility: 'public', // Hacer el enlace público
            },
          },
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
  
        // Obtener la URL del enlace compartido
        const downloadUrl = sharedLinkResult.data.url.replace('?dl=0', '?raw=1');  // Hacer que la URL sea de descarga directa
  
        console.log('URL de descarga directa:', downloadUrl);
        setImageUrl(downloadUrl); // Guardar la URL de la imagen subida
  
        Alert.alert('Éxito', 'Imagen subida correctamente a Dropbox');
      } catch (error) {
        //console.error('Error al subir la imagen:', error.response?.data || error.message);
        Alert.alert('Error', 'Hubo un problema al subir la imagen');
      }
    };

    const editarPerfil = () => {
        if (user) {
            update(dbRef(db, 'users/' + user.uid), {
                apellido: apellido,
                nombre: nombre,
                edad: edad,
            }).then(() => {
                Alert.alert('Datos editados', 'Los datos del usuario han sido editados con éxito');
                setEditModalVisible(false);
            }).catch((error) => {
                console.error('Error al actualizar los datos:', error);
                Alert.alert('Error', 'Hubo un problema al editar los datos');
            });
        }
    };

    return (
        <ImageBackground
            source={require('../assets/fonts/b1f49e424ca2ac63c7ecb00cbe844e4e.jpg')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                {user ? (
                    <>
                        <Text style={styles.text}>Bienvenido, {nombre || user.email}</Text>

                        {image && (
                            <Image
                                source={{ uri: image }}
                                style={styles.profileImage}
                            />
                        )}

                        <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.profileIcon}>
                            <MaterialIcons name="edit" size={50} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileIcon}>
                            <MaterialIcons name="account-circle" size={50} color="black" />
                        </TouchableOpacity>

                        <Modal
                            visible={modalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Seleccionar Foto</Text>

                                    <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                                        <Text style={styles.modalButtonText}>Seleccionar Foto desde la Galería</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.modalButton} onPress={pickImageFromCamera}>
                                        <Text style={styles.modalButtonText}>Tomar Foto con la Cámara</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.modalButton} onPress={subirImagen}>
                                        <Text style={styles.modalButtonText}>Subir Imagen</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.cancelButtonText}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <Modal
                            visible={editModalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setEditModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Editar Perfil</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nombre"
                                        value={nombre}
                                        onChangeText={setNombre}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Apellido"
                                        value={apellido}
                                        onChangeText={setApellido}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Edad"
                                        value={edad}
                                        onChangeText={setEdad}
                                    />

                                    <TouchableOpacity style={styles.saveButton} onPress={editarPerfil}>
                                        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : (
                    <Text style={styles.text}>Cargando...</Text>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#ffffff',
        marginBottom: 20
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    profileIcon: {
        marginBottom: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});