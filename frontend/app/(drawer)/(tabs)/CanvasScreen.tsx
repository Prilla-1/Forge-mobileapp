import React from 'react';
import { View, StyleSheet } from 'react-native';
import Canvas from '../../components/Canvas';
import Toolbar from '../../components/Toolbar';
import SaveButton from '../../components/SafeButton'

export default function CanvasScreen() {
  return (
    <View style={styles.container}>
      <Canvas />
      <Toolbar />
      <SaveButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
