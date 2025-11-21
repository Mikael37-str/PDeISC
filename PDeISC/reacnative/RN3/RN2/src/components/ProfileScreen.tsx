import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadDocument,
  getDocuments,
} from "../services/api";
import LocationPicker from "../components/LocationPicker";
import {
  getCountries,
  getProvincesByCountry,
  getCitiesByProvince,
} from "../services/locationService";
import { Platform } from "react-native";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

interface Props {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

interface InitialData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  profilePhoto: string | null;
  country: string;
  province: string;
  city: string;
}

interface Document {
  id: number;
  document_type: string;
  document_path: string;
  uploaded_at: string;
}

const API_BASE_URL = "http://192.168.100.126:3000"; // Cambia por tu IP

export default function ProfileScreen({ navigation, route }: Props) {
  const { userId } = route.params;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [initialData, setInitialData] = useState<InitialData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Estados para ubicación
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  // Estados para escaneo de documentos
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [capturedDocumentUri, setCapturedDocumentUri] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Modal para foto de perfil
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // ⭐ NUEVO: Modal para ver foto de perfil
  const [showViewPhotoModal, setShowViewPhotoModal] = useState(false);

  // ⭐ NUEVO: Modal para ver documento
  const [showViewDocumentModal, setShowViewDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Datos de ubicación
  const countries = getCountries();
  const provinces = country ? getProvincesByCountry(country) : [];
  const cities = country && province ? getCitiesByProvince(country, province) : [];

  // Tipos de documentos disponibles
  const documentTypes = [
    { id: "dni_frente", name: "DNI - Frente" },
    { id: "dni_dorso", name: "DNI - Dorso" },
    { id: "pasaporte", name: "Pasaporte" },
    { id: "licencia_conducir", name: "Licencia de Conducir" },
    { id: "cedula", name: "Cédula de Identidad" },
    { id: "otro", name: "Otro Documento" },
  ];

  useEffect(() => {
    loadProfile();
    loadDocuments();
    requestPermissions();
  }, []);

  useEffect(() => {
    if (initialData) {
      const changed =
        name !== initialData.name ||
        email !== initialData.email ||
        phone !== initialData.phone ||
        country !== initialData.country ||
        province !== initialData.province ||
        city !== initialData.city ||
        address !== initialData.address ||
        bio !== initialData.bio ||
        profilePhoto !== initialData.profilePhoto;

      setHasChanges(changed);
    }
  }, [name, email, phone, country, province, city, address, bio, profilePhoto, initialData]);

  useEffect(() => {
    if (country && initialData && country !== initialData.country) {
      setProvince("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    if (province && initialData && province !== initialData.province) {
      setCity("");
    }
  }, [province]);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos permisos de cámara y galería para esta función"
      );
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      console.log("📥 Cargando perfil del usuario:", userId);
      const response = await getProfile(userId);

      if (response.success && response.user) {
        const user = response.user;
        console.log("✅ Perfil cargado:", user);
        console.log("📸 Foto de perfil:", user.profilePhoto || "Sin foto");

        const initialState = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          bio: user.bio || "",
          profilePhoto: user.profilePhoto || null,
          country: user.country || "",
          province: user.province || "",
          city: user.city || "",
        };

        setInitialData(initialState);
        setName(initialState.name);
        setEmail(initialState.email);
        setPhone(initialState.phone);
        setAddress(initialState.address);
        setBio(initialState.bio);
        setProfilePhoto(initialState.profilePhoto);
        setCountry(initialState.country);
        setProvince(initialState.province);
        setCity(initialState.city);
      }
    } catch (error: any) {
      console.error("❌ Error cargando perfil:", error);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      console.log("📥 Cargando documentos del usuario:", userId);
      const response = await getDocuments(userId);
      if (response.success) {
        console.log("✅ Documentos cargados:", response.documents?.length || 0);
        setDocuments(response.documents || []);
      }
    } catch (error) {
      console.error("❌ Error cargando documentos:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!hasChanges) {
      Alert.alert("Sin cambios", "No hay cambios para guardar");
      return;
    }

    setSaving(true);
    try {
      console.log("💾 Guardando perfil...");
      const response = await updateProfile(userId, {
        name,
        email,
        phone,
        address,
        bio,
        country,
        province,
        city,
      });

      if (response.success) {
        setInitialData({
          name,
          email,
          phone,
          address,
          bio,
          profilePhoto,
          country,
          province,
          city,
        });
        setHasChanges(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);

        console.log("✅ Perfil guardado correctamente");
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      console.error("❌ Error guardando perfil:", error);
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = () => {
    setShowPhotoOptions(true);
  };

  // ⭐ NUEVO: Ver foto de perfil actual
  const handleViewProfilePhoto = () => {
    setShowPhotoOptions(false);
    if (profilePhoto) {
      setShowViewPhotoModal(true);
    } else {
      Alert.alert("Sin foto", "No tienes una foto de perfil aún");
    }
  };

  const takeProfilePhoto = async () => {
    setShowPhotoOptions(false);
    
    if (Platform.OS === 'web') {
      Alert.alert(
        'Modo Web',
        'En el navegador web, por favor selecciona una imagen de tu computadora.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Seleccionar Imagen', 
            onPress: () => pickProfilePhotoFromGallery() 
          }
        ]
      );
      return;
    }
    
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Necesitamos acceso a la cámara para tomar fotos'
        );
        return;
      }

      console.log("📷 Abriendo cámara...");
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("📷 Resultado de cámara:", result);

      if (!result.canceled && result.assets[0]) {
        console.log("✅ Foto capturada:", result.assets[0].uri);
        await uploadPhoto(result.assets[0].uri);
      } else {
        console.log("⚠️ Captura cancelada");
      }
    } catch (error: any) {
      console.error("❌ Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto: " + error.message);
    }
  };

  const pickProfilePhotoFromGallery = async () => {
    setShowPhotoOptions(false);
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Necesitamos acceso a tu galería para seleccionar fotos'
        );
        return;
      }

      console.log("🖼️ Abriendo galería...");
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("🖼️ Resultado de galería:", result);

      if (!result.canceled && result.assets[0]) {
        console.log("✅ Imagen seleccionada:", result.assets[0].uri);
        await uploadPhoto(result.assets[0].uri);
      } else {
        console.log("⚠️ Selección cancelada");
      }
    } catch (error: any) {
      console.error("❌ Error seleccionando foto:", error);
      Alert.alert("Error", "No se pudo seleccionar la foto: " + error.message);
    }
  };

  const uploadPhoto = async (uri: string) => {
    setSaving(true);
    console.log("\n=== INICIO SUBIDA FOTO DE PERFIL ===");
    console.log("📍 URI recibida:", uri);
    console.log("👤 UserID:", userId);
    console.log("🖥️ Platform:", Platform.OS);
    
    try {
      if (!uri || uri.trim() === '') {
        throw new Error("URI de imagen vacía");
      }

      console.log("📤 Llamando a uploadProfilePhoto...");
      const response = await uploadProfilePhoto(userId, uri);
      console.log("📥 Respuesta recibida:", JSON.stringify(response, null, 2));

      if (response.success && response.profilePhoto) {
        console.log("✅ Foto subida exitosamente");
        console.log("📸 Path recibido:", response.profilePhoto);
        
        setProfilePhoto(response.profilePhoto);
        
        if (initialData) {
          setInitialData({
            ...initialData,
            profilePhoto: response.profilePhoto
          });
        }
        
        console.log("✅ Estado local actualizado");
        console.log("🔄 Recargando perfil completo...");
        await loadProfile();
        
        Alert.alert("✅ Éxito", "Foto de perfil actualizada correctamente");
      } else {
        console.error("❌ Error en respuesta:", response.message);
        Alert.alert("❌ Error", response.message || "No se pudo subir la foto");
      }
    } catch (error: any) {
      console.error("❌ Excepción en uploadPhoto:", error);
      console.error("❌ Stack:", error.stack);
      Alert.alert("❌ Error", error.message || "Error al subir la foto");
    } finally {
      setSaving(false);
      console.log("=== FIN SUBIDA FOTO DE PERFIL ===\n");
    }
  };

  const handleScanDocument = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Modo Web',
        'En el navegador web, por favor selecciona una imagen de tu computadora.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Seleccionar Imagen', 
            onPress: () => pickDocumentFromGallery() 
          }
        ]
      );
      return;
    }

    try {
      console.log("📸 Iniciando captura de documento...");
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Necesitamos acceso a la cámara para escanear documentos'
        );
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("✅ Foto capturada:", result.assets[0].uri);
        setCapturedDocumentUri(result.assets[0].uri);
        setShowDocumentPreview(true);
      } else {
        console.log("⚠️ Captura cancelada");
      }
    } catch (error: any) {
      console.error("❌ Error al capturar documento:", error);
      Alert.alert("Error", "No se pudo capturar el documento: " + error.message);
    }
  };

  const pickDocumentFromGallery = async () => {
    try {
      console.log("🖼️ Abriendo selector de documentos...");
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("✅ Documento seleccionado:", result.assets[0].uri);
        setCapturedDocumentUri(result.assets[0].uri);
        setShowDocumentPreview(true);
      }
    } catch (error: any) {
      console.error("❌ Error seleccionando documento:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento");
    }
  };

  const handleSelectDocumentType = () => {
    if (!capturedDocumentUri) {
      Alert.alert("Error", "No hay documento capturado");
      return;
    }
    
    setShowDocumentPreview(false);
    setShowDocumentTypeModal(true);
  };

  const handleConfirmDocumentType = async (documentType: string) => {
    setShowDocumentTypeModal(false);
    setSelectedDocumentType(documentType);

    if (capturedDocumentUri) {
      await uploadDocumentToServer(capturedDocumentUri, documentType);
    } else {
      Alert.alert("Error", "No hay documento para subir");
    }
  };

  const uploadDocumentToServer = async (uri: string, documentType: string) => {
    setUploadingDocument(true);
    console.log("\n=== INICIO SUBIDA DOCUMENTO ===");
    console.log("📍 URI:", uri);
    console.log("📋 Tipo:", documentType);
    console.log("👤 UserID:", userId);
    console.log("🖥️ Platform:", Platform.OS);

    try {
      if (!uri || uri.trim() === '') {
        throw new Error("URI de documento vacía");
      }

      if (!documentType || documentType.trim() === '') {
        throw new Error("Tipo de documento no especificado");
      }

      console.log("📤 Llamando a uploadDocument...");
      const response = await uploadDocument(userId, uri, documentType);
      console.log("📥 Respuesta del servidor:", JSON.stringify(response, null, 2));

      if (response.success) {
        console.log("✅ Documento subido exitosamente");
        
        Alert.alert(
          "✅ Éxito", 
          "Documento subido correctamente",
          [
            {
              text: "OK",
              onPress: async () => {
                setCapturedDocumentUri(null);
                setSelectedDocumentType("");
                
                console.log("🔄 Recargando documentos...");
                await loadDocuments();
              }
            }
          ]
        );
      } else {
        console.error("❌ Error en respuesta:", response.message);
        Alert.alert("❌ Error", response.message || "No se pudo subir el documento");
      }
    } catch (error: any) {
      console.error("❌ Excepción al subir documento:", error);
      console.error("❌ Stack:", error.stack);
      Alert.alert("❌ Error", error.message || "Error al subir el documento");
    } finally {
      setUploadingDocument(false);
      console.log("=== FIN SUBIDA DOCUMENTO ===\n");
    }
  };

  const handleCancelDocumentCapture = () => {
    setCapturedDocumentUri(null);
    setShowDocumentPreview(false);
    setSelectedDocumentType("");
  };

  // ⭐ NUEVO: Ver documento completo
  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowViewDocumentModal(true);
  };

  const handleGetLocation = async () => {
    setSaving(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso Denegado",
          "Necesitas habilitar los permisos de ubicación"
        );
        setSaving(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      const coordsAddress = `Lat: ${latitude.toFixed(
        6
      )}, Lng: ${longitude.toFixed(6)}`;

      Alert.alert(
        "Ubicación Detectada",
        `${coordsAddress}\n\n¿Deseas guardar esta ubicación?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => setSaving(false),
          },
          {
            text: "Guardar",
            onPress: async () => {
              try {
                const response = await updateProfile(userId, {
                  address: address || coordsAddress,
                  latitude,
                  longitude,
                });

                if (response.success) {
                  if (initialData) {
                    setInitialData({
                      ...initialData,
                      address: address || coordsAddress,
                    });
                  }
                  Alert.alert("Éxito", "Ubicación guardada correctamente");
                } else {
                  Alert.alert("Error", "No se pudo guardar la ubicación");
                }
              } catch (error) {
                Alert.alert("Error", "No se pudo guardar la ubicación");
              } finally {
                setSaving(false);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Foto de perfil */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={handlePickImage} disabled={saving}>
              {profilePhoto ? (
                <Image
                  source={{
                    uri: profilePhoto.startsWith("http")
                      ? profilePhoto
                      : `${API_BASE_URL}${profilePhoto}`,
                  }}
                  style={styles.profilePhoto}
                  key={profilePhoto}
                />
              ) : (
                <View style={styles.profilePhotoPlaceholder}>
                  <Text style={styles.profilePhotoText}>📷</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.photoHint}>Toca para cambiar foto</Text>
          </View>

          {/* Información básica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              editable={!saving}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!saving}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+54 9 11 1234-5678"
              keyboardType="phone-pad"
              editable={!saving}
            />

            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos sobre ti..."
              multiline
              numberOfLines={4}
              editable={!saving}
            />
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>

            <LocationPicker
              label="País"
              value={country}
              items={countries.map(c => ({ id: c.id, name: c.name }))}
              onValueChange={setCountry}
              placeholder="Selecciona un país"
              enabled={!saving}
            />

            <LocationPicker
              label="Provincia/Estado"
              value={province}
              items={provinces.map(p => ({ id: p.id, name: p.name }))}
              onValueChange={setProvince}
              placeholder="Selecciona una provincia"
              enabled={!saving && !!country}
            />

            <LocationPicker
              label="Ciudad"
              value={city}
              items={cities.map(c => ({ id: c.id, name: c.name }))}
              onValueChange={setCity}
              placeholder="Selecciona una ciudad"
              enabled={!saving && !!province}
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Tu dirección"
              multiline
              editable={!saving}
            />

            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleGetLocation}
              disabled={saving}
            >
              <Text style={styles.locationButtonText}>
                📍 Usar mi ubicación actual
              </Text>
            </TouchableOpacity>
          </View>

          {/* Documentos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentos de Identidad</Text>

            <Text style={styles.helpText}>
              Escanea tu documento de identificación usando la cámara
            </Text>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanDocument}
              disabled={saving || uploadingDocument}
            >
              {uploadingDocument ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.scanButtonIcon}>📸</Text>
                  <Text style={styles.scanButtonText}>Escanear Documento</Text>
                </>
              )}
            </TouchableOpacity>

            {documents.length > 0 && (
              <View style={styles.documentsListContainer}>
                <Text style={styles.documentsListTitle}>
                  Documentos escaneados ({documents.length})
                </Text>
                {documents.map((doc) => (
                  <TouchableOpacity
                    key={doc.id}
                    style={styles.documentItem}
                    onPress={() => handleViewDocument(doc)}
                  >
                    <View style={styles.documentItemLeft}>
                      <View style={styles.documentIconContainer}>
                        <Text style={styles.documentIcon}>📄</Text>
                      </View>
                      <View>
                        <Text style={styles.documentType}>{doc.document_type}</Text>
                        <Text style={styles.documentDate}>
                          {new Date(doc.uploaded_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </View>
                    </View>
                    {doc.document_path && (
                      <Image
                        source={{
                          uri: doc.document_path.startsWith("http")
                            ? doc.document_path
                            : `${API_BASE_URL}${doc.document_path}`,
                        }}
                        style={styles.documentThumbnail}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Estado de cambios */}
          {!hasChanges && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                No hay cambios para guardar
              </Text>
            </View>
          )}

          {/* Botón guardar */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanges || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveProfile}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Modal de opciones para FOTO DE PERFIL */}
      <Modal
        visible={showPhotoOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>Seleccionar foto de perfil</Text>

            {/* ⭐ NUEVO: Botón para ver foto actual */}
            {profilePhoto && (
              <TouchableOpacity
                style={[styles.optionButton, styles.viewPhotoButton]}
                onPress={handleViewProfilePhoto}
              >
                <Text style={styles.optionIcon}>👁️</Text>
                <Text style={styles.optionText}>Ver foto actual</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.optionButton}
              onPress={takeProfilePhoto}
            >
              <Text style={styles.optionIcon}>📷</Text>
              <Text style={styles.optionText}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={pickProfilePhotoFromGallery}
            >
              <Text style={styles.optionIcon}>🖼️</Text>
              <Text style={styles.optionText}>Elegir de galería</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ⭐ NUEVO: Modal para VER FOTO DE PERFIL COMPLETA */}
      <Modal
        visible={showViewPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowViewPhotoModal(false)}
      >
        <View style={styles.fullScreenImageContainer}>
          <View style={styles.fullScreenImageHeader}>
            <Text style={styles.fullScreenImageTitle}>Foto de Perfil</Text>
            <TouchableOpacity onPress={() => setShowViewPhotoModal(false)}>
              <Text style={styles.fullScreenImageClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {profilePhoto && (
            <Image
              source={{
                uri: profilePhoto.startsWith("http")
                  ? profilePhoto
                  : `${API_BASE_URL}${profilePhoto}`,
              }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.fullScreenImageFooter}>
            <TouchableOpacity
              style={styles.fullScreenImageButton}
              onPress={() => {
                setShowViewPhotoModal(false);
                setShowPhotoOptions(true);
              }}
            >
              <Text style={styles.fullScreenImageButtonText}>Cambiar Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ⭐ NUEVO: Modal para VER DOCUMENTO COMPLETO */}
      <Modal
        visible={showViewDocumentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowViewDocumentModal(false)}
      >
        <View style={styles.fullScreenImageContainer}>
          <View style={styles.fullScreenImageHeader}>
            <Text style={styles.fullScreenImageTitle}>
              {selectedDocument?.document_type || "Documento"}
            </Text>
            <TouchableOpacity onPress={() => setShowViewDocumentModal(false)}>
              <Text style={styles.fullScreenImageClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {selectedDocument && (
            <Image
              source={{
                uri: selectedDocument.document_path.startsWith("http")
                  ? selectedDocument.document_path
                  : `${API_BASE_URL}${selectedDocument.document_path}`,
              }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.fullScreenImageFooter}>
            <View style={styles.documentInfoBox}>
              <Text style={styles.documentInfoText}>
                📅 Subido: {selectedDocument && new Date(selectedDocument.uploaded_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de VISTA PREVIA del documento capturado */}
      <Modal
        visible={showDocumentPreview}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={handleCancelDocumentCapture}>
              <Text style={styles.previewCloseText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Vista Previa</Text>
            <TouchableOpacity onPress={handleSelectDocumentType}>
              <Text style={styles.previewConfirmText}>Continuar</Text>
            </TouchableOpacity>
          </View>

          {capturedDocumentUri && (
            <Image
              source={{ uri: capturedDocumentUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.previewInfo}>
            <Text style={styles.previewInfoTitle}>ℹ️ Información</Text>
            <Text style={styles.previewInfoText}>
              • Asegúrate de que el documento se vea claramente
            </Text>
            <Text style={styles.previewInfoText}>
              • Verifica que no haya reflejos o sombras
            </Text>
            <Text style={styles.previewInfoText}>
              • La foto debe mostrar todo el documento
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal para SELECCIONAR TIPO DE DOCUMENTO */}
      <Modal
        visible={showDocumentTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDocumentTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.documentTypeModal}>
            <Text style={styles.documentTypeTitle}>Tipo de Documento</Text>
            <Text style={styles.documentTypeSubtitle}>
              Selecciona el tipo de documento que escaneaste
            </Text>

            <ScrollView style={styles.documentTypeList}>
              {documentTypes.map((docType) => (
                <TouchableOpacity
                  key={docType.id}
                  style={styles.documentTypeItem}
                  onPress={() => handleConfirmDocumentType(docType.name)}
                >
                  <Text style={styles.documentTypeIcon}>📄</Text>
                  <Text style={styles.documentTypeText}>{docType.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => {
                setShowDocumentTypeModal(false);
                handleCancelDocumentCapture();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación de guardado */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Cambios Guardados</Text>
            <Text style={styles.modalMessage}>
              Tu perfil se ha actualizado correctamente.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  content: {
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhotoText: {
    fontSize: 50,
  },
  photoHint: {
    marginTop: 10,
    fontSize: 14,
    color: "#007AFF",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  helpText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  locationButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  locationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  scanButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  scanButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  documentsListContainer: {
    marginTop: 20,
  },
  documentsListTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  documentItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  documentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#28a74520",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  documentIcon: {
    fontSize: 20,
  },
  documentType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: "#999",
  },
  documentThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  infoBox: {
    backgroundColor: "#fff3cd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  infoBoxText: {
    fontSize: 14,
    color: "#856404",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 40,
  },
  // Estilos para modales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  optionsModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  viewPhotoButton: {
    backgroundColor: "#e7f3ff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dc3545",
    marginTop: 10,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // ⭐ NUEVOS: Estilos para vista de imagen completa
  fullScreenImageContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullScreenImageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  fullScreenImageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  fullScreenImageClose: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  fullScreenImage: {
    flex: 1,
    width: "100%",
  },
  fullScreenImageFooter: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  fullScreenImageButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  fullScreenImageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  documentInfoBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  documentInfoText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  // Estilos del modal de vista previa
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  previewCloseText: {
    color: "#fff",
    fontSize: 16,
  },
  previewTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  previewConfirmText: {
    color: "#28a745",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    flex: 1,
    width: "100%",
  },
  previewInfo: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
  },
  previewInfoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  previewInfoText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 5,
  },
  // Estilos del modal de tipo de documento
  documentTypeModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  documentTypeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  documentTypeSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  documentTypeList: {
    maxHeight: 400,
  },
  documentTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  documentTypeIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  documentTypeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  // Estilos del modal de confirmación
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    maxWidth: 400,
    width: "85%",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});