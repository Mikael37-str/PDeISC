import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { register } from "../services/api";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [newUserName, setNewUserName] = useState("");

  const validateForm = (): boolean => {
    setErrorMessage("");

    if (!name.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Por favor completa todos los campos");
      return false;
    }

    if (/^\d+$/.test(name)) {
      setErrorMessage(
        "El nombre de usuario no puede contener solo números. Ejemplo: 'juan123' es válido, pero '1234' no lo es."
      );
      return false;
    }

    if (password.length < 4) {
      setErrorMessage(
        "La contraseña debe tener al menos 4 caracteres. Actualmente tiene " +
          password.length +
          " caracteres."
      );
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Las contraseñas no coinciden. Por favor verifica que ambas contraseñas sean iguales."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await register({ name, password });

      if (response.success && response.user) {
        setNewUserId(response.user.id);
        setNewUserName(response.user.name);
        setShowSuccessModal(true);
      } else {
        if (response.message.includes("ya existe")) {
          setErrorMessage(
            "Este nombre de usuario ya está registrado. Por favor elige otro nombre."
          );
        } else {
          setErrorMessage(response.message);
        }
      }
    } catch (error: any) {
      setErrorMessage(
        "Error de conexión: " +
          (error.message || "No se pudo conectar con el servidor")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToOnboarding = () => {
    if (newUserId && newUserName) {
      setShowSuccessModal(false);
      navigation.replace("Onboarding", {
        userId: newUserId,
        userName: newUserName,
      });
    }
  };

  const handleSkipOnboarding = () => {
    if (newUserId && newUserName) {
      setShowSuccessModal(false);
      navigation.replace("Home", {
        userId: newUserId,
        userName: newUserName,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña (mínimo 4 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para registro exitoso */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>¡Registro Exitoso!</Text>
            <Text style={styles.modalMessage}>
              Bienvenido {newUserName}! Tu cuenta ha sido creada correctamente.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGoToOnboarding}
            >
              <Text style={styles.modalButtonText}>Completar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={handleSkipOnboarding}
            >
              <Text style={styles.modalSecondaryButtonText}>
                Saltar por ahora
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// RegisterScreen.tsx - Estilos actualizados con tema oscuro

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E1A",
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  circle1: {
    width: 250,
    height: 250,
    backgroundColor: '#00FF88',
    top: -100,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#00D9FF',
    bottom: 150,
    left: -60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    position: 'relative',
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: '#00FF88',
    opacity: 0.2,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E8EFF7",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#A0B4CC",
    fontWeight: '500',
  },
  
  // Error container
  errorContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  errorText: {
    color: "#FF5252",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    fontWeight: '600',
  },
  
  // Input wrapper
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A0B4CC",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: "#E8EFF7",
    fontWeight: '500',
  },
  
  // Strength indicator
  strengthContainer: {
    marginTop: 8,
    marginLeft: 4,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#243447',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Button
  button: {
    backgroundColor: "#00FF88",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00FF88',
    opacity: 0.2,
  },
  buttonDisabled: {
    backgroundColor: "#243447",
    opacity: 0.5,
  },
  buttonText: {
    color: "#0A0E1A",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 18,
  },
  
  // Link
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: "#A0B4CC",
    fontSize: 14,
    fontWeight: '500',
  },
  linkHighlight: {
    color: "#00D9FF",
    fontWeight: "700",
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 26, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#1E2A3A",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    maxWidth: 400,
    width: "90%",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#00FF88',
    position: 'relative',
  },
  successIconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: '#00FF88',
    opacity: 0.3,
  },
  successIcon: {
    fontSize: 50,
    color: "#00FF88",
    fontWeight: "700",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E8EFF7",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: "#A0B4CC",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
    fontWeight: '500',
  },
  modalButton: {
    backgroundColor: "#00D9FF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 200,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: "#0A0E1A",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8,
  },
  modalButtonIcon: {
    fontSize: 18,
  },
  modalSecondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 200,
    borderWidth: 2,
    borderColor: "#00D9FF",
    backgroundColor: 'transparent',
  },
  modalSecondaryButtonText: {
    color: "#00D9FF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  
  // Info hint
  infoHint: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#00D9FF',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoHintIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  infoHintText: {
    fontSize: 12,
    color: "#A0B4CC",
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
});