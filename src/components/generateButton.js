import React, { useState } from "react";
import { ActivityIndicator, View, StyleSheet, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5.js";

import { Colors, Fonts } from "../utils/colors.js"

export default function GeneratedButton({ started, onPressCam, generate, onPressText }) {
    async function onPressPlay() {
        generate();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.viewContainer} onPress={onPressCam}>
                <Icon name = {"camera"} size={22} color={Colors.color4}/>
            </TouchableOpacity>

            <View style={styles.viewContainer}>
                <TouchableOpacity
                    style={styles.generatedButton}
                    onPress={onPressPlay}
                >
                    {
                        started ?

                            <ActivityIndicator size={"large"}/>

                        :

                        <Icon name = {"play"} size={26} color={Colors.background}/>
                    }
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.viewContainer} onPress={onPressText}>
                <Icon name = {"comment-alt"} size={22} color={Colors.color4}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
    },
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    generatedButton: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: Colors.color4,
        alignItems: 'center',
        justifyContent: 'center'
    }
})