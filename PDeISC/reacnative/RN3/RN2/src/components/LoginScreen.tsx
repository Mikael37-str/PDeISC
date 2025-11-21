import React, { useState, useEffect } from "react";
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
  Modal,
  Animated,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { login, oauthLogin } from "../services/api";
import {
  useGoogleAuth,
  useFacebookAuth,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  isAppleAuthAvailable,
} from "../services/oauthService";
import axios from "axios";

const API_URL = "http://192.168.1.47:3000/api";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <View style={styles.eyeSvg}>
    {visible ? (
      <View>
        <View style={[styles.eyeOuter, { borderColor: '#00D9FF' }]} />
        <View style={[styles.eyeInner, { backgroundColor: '#00D9FF' }]} />
      </View>
    ) : (
      <View>
        <View style={[styles.eyeOuter, { borderColor: '#A0B4CC' }]} />
        <View style={[styles.eyeInner, { backgroundColor: '#A0B4CC' }]} />
        <View style={[styles.eyeSlash, { backgroundColor: '#A0B4CC' }]} />
      </View>
    )}
  </View>
);

export default function LoginScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const { promptAsync: googlePrompt } = useGoogleAuth();
  const { promptAsync: facebookPrompt } = useFacebookAuth();

  useEffect(() => {
    checkAppleAvailability();
  }, []);

  const checkAppleAvailability = async () => {
    const available = await isAppleAuthAvailable();
    setAppleAvailable(available);
  };

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ name, password });

      if (response.success && response.user) {
        navigation.replace("Home", {
          userId: response.user.id,
          userName: response.user.name,
        });
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle(googlePrompt);

      if (result.success && result.user) {
        const oauthResponse = await oauthLogin({
          provider: "google",
          providerId: result.user.id,
          email: result.user.email,
          name: result.user.name,
          profilePhoto: result.user.photo,
        });

        if (oauthResponse.success && oauthResponse.user) {
          navigation.replace("Home", {
            userId: oauthResponse.user.id,
            userName: oauthResponse.user.name,
          });
        } else {
          Alert.alert("Error", oauthResponse.message);
        }
      } else {
        Alert.alert("Error", result.error || "Error al autenticar con Google");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminName.trim() || !adminPassword.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setAdminLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        name: adminName,
        password: adminPassword,
      });

      if (response.data.success && response.data.user) {
        setShowAdminModal(false);
        navigation.replace("AdminPanel", {
          adminId: response.data.user.id,
          adminName: response.data.user.name,
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Credenciales incorrectas"
      );
    } finally {
      setAdminLoading(false);
    }
  };

  const openAdminModal = () => {
    setAdminName("");
    setAdminPassword("");
    setShowAdminModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Fondo con efecto */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.gradientCircle, styles.circle1]} />
        <View style={[styles.gradientCircle, styles.circle2]} />
        <View style={[styles.gradientCircle, styles.circle3]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Admin Access Button */}
        <TouchableOpacity
          style={styles.adminAccessButton}
          onPress={openAdminModal}
        >
          <View style={styles.adminIconSmall}>
            <Text style={styles.adminIconText}>👤</Text>
          </View>
          <Text style={styles.adminAccessText}>Admin</Text>
        </TouchableOpacity>

        {/* Logo y título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Text style={styles.logoText}>🔐</Text>
          </View>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Usuario</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#6B7F99"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu contraseña"
                placeholderTextColor="#6B7F99"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <View style={styles.buttonGlow} />
            {loading ? (
              <ActivityIndicator color="#0A0E1A" />
            ) : (
              <>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>O continúa con</Text>
            <View style={styles.divider} />
          </View>

          {/* OAuth Buttons */}
          <TouchableOpacity
            style={styles.oauthButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.oauthIconContainer}>
              <Text style={styles.oauthIcon}>🔴</Text>
            </View>
            <Text style={styles.oauthButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={loading}
            style={styles.registerLink}
          >
            <Text style={styles.linkText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.linkHighlight}>Regístrate aquí</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Admin Login Modal */}
      <Modal
        visible={showAdminModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAdminModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowAdminModal(false)}
              disabled={adminLoading}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.adminIconLarge}>
              <View style={styles.adminIconGlow} />
              <Text style={styles.adminIconLargeText}>👤</Text>
            </View>

            <Text style={styles.modalTitle}>Panel de Administración</Text>
            <Text style={styles.modalSubtitle}>⚠️ Solo personal autorizado</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Usuario</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario administrador"
                  placeholderTextColor="#6B7F99"
                  value={adminName}
                  onChangeText={setAdminName}
                  autoCapitalize="none"
                  editable={!adminLoading}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña de administrador"
                  placeholderTextColor="#6B7F99"
                  value={adminPassword}
                  onChangeText={setAdminPassword}
                  secureTextEntry={true}
                  editable={!adminLoading}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.adminButton,
                adminLoading && styles.buttonDisabled,
              ]}
              onPress={handleAdminLogin}
              disabled={adminLoading}
            >
              <View style={styles.buttonGlow} />
              {adminLoading ? (
                <ActivityIndicator color="#0A0E1A" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Acceder al Panel</Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.adminInfo}>
              <Text style={styles.adminInfoText}>
                🔑 Usuario: <Text style={styles.adminInfoHighlight}>admin</Text>
              </Text>
              <Text style={styles.adminInfoText}>
                🔐 Contraseña: <Text style={styles.adminInfoHighlight}>admin123</Text>
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    width: 300,
    height: 300,
    backgroundColor: '#00D9FF',
    top: -150,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#00FF88',
    bottom: 100,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: '#B388FF',
    top: '50%',
    left: '50%',
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  adminAccessButton: {
    position: "absolute",
    top: 50,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1E2A3A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  adminIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#243447',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminIconText: {
    fontSize: 12,
  },
  adminAccessText: {
    color: "#A0B4CC",
    fontSize: 13,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 217, 255, 0.3)',
    position: 'relative',
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: '#00D9FF',
    opacity: 0.2,
  },
  logoText: {
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
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
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
  eyeButton: {
    padding: 8,
  },
  eyeSvg: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeOuter: {
    width: 24,
    height: 14,
    borderWidth: 2,
    borderRadius: 12,
    position: "absolute",
  },
  eyeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 3,
    left: 8,
  },
  eyeSlash: {
    width: 28,
    height: 2,
    position: "absolute",
    top: 6,
    left: -2,
    transform: [{ rotate: "45deg" }],
  },
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
    opacity: 0.3,
    borderRadius: 16,
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
  buttonArrow: {
    color: "#0A0E1A",
    fontSize: 20,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6B7F99",
    fontSize: 13,
    fontWeight: '500',
  },
  oauthButton: {
    backgroundColor: "#1E2A3A",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 16,
  },
  oauthIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#243447',
    borderRadius: 12,
    marginRight: 12,
  },
  oauthIcon: {
    fontSize: 24,
  },
  oauthButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#E8EFF7",
  },
  registerLink: {
    marginTop: 8,
  },
  linkText: {
    color: "#A0B4CC",
    textAlign: "center",
    fontSize: 14,
    fontWeight: '500',
  },
  linkHighlight: {
    color: "#00D9FF",
    fontWeight: "700",
  },
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
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#243447',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseText: {
    color: "#A0B4CC",
    fontSize: 20,
    fontWeight: "600",
  },
  adminIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#243447",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(0, 217, 255, 0.3)',
  },
  adminIconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: '#00D9FF',
    opacity: 0.2,
  },
  adminIconLargeText: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E8EFF7",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#FFB800",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "600",
  },
  adminButton: {
    backgroundColor: "#00D9FF",
  },
  adminInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#243447",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#00D9FF",
  },
  adminInfoText: {
    fontSize: 13,
    color: "#A0B4CC",
    marginBottom: 4,
    fontWeight: '500',
  },
  adminInfoHighlight: {
    color: "#00FF88",
    fontWeight: "700",
  },
});