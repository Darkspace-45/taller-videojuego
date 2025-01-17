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

    const DROPBOX_ACCESS_TOKEN = "sl.u.AFdDsQKqm4GJOwCsMAZ5-FBhqPMifTcHs4YFmU7b4ZuaPBDQgEBCi2raZKp0ZD0ULrrV_CY0sjS986kwrXmmt_vRDGI1iLVMB7YiTaAiMYs0Bwt6gnsDiniJavVrCPcOJM7YyKT5r6GFI4U1mTF8-g8DonCnZkS8xnptzXg9WcCYl8L6clVQ69tZPP8_tRJkD6cFdY89pu3i3yjNPydPcxLztGa3RF547phVFkVT1nEMoCk4e1pHi_WrUqSnjowg5sK8YzWFRw6qEXBk0fcPbShYeg0pfXgYrzJUV_yeNuVSySA3ftoue3gzZhCrXCh5J93_mCx5I3OzUpdNqRrlsxqitxVnyZ-0ngu9OVkBq6ehBpvQ00pCdI45UQKLCl4lxk3GI23KjGePtpFvQBrP48yjeoEWGBqfSOe6cZmIHgrG4PFa4jnXM6gIoPDVK8P8H90EmYM-65VlDhx98RWuNIVeH4tEHgPSBEXehHha1HNsbd0Ej1zTl3xjiKdqhCvL1gcO5WBZXoVZ4V5bQK0RZungWrQxs49u81KB9o8SYi7xxxiPWq4YDB7PZdpfFonfvcdVopfBhXTnpMXdvXCuF1aLpqJqaaVav6dvM8nP7gS4tkfwroZU7InnVesVloKti6OzwK9OW4y3omrOWMbMrIv0g2qn5JUQTGyDiji0rq4A5wPyubYByt11BG7PIjWPDw84RNfKAiUSIdzd7KNUGa3NaY131iVA6m-qyx2du1ioarqVrSfYBv1x8vfIUTTkDktVr7FS-10JI3vBEqvWynxKKAKcOpBNdqxTF_iv_6PsNUmxSk4qlSZXz7q-8hJuD3HGTjjdephpW8JL-8G0BmyETHpHyw5cXwOtC1uZLbmHvlAEg7xxO3naB-8ifohTN-LLaktF_atxn28YtsUh31h0evh3mEyn1GAqqVO4I0kctweUXJwPbgGfQSkh_6KZa_yXLXh7EZ92Uchj97_HA6z62lJK2xv9XBlzqlUNIcN80W_W40Hv20ic0lyqPV2ieu68bgyhXDqQVD5GOQEmwVie1QWjaRm9rACD756wX8V8f01Za8Q9GmyK9bO6cJYOASst3QB6Kqs1RGftEb1J92whnrmHLpBJtCpDnc1Pg02jBBrEEZIrjIXL-Nrl-CzChNVF4qd7puILKTeme8drjGNIkufVpLUz7F_yGEab4Cvq5IXUwd7XYYeLR-MxQ48vQy0LJdMmhOhJROgGBLp6G1wuvMmsqFgt4QWPYhHJMsluwSuPdMFnYViP2D_UDt1WT3H7vRpbFgtP1h9cX86zhVtsnDV-w5vNGwCNiWrfdA2_k47ClYGlatGW3G0khKeZh0UTwHB1jyX0nwp00nwpLxrRHqupsf6W62Ruvg8jjo9qUmPrh5df00QKaOsX2VV-b3a4eoPSfSWefJXkwRSn1GlJ67vJqHdBGLt8PvEryS8WEw"; // Reemplaza con tu token de Dropbox

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
        color: '#ffffff',
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
