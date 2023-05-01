import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { requestMIDIAccess } from '@motiz88/react-native-midi';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    requestMIDIAccess().then(midiAccess => {
      // Use midiAccess.inputs and midiAccess.outputs
      console.log(midiAccess.inputs);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
