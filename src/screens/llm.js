import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, Alert, KeyboardAvoidingView, View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';

let progress = "standard";

const URL_SERVER = "http://179.189.133.252:3005"

function Item({ data, mine }) {
    return (
        <View style={styles.container}>
            <View style={mine ? styles.viewTextR : styles.viewTextL}>
                <Text style={styles.textMsg}>{data.message}</Text>
            </View>
        </View>
    )
}

const ModalLLM = ({ visible, closeModal }) => {
    const refScroll = useRef(null);

    const [update, setUpdate] = useState(false);
    const [msgList, setMsgList] = useState([]);
    const [msgText, setMsgText] = useState('');

    const updateScreen = () => setUpdate(!update);

    useEffect(() => {
        const onKeyBoardOpen = Keyboard.addListener('keyboardDidShow', () => {
            if ( refScroll.current ) refScroll.current.scrollToEnd({ animated: false })
        })

        return () => {
            onKeyBoardOpen.remove();
        }
    }, [])

    // callback

    const sendMessage = async () => {
        if (msgText == '') {
            Alert.alert('Erro', 'Preencha a mensagem para continuar');
            return;
        }

        setMsgText('');
        setMsgList([...msgList, {message: msgText, senderId: myInfo.id}]);

        if ( refScroll.current ) {  
            refScroll.current.scrollToEnd({ animated: false });
        }
    };

    return (
        <Modal
            visible={visible}
            style={styles.modal}
            onRequestClose={closeModal}
        >
            <KeyboardAvoidingView
                behavior="padding"
                enabled={Platform.OS == 'ios'}
                style={styles.modalContent}
            >

                <ScrollView
                    ref={refScroll}
                    style={{flex: 1}}
                    onContentSizeChange={() => {
                        if ( refScroll.current ) refScroll.current.scrollToEnd({ animated: false })
                    }}
                >

                    {
                        msgList !== null ?
                            React.Children.toArray(
                                msgList.map(item => <Item data={item} mine={myInfo.id == item.senderId}/>)
                            )
                        : <></>
                    }

                </ScrollView>

                <View style={styles.viewInput}>
                    <TextInput
                        placeholder="Digite sua mensagem"
                        placeholderTextColor={"#999"}
                        style={styles.input}
                        onChangeText={setMsgText}
                        value={msgText}
                    />
                    <TouchableOpacity style={styles.btnSend} onPress={sendMessage}>
                        <Text style={styles.btnText}>  <Icon name='send-outline' size={18} color={'#ffc200'} /></Text>
                    </TouchableOpacity>
                </View>
                
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    modalContent: {
        flex: 1,
    },
    viewInput: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        maxHeight: 70,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#fff",
        paddingHorizontal: 15
    },
    input: {
        width: '83%',
        height: 50,
        borderWidth: 0,
        borderRadius: 5,
        padding: 15,
        backgroundColor: '#fff'
    },
    btnSend: {
        width: '15%',
        height: 50,
        backgroundColor: "#000",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    btnText: {
        color: '#000'
    },
    container: {
        flex:1,
        width: '100%',

    },
    viewTextL: {
        backgroundColor: '#eee',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 5,
        borderRadius: 5,
        maxWidth: '85%',
        minWidth: '85%',
        alignSelf: 'flex-start'
    },
    viewTextR: {
        backgroundColor: "#fff000",
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 5,
        borderRadius: 5,
        maxWidth: '85%',
        minWidth: '85%',
        alignSelf: 'flex-end'
    },
    textMsg: {
        color: '#444',
        fontSize: 15
    }
});

export default ModalLLM;
