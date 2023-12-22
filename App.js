import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { Colors } from './src/utils/colors.js';

import Home from './src/screens/home.js';

function App() {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <StatusBar
        barStyle={false ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
      />

      <Home/>

    </SafeAreaView>
  );
}

export default App;