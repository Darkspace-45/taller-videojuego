import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db, dbs, storage } from '../config/Config';
import { MaterialIcons } from '@expo/vector-icons';  // Icon for profile
import { update, ref as dbRef } from 'firebase/database'; // Usamos update para actualizar los datos

export default function PerfilScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // Modal para editar perfil
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [edad, setEdad] = useState('');
    const [nombre, setNombre] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const pickImagec = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
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
        }
    };

    const handleSavePhoto = async () => {
        if (selectedImage && user) {
            try {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `profile_images/${user.uid}`);
                const uploadTask = uploadBytesResumable(storageRef, blob);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {},
                    (error) => {
                        console.error('Error al subir la imagen:', error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const userDocRef = doc(dbs, 'users', user.uid);
                        await setDoc(userDocRef, {
                            photoURL: downloadURL,
                        }, { merge: true });

                        Alert.alert('Foto de ranking guardada correctamente');
                    }
                );
            } catch (error) {
                console.error('Error al guardar la foto:', error);
                Alert.alert('Hubo un error al guardar la foto');
            }
        }
    };

    // Función para editar el perfil con update()
    function Editar() {
        if (user) {
            update(dbRef(db, 'users/' + nombre), {
                apellido: apellido,
                correo: correo,
                edad: edad,
            }).then(() => {
                Alert.alert(
                    'Datos editados',
                    'Los datos del usuario han sido editados con éxito',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                );
                setEditModalVisible(false); // Cerrar el modal después de editar
            }).catch((error) => {
                console.error('Error al actualizar los datos:', error);
                Alert.alert('Error', 'Hubo un problema al editar los datos');
            });
        }
    }

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Text style={styles.text}>Bienvenido, {user.displayName || user.email}</Text>

                    {/* Icono de perfil */}
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileIcon}>
                        <MaterialIcons name="account-circle" size={100} color="black" />
                    </TouchableOpacity>

                    {/* Botón "Editar Perfil" */}
                    <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editButton}>
                        <Text style={styles.text}>Editar Perfil</Text>
                    </TouchableOpacity>

                    {/* Modal para elegir imagen o cámara */}
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Seleccionar Foto</Text>
                                <Button title="Seleccionar Foto desde la Galería" onPress={pickImage} />
                                <Button title="Tomar Foto con la Cámara" onPress={pickImagec} />
                                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </Modal>

                    {/* Modal de edición de perfil */}
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
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChangeText={(text) => setNombre(text)}
                                    style={styles.input}
                                />

                                <TextInput
                                    placeholder="Apellido"
                                    value={apellido}
                                    onChangeText={setApellido}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Correo"
                                    value={correo}
                                    onChangeText={setCorreo}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Edad"
                                    value={edad}
                                    onChangeText={setEdad}
                                    style={styles.input}
                                    keyboardType="numeric" // Para edades, podemos ponerlo como numérico
                                />

                                <Button title="Guardar Cambios" onPress={Editar} />
                                <Button title="Cancelar" onPress={() => setEditModalVisible(false)} />
                            </View>
                        </View>
                    </Modal>

                    {/* Mostrar la imagen seleccionada */}
                    {selectedImage && (
                        <View style={styles.selectedImageContainer}>
                            <Text style={styles.text}>Foto seleccionada:</Text>
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.selectedImage}
                            />
                            <Button title="Guardar Foto de Ranking" onPress={handleSavePhoto} />
                        </View>
                    )}
                </>
            ) : (
                <Text style={styles.text}>Cargando usuario...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    profileIcon: {
        marginTop: 20,
    },
    editButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
    },
    selectedImageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    selectedImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    text: {
        color: 'snow',
        fontSize: 16,
    },
});
