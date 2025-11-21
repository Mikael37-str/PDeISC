import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

export default function HomeScreen({ navigation, route }: Props) {
  const { userName } = route.params;

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.subtitle}>Has iniciado sesión exitosamente</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3d59", // Fondo oscuro azul
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff", // Texto claro
    marginBottom: 10,
  },
  userName: {
    fontSize: 48,
    fontWeight: "600",
    color: "#2ecc71", // Verde brillante para el nombre de usuario
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    color: "#a9c4db", // Texto secundario claro
    textAlign: "center",
    marginBottom: 50,
  },
  logoutButton: {
    backgroundColor: "#3498db", // Azul para el botón de cerrar sesión
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});