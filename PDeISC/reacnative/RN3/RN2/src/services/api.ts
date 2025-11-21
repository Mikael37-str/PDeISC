import axios from "axios";
import { Platform } from 'react-native';

const API_URL = "http://192.168.1.47:3000/api"; 

axios.defaults.timeout = 30000;

export interface LoginData {
  name: string;
  password: string;
}

export interface RegisterData {
  name: string;
  password: string;
  email?: string;
}

export interface OAuthLoginData {
  provider: "google" | "facebook" | "apple";
  providerId: string;
  email: string;
  name: string;
  profilePhoto?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email?: string;
  profilePhoto?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  dateOfBirth?: string;
  authProvider: string;
  country?: string;
  province?: string;
  city?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface UploadPhotoResponse extends ApiResponse {
  profilePhoto?: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  dateOfBirth?: string;
  country?: string;
  province?: string;
  city?: string;
}

// Login tradicional
export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    console.log("Intentando login a:", `${API_URL}/login`);
    const response = await axios.post(`${API_URL}/login`, data);
    console.log("Respuesta login:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error en login:", error);
    return handleError(error);
  }
};

// Registro tradicional
export const register = async (data: RegisterData): Promise<ApiResponse> => {
  try {
    console.log("Intentando registro a:", `${API_URL}/register`);
    const response = await axios.post(`${API_URL}/register`, data);
    console.log("Respuesta registro:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error en registro:", error);
    return handleError(error);
  }
};

// Login con OAuth
export const oauthLogin = async (data: OAuthLoginData): Promise<ApiResponse> => {
  try {
    console.log("Intentando OAuth login:", data.provider);
    const response = await axios.post(`${API_URL}/oauth-login`, data);
    console.log("Respuesta OAuth:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error en OAuth login:", error);
    return handleError(error);
  }
};

// Obtener perfil de usuario
export const getProfile = async (userId: number): Promise<ApiResponse> => {
  try {
    console.log("📥 Obteniendo perfil de:", `${API_URL}/profile/${userId}`);
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    console.log("✅ Perfil obtenido:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error obteniendo perfil:", error);
    return handleError(error);
  }
};

// Actualizar perfil
export const updateProfile = async (
  userId: number,
  data: ProfileUpdateData
): Promise<ApiResponse> => {
  try {
    console.log("📤 Actualizando perfil:", `${API_URL}/profile/${userId}`);
    console.log("📝 Datos a enviar:", data);
    
    const response = await axios.put(`${API_URL}/profile/${userId}`, data);
    
    console.log("✅ Perfil actualizado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error actualizando perfil:", error);
    return handleError(error);
  }
};

// Subir foto de perfil - VERSIÓN CORREGIDA PARA WEB Y MÓVIL
export const uploadProfilePhoto = async (
  userId: number,
  uri: string
): Promise<UploadPhotoResponse> => {
  try {
    console.log("📤 Iniciando subida de foto de perfil...");
    console.log("📍 URI:", uri);
    console.log("👤 UserID:", userId);
    console.log("🖥️ Platform:", Platform.OS);

    const formData = new FormData();
    
    const filename = uri.split("/").pop() || `profile_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    console.log("📄 Filename:", filename);
    console.log("🎨 Type:", type);

    if (Platform.OS === 'web') {
      console.log("🌐 Modo WEB detectado");
      
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], filename, { type, lastModified: Date.now() });
        
        formData.append("photo", file);
        console.log("✅ Blob convertido a File para web");
      } catch (blobError) {
        console.error("❌ Error convirtiendo blob:", blobError);
        throw new Error("No se pudo procesar la imagen para web");
      }
    } else {
      console.log("📱 Modo MÓVIL detectado");
      
      // Asegurar que el MIME type sea correcto
      let mimeType = type;
      
      // Si no detectamos extensión, forzar JPEG
      if (!match || match[1] === 'bin') {
        mimeType = 'image/jpeg';
        console.log("⚠️ Extensión no detectada, usando JPEG por defecto");
      }
      
      // Normalizar el nombre del archivo
      const normalizedFilename = filename.includes('.') 
        ? filename 
        : `${filename}.jpg`;
      
      console.log("📝 Nombre normalizado:", normalizedFilename);
      console.log("📝 MIME type normalizado:", mimeType);
      
      // Formato correcto para React Native
      formData.append("photo", {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: normalizedFilename,
        type: mimeType,
      } as any);
      
      console.log("✅ FormData configurado para móvil");
    }

    console.log("📡 Enviando a:", `${API_URL}/profile/${userId}/photo`);

    // USAR FETCH PARA MÓVIL, AXIOS PARA WEB
    if (Platform.OS !== 'web') {
      console.log("📱 Usando fetch() para móvil...");
      
      // NO establecer Content-Type manualmente en móvil
      const response = await fetch(`${API_URL}/profile/${userId}/photo`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      console.log("📥 Respuesta del servidor:", data);
      console.log("📥 Status:", response.status);

      if (response.ok && data.success) {
        return {
          success: true,
          message: "Foto de perfil actualizada",
          profilePhoto: data.profilePhoto,
        };
      } else {
        throw new Error(data.message || 'Error al subir la foto');
      }
    } else {
      // Para WEB, usar axios
      console.log("🌐 Usando axios para web...");
      
      const response = await axios.post(
        `${API_URL}/profile/${userId}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
          timeout: 120000,
          transformRequest: (data) => data,
        }
      );

      console.log("✅ Foto subida exitosamente:", response.data);
      
      return {
        success: true,
        message: "Foto de perfil actualizada",
        profilePhoto: response.data.profilePhoto,
      };
    }
  } catch (error: any) {
    console.error("❌ Error subiendo foto:", error);
    
    if (error.response) {
      console.error("📛 Response status:", error.response.status);
      console.error("📛 Response data:", error.response.data);
    }
    
    return {
      success: false,
      message: error.message || "Error al subir la foto de perfil",
    };
  }
};

