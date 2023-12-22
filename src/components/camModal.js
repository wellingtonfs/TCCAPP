import React, { useState, useRef, useEffect } from 'react';
import { Alert, ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Modal, Image, Linking } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import synlibras from "../model/synlibras.js";
import RNFetchBlob from 'rn-fetch-blob';

let progress = "standard";

const URL_SERVER = "http://179.189.133.252:3005"

const serverImageUrls = [
    `${URL_SERVER}/api/filesystem/get/openpose/0.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/3.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/6.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/9.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/12.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/15.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/18.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/21.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/24.png`,
    `${URL_SERVER}/api/filesystem/get/openpose/27.png`,
];

const downloadAndCacheImages = () => {

    return new Promise(async (res, rej) => {
        const downloadedImages = [];

        for (const url of serverImageUrls) {
            try {

                const response = await RNFetchBlob.config({
                    fileCache: true,
                    appendExt: "png"
                }).fetch('GET', url);

                if (response.respInfo.status === 200) {
                    const imagePath = response.path();

                    downloadedImages.push(`file://${imagePath}`);
                }

            } catch (error) {
                console.error('Erro ao baixar imagem:', error);
                rej(error);
            }
        }

        res(downloadedImages);
    })
};

function ResultComponent({ imageUri, progress }) {
    if (progress == "generating") {
        return (
            <View style={styles.gallerySpin}>
                <ActivityIndicator size={'large'}/>
            </View>
        )
    }

    if (imageUri == null) {
        return (
            <View style={styles.gallery}>
                <Text style={styles.infoText}>O resultado aparecerá aqui</Text>
            </View>
        )
    }

    return (
        <View style={styles.galleryImg}>
            <Image
                source={{ uri: imageUri }}
                style={{ flex: 1, resizeMode: 'contain' }}
            />
        </View>
    )
}

const ModalCam = ({ visible, closeModal, currentImage }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [update, setUpdate] = useState(false);

    const updateScreen = () => setUpdate(!update);

    const devices = useCameraDevices();

    const cameraRef = useRef(null);

    useEffect(() => {
        Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, []);

    if (cameraPermission == null) {
        return null;
    }

    if (cameraPermission !== 'authorized') {
        Camera.requestCameraPermission().then(async (permission) => {
            if (permission === 'denied') await Linking.openSettings();

            setCameraPermission(permission);
        })
    }

    const takePicture = () => {
        if (progress == "generating") return;

        if (progress == "image") {
            progress = "generating";

            setCapturedImage(null);
        }

        if (cameraRef.current) {

            progress = "generating";
            updateScreen();

            cameraRef.current.takePhoto().then(async (data) => {

                // enviar a foto pro back calcular as poses

                const formData = new FormData();

                formData.append('file', {
                    name: 'image.jpg',
                    type: 'image/jpeg',
                    uri: `file://${data.path}`,
                });

                // fazer a requisição de upload

                try {
                    const response = await fetch(`${URL_SERVER}/api/replicai/openpose`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const responseData = await response.json();

                    console.log('Resposta do servidor:', responseData);

                    if (!responseData.ok) {

                        Alert.alert('Erro ao fazer upload', "Servidor respondeu: " + JSON.stringify(responseData));

                        progress = "standard";
                        updateScreen();

                        return;
                    }

                } catch (error) {

                    Alert.alert('Erro ao fazer upload', error);

                    progress = "standard";
                    updateScreen();

                    return;

                }

                // baixar as poses geradas

                let poses;

                try {

                    poses = await downloadAndCacheImages();

                } catch (error) {

                    Alert.alert('Erro ao fazer download', error);

                    progress = "standard";
                    updateScreen();

                    return;

                }

                // passar pelo modelo

                let image = await synlibras.generate(currentImage, poses);
    
                if (image != null) {
                    progress = "image";

                    setCapturedImage("file://" + image);
                } else {
                    progress = "standard";

                    Alert.alert("", "Houve algum problema ao gerar a imagem")
                }

                

            }).catch(() => {

                progress = "standard";

            })

            updateScreen();

        }
    };

    return (
        <Modal
            visible={visible}
            style={styles.modal}
            onRequestClose={closeModal}
        >
            <View style={styles.modalContent}>

                <Camera
                    ref={cameraRef}
                    style={styles.camera}
                    device={devices.back}
                    isActive={true}
                    photo={true}
                />

                <ResultComponent imageUri={capturedImage} progress={progress}/>

                {
                    progress == "generating" ? <></>

                    :

                    <View style={styles.captureButtonContainer}>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <Text style={styles.captureText}>
                                { progress == "image" ? "Capturar novamente" : "Capturar" }
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        margin: 0,
    },
    modalContent: {
        flex: 1,
    },
    camera: {
        flex: 4,
    },
    captureButtonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    captureButton: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#777',
        padding: 10,
    },
    captureText: {
        color: '#777',
        fontSize: 20,
    },
    infoText: {
        color: '#000'
    },
    gallery: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    gallerySpin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    galleryImg: {
        flex: 4,
    },
});

export default ModalCam;
