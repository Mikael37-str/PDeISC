import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import axios from "axios";

const API_URL = "http://192.168.100.86:3000/api";

type AdminPanelNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AdminPanel"
>;

type AdminPanelRouteProp = RouteProp<RootStackParamList, "AdminPanel">;

interface Props {
  navigation: AdminPanelNavigationProp;
  route: AdminPanelRouteProp;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  auth_provider: string;
  created_at: string;
  last_login: string;
}

export default function AdminPanelScreen({ navigation, route }: Props) {
  const { adminId, adminName } = route.params;

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayUsers: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  useEffect(() => {
    console.log("showDeleteModal cambió a:", showDeleteModal);
  }, [showDeleteModal]);

  useEffect(() => {
    console.log("showRoleModal cambió a:", showRoleModal);
  }, [showRoleModal]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("🔄 Cargando usuarios...");
      const response = await axios.get(`${API_URL}/admin/users`, {
        params: { adminId },
      });

      console.log("✅ Usuarios cargados:", response.data);

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        Alert.alert("Error", "No se pudieron cargar los usuarios");
      }
    } catch (error: any) {
      console.error("❌ Error cargando usuarios:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudieron cargar los usuarios"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        params: { adminId },
      });

      if (response.data.success) {
        setStats({
          totalUsers: response.data.stats.totalUsers,
          todayUsers: response.data.stats.todayUsers,
        });
      }
    } catch (error) {
      console.error("❌ Error cargando estadísticas:", error);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
    loadStats();
  };

  const handleChangeRole = (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    console.log("🔄 Intentando cambiar rol:", {
      userId: user.id,
      userName: user.name,
      currentRole: user.role,
      newRole: newRole,
    });

    console.log("Setting selectedUser:", user);
    console.log("Setting selectedNewRole:", newRole);
    console.log("Setting showRoleModal to TRUE");

    setSelectedUser(user);
    setSelectedNewRole(newRole);
    setShowRoleModal(true);

    console.log("Estados actualizados");
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    setShowRoleModal(false);

    try {
      console.log("📤 Enviando petición de cambio de rol...");

      const response = await axios.put(
        `${API_URL}/admin/users/${selectedUser.id}/role`,
        {
          adminId,
          newRole: selectedNewRole,
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      if (response.data.success) {
        Alert.alert("✅ Éxito", "Rol actualizado correctamente");
        loadUsers();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "No se pudo cambiar el rol"
        );
      }
    } catch (error: any) {
      console.error("❌ Error cambiando rol:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo cambiar el rol. Verifica la conexión."
      );
    }
  };

  const handleDeleteUser = (user: User) => {
    console.log("🗑️ Intentando eliminar usuario:", {
      userId: user.id,
      userName: user.name,
    });

    console.log("Setting selectedUser:", user);
    console.log("Setting showDeleteModal to TRUE");

    setSelectedUser(user);
    setShowDeleteModal(true);

    console.log("Estados actualizados para eliminación");
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    setShowDeleteModal(false);

    try {
      console.log("📤 Enviando petición de eliminación...");

      const response = await axios.delete(
        `${API_URL}/admin/users/${selectedUser.id}`,
        {
          data: { adminId },
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      if (response.data.success) {
        Alert.alert(
          "✅ Usuario Eliminado",
          `${selectedUser.name} ha sido eliminado correctamente`
        );
        loadUsers();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "No se pudo eliminar el usuario"
        );
      }
    } catch (error: any) {
      console.error("❌ Error eliminando usuario:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo eliminar el usuario. Verifica la conexión."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir del panel de administración?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const renderUserItem = ({ item }: { item: User }) => {
    // Verificar si se pueden mostrar los botones
    const canModify = item.role !== "admin" && item.id !== adminId;

    return (
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            {item.email ? (
              <Text style={styles.userEmail}>{item.email}</Text>
            ) : null}
            {item.phone ? (
              <Text style={styles.userPhone}>{item.phone}</Text>
            ) : null}
          </View>
          <View
            style={[
              styles.roleBadge,
              item.role === "admin" ? styles.adminBadge : styles.userBadge,
            ]}
          >
            <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.userMeta}>
          <Text style={styles.metaText}>
            Proveedor: {item.auth_provider || "local"}
          </Text>
          <Text style={styles.metaText}>
            Registro: {new Date(item.created_at).toLocaleDateString("es-ES")}
          </Text>
          {item.last_login ? (
            <Text style={styles.metaText}>
              Ultimo acceso:{" "}
              {new Date(item.last_login).toLocaleDateString("es-ES")}
            </Text>
          ) : null}
        </View>

        {canModify ? (
          <View style={styles.userActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.roleButton]}
              onPress={() => {
                console.log("Boton cambiar rol presionado");
                handleChangeRole(item);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>
                Cambiar a {item.role === "user" ? "Admin" : "User"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => {
                console.log("Boton eliminar presionado");
                handleDeleteUser(item);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.protectedInfo}>
            <Text style={styles.protectedInfoText}>
              {item.id === adminId
                ? "Tu cuenta (no modificable)"
                : "Administrador (protegido)"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel de Administración</Text>
          <Text style={styles.headerSubtitle}>Bienvenido, {adminName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Usuarios</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.todayUsers}</Text>
          <Text style={styles.statLabel}>Hoy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{filteredUsers.length}</Text>
          <Text style={styles.statLabel}>Filtrados</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Users List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron usuarios</Text>
            </View>
          }
        />
      )}

      {/* Modal de Confirmación para Cambiar Rol */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>🔄</Text>
              <Text style={styles.modalTitle}>Cambiar Rol</Text>
            </View>

            <Text style={styles.modalMessage}>
              ¿Cambiar rol de{" "}
              <Text style={styles.boldText}>{selectedUser?.name}</Text> de{" "}
              <Text style={styles.boldText}>{selectedUser?.role}</Text> a{" "}
              <Text style={styles.boldText}>{selectedNewRole}</Text>?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRoleModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRoleChange}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación para Eliminar Usuario */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>⚠️</Text>
              <Text style={styles.modalTitle}>Eliminar Usuario</Text>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro de eliminar a{" "}
              <Text style={styles.boldText}>{selectedUser?.name}</Text>?
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>Esta acción es PERMANENTE</Text>
              <Text style={styles.warningSubtext}>Se eliminarán:</Text>
              <Text style={styles.warningItem}>• Información personal</Text>
              <Text style={styles.warningItem}>• Documentos</Text>
              <Text style={styles.warningItem}>• Historial completo</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteUserButton]}
                onPress={confirmDeleteUser}
              >
                <Text style={styles.deleteButtonText}>ELIMINAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// AdminPanelScreen.tsx - Estilos actualizados con tema oscuro

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E1A",
  },
  
  // Header con gradiente
  header: {
    backgroundColor: "#1E2A3A",
    padding: 24,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 217, 255, 0.2)',
  },
  headerLeft: {
    flex: 1,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E8EFF7",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#A0B4CC",
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  logoutButtonText: {
    color: "#FF5252",
    fontWeight: "700",
    fontSize: 13,
  },
  
// En la sección de estilos de AdminPanelScreen, agrega:

warningText: {
  fontSize: 14,
  color: "#FFB800",
  fontWeight: '600',
},

warningSubtext: {
  fontSize: 13,
  color: "#A0B4CC",
  marginBottom: 8,
  marginTop: 8,
  fontWeight: '500',
},

warningItem: {
  fontSize: 12,
  color: "#A0B4CC",
  marginLeft: 8,
  marginBottom: 4,
  fontWeight: '500',
},

  // Stats cards
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E2A3A",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7F99",
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Search
  searchContainer: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#6B7F99',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#E8EFF7',
    fontWeight: '500',
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#6B7F99",
  },
  
  // List
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  
  // User Card
  userCard: {
    backgroundColor: "#1E2A3A",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#243447',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 217, 255, 0.3)',
  },
  userAvatarText: {
    fontSize: 20,
    color: '#00D9FF',
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#E8EFF7",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#A0B4CC",
    marginBottom: 2,
    fontWeight: '500',
  },
  userPhone: {
    fontSize: 13,
    color: "#A0B4CC",
    fontWeight: '500',
  },
  
  // Role badge
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  adminBadge: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    borderColor: 'rgba(255, 82, 82, 0.4)',
  },
  userBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderColor: 'rgba(0, 255, 136, 0.4)',
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminRoleText: {
    color: "#FF5252",
  },
  userRoleText: {
    color: "#00FF88",
  },
  
  // User meta
  userMeta: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  metaText: {
    fontSize: 12,
    color: "#6B7F99",
    fontWeight: '500',
  },
  
  // User actions
  userActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
  },
  roleButton: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    borderColor: 'rgba(0, 217, 255, 0.4)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    borderColor: 'rgba(255, 82, 82, 0.4)',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  roleButtonText: {
    color: "#00D9FF",
  },
  deleteButtonText: {
    color: "#FF5252",
  },
  
  // Protected info
  protectedInfo: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FFB800",
    flexDirection: 'row',
    alignItems: 'center',
  },
  protectedInfoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  protectedInfoText: {
    fontSize: 12,
    color: "#FFB800",
    fontWeight: "600",
    flex: 1,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#A0B4CC",
    fontWeight: '500',
  },
  
  // Empty state
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7F99",
    textAlign: "center",
    fontWeight: '500',
  },
  
  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 26, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#1E2A3A",
    borderRadius: 24,
    padding: 28,
    width: "90%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Modal header
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    position: 'relative',
  },
  modalIconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    opacity: 0.3,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E8EFF7",
    textAlign: 'center',
  },
  
  // Modal message
  modalMessage: {
    fontSize: 15,
    color: "#A0B4CC",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: "700",
    color: "#E8EFF7",
  },
  
  // Warning box
  warningBox: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF5252",
    marginBottom: 8,
  },

  // Modal buttons
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: "#243447",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelButtonText: {
    color: "#A0B4CC",
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#00D9FF",
  },
  confirmButtonText: {
    color: "#0A0E1A",
    fontSize: 15,
    fontWeight: "700",
  },
  deleteUserButton: {
    backgroundColor: "#FF5252",
  },
  deleteButtonTextModal: {
    color: "#0A0E1A",
    fontSize: 15,
    fontWeight: "700",
  },
  
  // Filter chips (opcional, para futuro)
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#243447',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    borderColor: 'rgba(0, 217, 255, 0.4)',
  },
  filterChipText: {
    fontSize: 12,
    color: '#A0B4CC',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#00D9FF',
  },
});