// Subir documento - VERSIÓN CORREGIDA PARA WEB Y MÓVIL
export const uploadDocument = async (
  userId: number,
  uri: string,
  documentType: string
): Promise<ApiResponse> => {
  try {
    console.log("📤 Iniciando subida de documento...");
    console.log("📍 URI:", uri);
    console.log("👤 UserID:", userId);
    console.log("📋 Tipo:", documentType);
    console.log("🖥️ Platform:", Platform.OS);

    const formData = new FormData();
    
    const filename = uri.split("/").pop() || `document_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    console.log("📄 Filename:", filename);
    console.log("🎨 Type:", type);

    if (Platform.OS === 'web') {
      console.log("🌐 Modo WEB detectado");
      
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], filename, { type, lastModified: Date.now() });
        
        formData.append("document", file);
        console.log("✅ Blob convertido a File para web");
      } catch (blobError) {
        console.error("❌ Error convirtiendo blob:", blobError);
        throw new Error("No se pudo procesar el documento para web");
      }
    } else {
      console.log("📱 Modo MÓVIL detectado");
      
      // Asegurar que el MIME type sea correcto
      let mimeType = type;
      
      if (!match || match[1] === 'bin') {
        mimeType = 'image/jpeg';
        console.log("⚠️ Extensión no detectada, usando JPEG por defecto");
      }
      
      const normalizedFilename = filename.includes('.') 
        ? filename 
        : `${filename}.jpg`;
      
      console.log("📝 Nombre normalizado:", normalizedFilename);
      console.log("📝 MIME type normalizado:", mimeType);
      
      // Formato correcto para React Native
      formData.append("document", {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: normalizedFilename,
        type: mimeType,
      } as any);
      
      console.log("✅ FormData configurado para móvil");
    }
    
    formData.append("documentType", documentType);

    console.log("📡 Enviando a:", `${API_URL}/profile/${userId}/document`);

    // USAR FETCH PARA MÓVIL, AXIOS PARA WEB
    if (Platform.OS !== 'web') {
      console.log("📱 Usando fetch() para móvil...");
      
      // NO establecer Content-Type manualmente
      const response = await fetch(`${API_URL}/profile/${userId}/document`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      console.log("✅ Respuesta del servidor:", data);

      if (response.ok && data.success) {
        return {
          success: true,
          message: "Documento subido correctamente",
        };
      } else {
        throw new Error(data.message || 'Error al subir el documento');
      }
    } else {
      // Para WEB, usar axios
      console.log("🌐 Usando axios para web...");
      
      const response = await axios.post(
        `${API_URL}/profile/${userId}/document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
          timeout: 120000,
          transformRequest: (data) => data,
        }
      );

      console.log("✅ Documento subido exitosamente:", response.data);
      
      return {
        success: true,
        message: "Documento subido correctamente",
      };
    }
  } catch (error: any) {
    console.error("❌ Error subiendo documento:", error);
    
    if (error.response) {
      console.error("📛 Response status:", error.response.status);
      console.error("📛 Response data:", error.response.data);
    }
    
    return {
      success: false,
      message: error.message || "Error al subir el documento",
    };
  }
};

// Obtener documentos
export const getDocuments = async (userId: number) => {
  try {
    console.log("📥 Obteniendo documentos de:", `${API_URL}/profile/${userId}/documents`);
    const response = await axios.get(`${API_URL}/profile/${userId}/documents`);
    console.log("✅ Documentos obtenidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error obteniendo documentos:", error);
    return handleError(error);
  }
};

// Manejo de errores centralizado
const handleError = (error: any): ApiResponse => {
  if (error.response) {
    console.error("📛 Error del servidor:", {
      status: error.response.status,
      data: error.response.data,
    });
    
    return {
      success: false,
      message: error.response.data?.message || `Error del servidor (${error.response.status})`,
    };
  } else if (error.request) {
    console.error("📛 Sin respuesta del servidor");
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que:\n" +
        "1. El servidor backend esté corriendo\n" +
        "2. La IP sea correcta en api.ts: " + API_URL + "\n" +
        "3. Tu dispositivo esté en la misma red WiFi\n" +
        "4. El firewall no esté bloqueando el puerto 3000"
    );
  } else {
    console.error("📛 Error:", error.message);
    throw new Error("Error al realizar la petición: " + error.message);
  }
};

// Test de conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get(API_URL.replace("/api", "/health"), {
      timeout: 5000,
    });
    console.log("✅ Test de conexión exitoso:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Test de conexión falló:", error);
    return false;
  }
};