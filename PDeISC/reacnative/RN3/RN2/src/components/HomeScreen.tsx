import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { getProfile } from "../services/api";

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
  const { userId, userName } = route.params;
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [authProvider, setAuthProvider] = useState<string>("local");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await getProfile(userId);
      if (response.success && response.user) {
        setProfilePhoto(response.user.profilePhoto || null);
        setUserEmail(response.user.email || "");
        setAuthProvider(response.user.authProvider || "local");
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleEditProfile = () => {
    navigation.navigate("Profile", { userId });
  };

  const getProviderIcon = () => {
    switch (authProvider) {
      case "google":
        return "🔴";
      case "facebook":
        return "f";
      case "apple":
        return "";
      default:
        return "🔐";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#00D9FF" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fondo con patrón */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.gradientCircle, styles.circle1]} />
        <View style={[styles.gradientCircle, styles.circle2]} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con foto de perfil */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>Hola 👋</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={styles.profilePhotoContainer}
            >
              {profilePhoto ? (
                <Image
                  source={{
                    uri: profilePhoto.startsWith("http")
                      ? profilePhoto
                      : `http://192.168.100.86:3000${profilePhoto}`,
                  }}
                  style={styles.profilePhoto}
                />
              ) : (
                <View style={styles.profilePhotoPlaceholder}>
                  <Text style={styles.profilePhotoText}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>✏️</Text>
              </View>
              <View style={styles.photoGlow} />
            </TouchableOpacity>
          </View>

          {/* Info del usuario */}
          <View style={styles.userInfoCard}>
            <View style={styles.userInfoRow}>
              <View style={styles.userInfoIcon}>
                <Text style={styles.userInfoIconText}>📧</Text>
              </View>
              <View style={styles.userInfoContent}>
                <Text style={styles.userInfoLabel}>Email</Text>
                <Text style={styles.userInfoValue}>
                  {userEmail || "No especificado"}
                </Text>
              </View>
            </View>

            <View style={styles.userInfoDivider} />

            <View style={styles.userInfoRow}>
              <View style={styles.userInfoIcon}>
                <Text style={styles.userInfoIconText}>{getProviderIcon()}</Text>
              </View>
              <View style={styles.userInfoContent}>
                <Text style={styles.userInfoLabel}>Método de acceso</Text>
                <Text style={styles.userInfoValue}>
                  {authProvider === "local"
                    ? "Cuenta local"
                    : `Conectado con ${authProvider}`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tarjeta principal de acción */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.mainActionCard}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <View style={styles.mainActionGlow} />
            <View style={styles.mainActionIcon}>
              <Text style={styles.mainActionIconText}>👤</Text>
            </View>
            <View style={styles.mainActionContent}>
              <Text style={styles.mainActionTitle}>Editar Perfil</Text>
              <Text style={styles.mainActionDescription}>
                Actualiza tu información personal, foto y documentos
              </Text>
            </View>
            <View style={styles.mainActionArrow}>
              <Text style={styles.mainActionArrowText}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Grid de opciones */}
          <View style={styles.optionsGrid}>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionCardGlow, { backgroundColor: 'rgba(0, 217, 255, 0.1)' }]} />
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(0, 217, 255, 0.2)' }]}>
                <Text style={styles.optionIconText}>🔔</Text>
              </View>
              <Text style={styles.optionTitle}>Notificaciones</Text>
              <Text style={styles.optionSubtitle}>3 nuevas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionCardGlow, { backgroundColor: 'rgba(0, 255, 136, 0.1)' }]} />
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(0, 255, 136, 0.2)' }]}>
                <Text style={styles.optionIconText}>⚙️</Text>
              </View>
              <Text style={styles.optionTitle}>Configuración</Text>
              <Text style={styles.optionSubtitle}>Ajustes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionCardGlow, { backgroundColor: 'rgba(179, 136, 255, 0.1)' }]} />
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(179, 136, 255, 0.2)' }]}>
                <Text style={styles.optionIconText}>❓</Text>
              </View>
              <Text style={styles.optionTitle}>Ayuda</Text>
              <Text style={styles.optionSubtitle}>Soporte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionCardGlow, { backgroundColor: 'rgba(255, 184, 0, 0.1)' }]} />
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 184, 0, 0.2)' }]}>
                <Text style={styles.optionIconText}>ℹ️</Text>
              </View>
              <Text style={styles.optionTitle}>Acerca de</Text>
              <Text style={styles.optionSubtitle}>Info</Text>
            </TouchableOpacity>
          </View>

          {/* Tarjeta informativa */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={styles.infoCardIcon}>
                <Text style={styles.infoCardIconText}>🎉</Text>
              </View>
              <Text style={styles.infoCardTitle}>¡Todo listo!</Text>
            </View>
            <Text style={styles.infoCardText}>
              Has iniciado sesión exitosamente. Ahora puedes:
            </Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkIconText}>✓</Text>
                </View>
                <Text style={styles.infoItemText}>Editar tu perfil y subir una foto</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkIconText}>✓</Text>
                </View>
                <Text style={styles.infoItemText}>Agregar tu número de teléfono</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkIconText}>✓</Text>
                </View>
                <Text style={styles.infoItemText}>Establecer tu ubicación</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkIconText}>✓</Text>
                </View>
                <Text style={styles.infoItemText}>Subir documentos de identidad</Text>
              </View>
            </View>
          </View>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
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
    opacity: 0.08,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: '#00D9FF',
    top: -100,
    right: -150,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: '#00FF88',
    bottom: 200,
    left: -100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0E1A",
  },
  loaderWrapper: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#A0B4CC",
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 15,
    color: "#A0B4CC",
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E8EFF7",
    letterSpacing: -0.5,
  },
  profilePhotoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(0, 217, 255, 0.4)',
  },
  profilePhotoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#243447",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: 'rgba(0, 217, 255, 0.4)',
  },
  profilePhotoText: {
    fontSize: 24,
    color: "#00D9FF",
    fontWeight: "700",
  },
  editBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#00FF88",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0A0E1A",
  },
  editBadgeText: {
    fontSize: 10,
  },
  photoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    backgroundColor: '#00D9FF',
    opacity: 0.2,
  },
  userInfoCard: {
    backgroundColor: '#1E2A3A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#243447',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfoIconText: {
    fontSize: 22,
  },
  userInfoContent: {
    flex: 1,
  },
  userInfoLabel: {
    fontSize: 12,
    color: '#6B7F99',
    marginBottom: 4,
    fontWeight: '600',
  },
  userInfoValue: {
    fontSize: 15,
    color: '#E8EFF7',
    fontWeight: '600',
  },
  userInfoDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 16,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  mainActionCard: {
    backgroundColor: '#1E2A3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  mainActionGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
  },
  mainActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mainActionIconText: {
    fontSize: 28,
  },
  mainActionContent: {
    flex: 1,
  },
  mainActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8EFF7',
    marginBottom: 4,
  },
  mainActionDescription: {
    fontSize: 13,
    color: '#A0B4CC',
    lineHeight: 18,
  },
  mainActionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00FF88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainActionArrowText: {
    fontSize: 18,
    color: '#0A0E1A',
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#1E2A3A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  optionCardGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E8EFF7',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#6B7F99',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#1E2A3A',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#00D9FF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCardIconText: {
    fontSize: 20,
  },
  infoCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8EFF7',
  },
  infoCardText: {
    fontSize: 14,
    color: '#A0B4CC',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIconText: {
    fontSize: 12,
    color: '#00FF88',
    fontWeight: '700',
  },
  infoItemText: {
    fontSize: 14,
    color: '#E8EFF7',
    flex: 1,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E2A3A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#FF5252",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 40,
  },
});