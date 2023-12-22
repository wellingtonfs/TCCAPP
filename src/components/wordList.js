import React, { useState, Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

import { Colors, Fonts } from "../utils/colors.js"
import Poses from "../utils/poses.js";

// let listWords = [
//     "Abacate", "abacaxi", "absorvente", "abóbora", "acerola", "acetona", "achocolatado", "agua", "agulha-de-crochê", "alface", "algodão", "alho",
//     "almofada", "aluno", "amora", "anel", "anão", "aparecer", "aparelho-de-barbear", "ausente", "bagunça", "baixo", "bala", "balão", "bambolê", "banana", "bandeira",
//     "baruho", "base", "batata", "baú", "beleza", "berimbau", "berinjela", "bico", "binoculo", "biscoito-água-e-sal", "boi", "bolo", "bombom", "brocolis", "cabrito", "cachorra",
//     "cachorro", "cadeado", "café", "caixa", "caju", "calculadora", "camelo", "canguru", "canudo", "capa-de-chuva", "capacete", "caqui", "caranguejo", "carimbo", "carne", "casa",
//     "cavalo", "caçador", "cebola", "cebolinha", "centopeia", "centímetro", "cereja", "certo", "cerveja", "chato", "chocolate", "churrasco", "cobra", "coco", "coelho", "cogumelo",
//     "confirmar", "corda-de-pular", "coruja", "couve", "coxinha", "curto", "damasco", "dentro", "desaparecer", "desligado", "despertador", "dezena", "diamante", "dicionario",
//     "diminuir", "dinamite", "dinossauro", "doce", "duro", "elefante", "empada", "errado", "Ervilha", "espada", "espaço", "espaçoso", "espinafre", "estreito", "excluir", "faixa",
//     "farofa", "feijao", "feio", "figo", "filmadora", "fino", "fora", "força", "sorvete", "sossego", "tartaruga", "telha", "tigre", "toalha", "tomate", "tombo",
//     "torneira", "torrada", "touca", "tudo", "unidade", "ursinho", "urso", "uva", "vaca", "vagem", "veado", "vinho", "vitamina_bebida", "vulcão", "zebra", "zumbi"
// ]

let listWords = Object.keys(Poses)

function WordItem({ item, index, curWord, setCurWord }) {
    const btnstyle = curWord == index ? styles.activateButton : styles.button;
    const txtstyle = curWord == index ? styles.activateTxtButton : styles.txtButton;

    return (
        <TouchableOpacity
            style={btnstyle}
            onPress={() => setCurWord(index)}
        >
            <Text style={txtstyle}>{item}</Text>
        </TouchableOpacity>
    )
}

class WordList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curWord: 0
        };
    }

    getWord() {
        return listWords[this.state.curWord];
    }

    render() {
        return (
            <FlatList
                data={listWords}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <WordItem item={item} index={index} curWord={this.state.curWord} setCurWord={this.setCurWord} />
                )}
                style={styles.container}
            />
        );
    }

    setCurWord = (curWord) => {
        this.setState({ curWord });
    };
}

export default WordList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    viewContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.color1,
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    button: {
        padding: 5,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
        backgroundColor: Colors.color1
    },
    txtButton: {
        fontSize: Fonts.small,
        color: Colors.color4
    },

    activateButton: {
        padding: 5,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: Colors.color4,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2
    },
    activateTxtButton: {
        fontSize: Fonts.small,
        color: Colors.color1
    }

})