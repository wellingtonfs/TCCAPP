import React, { useState, Component } from "react";
import { FlatList, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { Colors, Fonts } from "../utils/colors.js";

// load nas imagens estáticas de aparencia

let imageList = [];
// imageList.push(require("../../assets/signers/0.jpg"))
// imageList.push(require("../../assets/signers/1.jpg"))
imageList.push(require("../../assets/signers/2.jpg"))
imageList.push(require("../../assets/signers/3.jpg"))
imageList.push(require("../../assets/signers/4.jpg"))
imageList.push(require("../../assets/signers/5.jpg"))
imageList.push(require("../../assets/signers/6.jpg"))
imageList.push(require("../../assets/signers/7.jpg"))
imageList.push(require("../../assets/signers/8.jpg"))

function ImageItem({ source, index, curImg, setCurImg }) {
    let imgstyle = curImg == index ? styles.selectImg : styles.img;

    return (
        <TouchableOpacity
            style={styles.viewItem}
            onPress={() => setCurImg(index)}
        >
            <Image source={source} style={imgstyle}/>
        </TouchableOpacity>
    )
}

class ImageList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curImg: 0
        };
    }

    getImage() {
        return imageList[this.state.curImg];
    }

    render() {
        return (
            <FlatList
                data={imageList} // Certifique-se de que a variável 'imageList' esteja definida.
                keyExtractor={(item, index) => index.toString()} // A chave precisa ser uma string.
                renderItem={({ item, index }) => (
                    <ImageItem source={item} index={index} curImg={this.state.curImg} setCurImg={this.setCurImg} />
                )}
                horizontal={true}
                style={styles.container}
                contentContainerStyle={styles.content}
            />
        );
    }

    setCurImg = (curImg) => {
        this.setState({ curImg });
    };
}

export default ImageList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },

    content: {
        alignItems: 'center',
    },

    viewItem: {
        width: 150,
        height: '90%',
        marginHorizontal: 10
    },

    img: {
        width: '100%',
        height: '100%',
        resizeMode: "contain",
        borderRadius: 10,
    },

    selectImg: {
        width: '100%',
        height: '100%',
        resizeMode: "contain",
        borderRadius: 10,
        borderWidth: 5,
        borderColor: Colors.color4
    }
})