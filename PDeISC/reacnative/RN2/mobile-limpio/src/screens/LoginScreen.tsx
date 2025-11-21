import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { login } from "../services/api";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ name, password });

      if (response.success && response.user) {
        navigation.replace("Home", { userName: response.user.name });
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.outerContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              ¿No tienes cuenta? Regístrate aquí
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3d59", // Fondo oscuro azul
  },
  outerContainer: { // Nuevo contenedor para centrar
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '85%', // Limita el ancho del formulario
    maxWidth: 400, // Límite máximo para pantallas grandes
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#fff", // Texto claro
  },
  input: {
    backgroundColor: "#2e5266", // Fondo del input más oscuro
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#e6e6e6", // Texto dentro del input claro
    borderWidth: 1,
    borderColor: "#4a6c80", // Borde suave
    height: 45, // Altura compacta
  },
  button: {
    backgroundColor: "#2ecc71", // Verde brillante
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#000", // Color del texto del botón negro para contraste
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#3498db", // Azul para el enlace
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});