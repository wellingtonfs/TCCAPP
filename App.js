import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { Colors } from './src/utils/colors.js';

import Home from './src/screens/home.js';
import ModalLLM from './src/screens/llm.js';

function App() {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <StatusBar
        barStyle={false ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
      />

      {/* <Home/> */}

      <ModalLLM visible={true} closeModal={() => {}}/>

    </SafeAreaView>
  );
}

export default App;