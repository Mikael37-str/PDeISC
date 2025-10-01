import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TextInput,
  Switch,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const data = ["Mesa", "Silla", "Mueble", "Escritorio", "Estantería"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Componentes Nativos de React Native</Text>

      
      <View style={styles.card}>
        <Text style={styles.title}>View</Text>
        <Text style={styles.desc}>
          Es un contenedor básico que agrupa otros elementos, como un div.
        </Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>Text</Text>
        <Text style={styles.desc}>Muestra texto en la pantalla.</Text>
        <Text style={styles.highlight}>Hola Mundo</Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>Button</Text>
        <Text style={styles.desc}>Botón simple con un evento onPress.</Text>
        <Button
          title="Presiona"
          color="#2e7d32"
          onPress={() => Alert.alert("Presionado")}
        />
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>TextInput</Text>
        <Text style={styles.desc}>Campo donde se puede escribir.</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe aquí..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
        />
        <Text style={styles.desc}>Escribiste: {text}</Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>Switch</Text>
        <Text style={styles.desc}>Funciona como interruptor (on/off).</Text>
        <Switch
          value={isEnabled}
          onValueChange={setIsEnabled}
          thumbColor={isEnabled ? "#66bb6a" : "#ccc"}
          trackColor={{ false: "#555", true: "#2e7d32" }}
        />
        <Text style={styles.desc}>
          Estado: {isEnabled ? "Activado" : "Desactivado"}
        </Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>ActivityIndicator</Text>
        <Text style={styles.desc}>Indicador de carga.</Text>
        <ActivityIndicator size="large" color="#66bb6a" />
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>Image</Text>
        <Text style={styles.desc}>Podes mostrar imágenes locales o remotas.</Text>
        <Image
          style={styles.image}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>TouchableOpacity</Text>
        <Text style={styles.desc}>Botón con efecto de opacidad al presionar.</Text>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => Alert.alert("Tocaste y se oscureció el botón al hacerlo")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Toca</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>FlatList</Text>
        <Text style={styles.desc}>
          Lista para grandes cantidades de datos.
        </Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Text style={styles.listItem}>{item}</Text>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", 
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#a5d6a7", 
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#66bb6a", 
  },
  desc: {
    color: "#ccc",
    marginBottom: 6,
  },
  highlight: {
    color: "#81c784",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#388e3c",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    color: "white",
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 8,
  },
  touchable: {
    marginTop: 8,
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  listItem: {
    fontSize: 16,
    paddingVertical: 4,
    color: "#a5d6a7",
  },
});
