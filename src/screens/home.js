import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, ToastAndroid } from "react-native";

import { Colors, Fonts } from "../utils/colors.js";

// telas

import ImageList from "../components/imageList.js";
import WordList from "../components/wordList.js";
import GeneratedButton from "../components/generateButton.js";

import synlibras from "../model/synlibras.js";
import ModalCam from "../components/camModal.js";
import { GetPosesByWord } from "../utils/utils.js";

let running = false;
let currentImage = null;

export default function Home() {
    const imglist = useRef();
    const wordlist = useRef();

    const [image, setImage] = useState(null);
    const [started, setStarted] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    async function generate() {
        if (running || started) {
            running = false;
            return;
        }

        setStarted(true);
        running = true;

        let word = wordlist.current.getWord();

        let img = imglist.current.getImage();
        let poses = GetPosesByWord(word);

        if (poses == null) {
            return ToastAndroid.show("Poses não encontradas", ToastAndroid.SHORT);
        }

        for (let pose of poses) {
            let im = await synlibras.generate(img, pose);
    
            if (im != null) {
                setImage("file://" + im);
            }

            if (!running) break;
        }

        setStarted(false);
        running = false;
    }

    function onPressCloseModal() { setModalVisible(false) }
    function onPressCam() {
        currentImage = imglist.current.getImage();

        setModalVisible(true)
    }
    function onPressText() { alert("Em construção!") }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>SynLibras</Text>

            <View style={styles.viewImg}>
                {
                    image == null ?
                        <Image style={styles.img} source={require("../../assets/default.png")}/>
                    :
                        <Image style={styles.img} source={{ uri: image }}/>
                }
            </View>

            <View style={styles.viewControllers}>

                <View style={styles.viewListImgs}>
                    <ImageList ref={imglist}/>
                </View>

                <View style={styles.viewListWords}>
                    <WordList ref={wordlist}/>
                </View>

                <View style={styles.viewButtons}>
                    <GeneratedButton started={started} onPressCam={onPressCam} generate={generate} onPressText={onPressText}/>
                </View>

            </View>

            <ModalCam visible={isModalVisible} closeModal={onPressCloseModal} currentImage={currentImage}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: Colors.background
    },
    title: {
        fontSize: Fonts.large,
        alignSelf: 'center',
        color: Colors.color4,
        marginTop: 10
    },

    viewImg: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',

        padding: 10
    },

    viewControllers: {
        flex: 1,
    },

    img: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',

        borderRadius: 10
    },

    viewListImgs: {
        flex: 2,
        margin: 10,
        borderColor: Colors.color1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 10
    },

    viewListWords: {
        flex: 2,
        margin: 5,
        borderRadius: 10
    },

    viewButtons: {
        flex: 1
    }
})

// const formData = new FormData();
// formData.append('file', {
//     uri: "file://" + image,
//     type: 'image/png',
//     name: 'image.png',
// });

// const response = await fetch("http://179.189.133.252:3005/api/filesystem/push/appimg", {
//     method: 'POST',
//     body: formData,
//     headers: {
//         'Content-Type': 'multipart/form-data',
//     },
// });

// if (response.ok) {
//     // O upload foi bem-sucedido.
//     console.log('Upload de imagem bem-sucedido!');
// } else {
//     // Algo deu errado no upload.
//     console.error('Erro no upload de imagem.');
// }