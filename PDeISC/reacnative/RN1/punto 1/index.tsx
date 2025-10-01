import { Image } from 'expo-image';
import { Platform, View, Text, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Hola Mundo</Text>
    </View> 
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,               // ocupa toda la pantalla
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff', // fondo blanco
  },
  title: {
    fontSize: 34,
    color: 'green',
  },
});
