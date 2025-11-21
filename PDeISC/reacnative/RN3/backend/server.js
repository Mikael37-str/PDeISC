const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear carpeta para uploads si no existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Carpeta uploads creada");
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log("📋 Validando archivo recibido:");
    console.log("   - fieldname:", file.fieldname);
    console.log("   - originalname:", file.originalname);
    console.log("   - mimetype:", file.mimetype);
    console.log("   - encoding:", file.encoding);

    // Validación más flexible para MIME types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf',
      // Agregar tipos que pueden venir desde móvil
      'image/heic',
      'image/heif',
      'application/octet-stream' // Algunos móviles envían este tipo genérico
    ];

    const allowedExtensions = /\.(jpe?g|png|pdf|heic|heif)$/i;

    // Validar por MIME type O por extensión
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.test(file.originalname);

    if (isValidMimeType || isValidExtension) {
      console.log("✅ Archivo válido aceptado");
      return cb(null, true);
    } else {
      console.log("❌ Archivo rechazado - MIME:", file.mimetype, "- Nombre:", file.originalname);
      cb(new Error(`Tipo de archivo no permitido. Recibido: ${file.mimetype}. Se permiten: JPEG, PNG, PDF`));
    }
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Middleware de logging
app.use((req, res, next) => {
  console.log("======================");
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method !== "GET") console.log("Body:", req.body);
  console.log("======================");
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// AUTENTICACIÓN TRADICIONAL
// ============================================

// Registro tradicional
app.post("/api/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre y contraseña son requeridos",
      });
    }

    if (/^\d+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "El nombre no puede contener solo números",
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 4 caracteres",
      });
    }

    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE name = ? OR email = ?",
      [name, email || null]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, password, email, auth_provider, created_at) VALUES (?, ?, ?, 'local', NOW())",
      [name, hashedPassword, email || null]
    );

    console.log("✅ Usuario registrado:", result.insertId);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: result.insertId,
        name: name,
        email: email || null,
      },
    });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Login tradicional
app.post("/api/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre y contraseña son requeridos",
      });
    }

    const [users] = await db.execute(
      "SELECT * FROM users WHERE name = ? AND auth_provider = 'local'",
      [name]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    console.log("✅ Login exitoso:", user.name);

    res.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profile_photo,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        authProvider: user.auth_provider,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// ============================================
// AUTENTICACIÓN OAUTH
// ============================================

// Login/Registro con OAuth (Google, Facebook, Apple)
app.post("/api/oauth-login", async (req, res) => {
  try {
    const { provider, providerId, email, name, profilePhoto } = req.body;

    console.log("🔍 OAuth Login Request:", { provider, email, name });

    if (!provider || !providerId || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "Datos de proveedor incompletos",
      });
    }

    const validProviders = ["google", "facebook", "apple"];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Proveedor OAuth no válido",
      });
    }

    // Buscar usuario existente con este proveedor
    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE auth_provider = ? AND provider_id = ?",
      [provider, providerId]
    );

    let user;

    if (existingUsers.length > 0) {
      // Usuario existe
      user = existingUsers[0];
      
      console.log("✅ Usuario OAuth existente:", user.id);

      await db.execute(
        "UPDATE users SET last_login = NOW(), profile_photo = COALESCE(?, profile_photo) WHERE id = ?",
        [profilePhoto, user.id]
      );

      user.profile_photo = profilePhoto || user.profile_photo;
    } else {
      console.log("🆕 Creando nuevo usuario OAuth");

      // Verificar si el email ya existe con otro método
      const [emailCheck] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Este email ya está registrado con otro método",
        });
      }

      // Crear nuevo usuario
      const [result] = await db.execute(
        `INSERT INTO users (
          name, 
          email, 
          auth_provider, 
          provider_id, 
          profile_photo,
          role,
          created_at,
          last_login
        ) VALUES (?, ?, ?, ?, ?, 'user', NOW(), NOW())`,
        [name, email, provider, providerId, profilePhoto || null]
      );

      console.log("✅ Usuario OAuth creado:", result.insertId);

      user = {
        id: result.insertId,
        name: name,
        email: email,
        auth_provider: provider,
        provider_id: providerId,
        profile_photo: profilePhoto,
        role: "user",
      };
    }

    res.json({
      success: true,
      message: "Login exitoso con " + provider,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profile_photo,
        phone: user.phone || null,
        address: user.address || null,
        bio: user.bio || null,
        authProvider: provider,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("❌ Error en OAuth login:", error);
    
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Esta cuenta OAuth ya está vinculada a otro usuario",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// ============================================
// PERFIL DE USUARIO
// ============================================

// Obtener perfil
app.get("/api/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("📥 Obteniendo perfil de usuario:", userId);

    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const user = users[0];

    console.log("✅ Perfil encontrado:", user.name);
    console.log("📸 Foto de perfil:", user.profile_photo || "Sin foto");

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profile_photo,
        phone: user.phone,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        bio: user.bio,
        dateOfBirth: user.date_of_birth,
        authProvider: user.auth_provider,
        createdAt: user.created_at,
        country: user.country,
        province: user.province,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("❌ Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Actualizar perfil de usuario
app.put("/api/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      email,
      phone,
      address,
      latitude,
      longitude,
      bio,
      dateOfBirth,
      country,
      province,
      city,
    } = req.body;

    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (address !== undefined) {
      updates.push("address = ?");
      values.push(address);
    }
    if (latitude !== undefined) {
      updates.push("latitude = ?");
      values.push(latitude);
    }
    if (longitude !== undefined) {
      updates.push("longitude = ?");
      values.push(longitude);
    }
    if (bio !== undefined) {
      updates.push("bio = ?");
      values.push(bio);
    }
    if (dateOfBirth !== undefined) {
      updates.push("date_of_birth = ?");
      values.push(dateOfBirth);
    }
    if (country !== undefined) {
      updates.push("country = ?");
      values.push(country);
    }
    if (province !== undefined) {
      updates.push("province = ?");
      values.push(province);
    }
    if (city !== undefined) {
      updates.push("city = ?");
      values.push(city);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay datos para actualizar",
      });
    }

    values.push(userId);

    console.log("📝 Actualizando perfil:", { userId, updates: updates.join(", ") });

    await db.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    const user = users[0];

    console.log("✅ Perfil actualizado correctamente");

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profile_photo,
        phone: user.phone,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        bio: user.bio,
        dateOfBirth: user.date_of_birth,
        country: user.country,
        province: user.province,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("❌ Error actualizando perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Subir foto de perfil
app.post(
  "/api/profile/:userId/photo",
  upload.single("photo"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      console.log("📸 =================================");
      console.log("📸 RECIBIENDO FOTO DE PERFIL");
      console.log("📸 UserID:", userId);
      console.log("📸 File recibido:", req.file ? "SÍ" : "NO");
      
      if (req.file) {
        console.log("📸 Detalles del archivo:");
        console.log("   - Nombre original:", req.file.originalname);
        console.log("   - Nombre guardado:", req.file.filename);
        console.log("   - Tamaño:", req.file.size, "bytes");
        console.log("   - Ruta:", req.file.path);
        console.log("   - MIME type:", req.file.mimetype);
      }
      console.log("📸 =================================");

      if (!req.file) {
        console.error("❌ No se recibió archivo");
        return res.status(400).json({
          success: false,
          message: "No se proporcionó ninguna imagen",
        });
      }

      const photoPath = `/uploads/${req.file.filename}`;

      console.log("💾 Guardando en BD...");
      console.log("   - Path relativo:", photoPath);

      // Eliminar foto anterior si existe
      try {
        const [users] = await db.execute(
          "SELECT profile_photo FROM users WHERE id = ?",
          [userId]
        );

        if (users.length > 0 && users[0].profile_photo) {
          const oldPhotoPath = path.join(
            __dirname,
            users[0].profile_photo.replace(/^\//, "")
          );
          
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
            console.log("🗑️ Foto anterior eliminada:", oldPhotoPath);
          }
        }
      } catch (deleteError) {
        console.error("⚠️ Error eliminando foto anterior:", deleteError.message);
      }

      // Actualizar en la base de datos
      await db.execute(
        "UPDATE users SET profile_photo = ? WHERE id = ?",
        [photoPath, userId]
      );

      console.log("✅ Foto de perfil actualizada en BD");
      console.log("✅ =================================\n");

      res.json({
        success: true,
        message: "Foto de perfil actualizada",
        profilePhoto: photoPath,
      });
    } catch (error) {
      console.error("❌ Error subiendo foto:", error);
      console.error("❌ Stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Error en el servidor: " + error.message,
      });
    }
  }
);

// Subir documento
app.post(
  "/api/profile/:userId/document",
  upload.single("document"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { documentType } = req.body;

      console.log("📄 =================================");
      console.log("📄 RECIBIENDO DOCUMENTO");
      console.log("📄 UserID:", userId);
      console.log("📄 Tipo:", documentType);
      console.log("📄 File recibido:", req.file ? "SÍ" : "NO");
      
      if (req.file) {
        console.log("📄 Detalles del archivo:");
        console.log("   - Nombre original:", req.file.originalname);
        console.log("   - Nombre guardado:", req.file.filename);
        console.log("   - Tamaño:", req.file.size, "bytes");
        console.log("   - Ruta:", req.file.path);
        console.log("   - MIME type:", req.file.mimetype);
      }
      console.log("📄 =================================");

      if (!req.file) {
        console.error("❌ No se recibió archivo");
        return res.status(400).json({
          success: false,
          message: "No se proporcionó ningún documento",
        });
      }

      if (!documentType) {
        console.error("❌ No se especificó tipo de documento");
        return res.status(400).json({
          success: false,
          message: "Tipo de documento requerido",
        });
      }

      const documentPath = `/uploads/${req.file.filename}`;

      console.log("💾 Guardando en BD...");
      console.log("   - Path relativo:", documentPath);

      const [result] = await db.execute(
        "INSERT INTO user_documents (user_id, document_type, document_path, uploaded_at) VALUES (?, ?, ?, NOW())",
        [userId, documentType, documentPath]
      );

      console.log("✅ Documento registrado en BD con ID:", result.insertId);
      console.log("✅ =================================\n");

      res.json({
        success: true,
        message: "Documento subido exitosamente",
        document: {
          id: result.insertId,
          documentType: documentType,
          documentPath: documentPath,
        },
      });
    } catch (error) {
      console.error("❌ Error subiendo documento:", error);
      console.error("❌ Stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Error en el servidor: " + error.message,
      });
    }
  }
);

// Obtener documentos
app.get("/api/profile/:userId/documents", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("📥 Obteniendo documentos para userId:", userId);

    const [documents] = await db.execute(
      "SELECT * FROM user_documents WHERE user_id = ? ORDER BY uploaded_at DESC",
      [userId]
    );

    console.log(`✅ ${documents.length} documentos encontrados`);

    res.json({
      success: true,
      documents: documents,
    });
  } catch (error) {
    console.error("❌ Error obteniendo documentos:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// ============================================
// ADMINISTRACIÓN (Solo Admin)
// ============================================

// Login de admin
app.post("/api/admin/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre y contraseña son requeridos",
      });
    }

    const [users] = await db.execute(
      "SELECT * FROM users WHERE name = ? AND role = 'admin'",
      [name]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales de administrador incorrectas",
      });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales de administrador incorrectas",
      });
    }

    await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    console.log("✅ Admin login exitoso:", user.name);

    res.json({
      success: true,
      message: "Login de administrador exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en admin login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Obtener todos los usuarios (solo admin)
app.get("/api/admin/users", async (req, res) => {
  try {
    const { adminId } = req.query;

    const [adminCheck] = await db.execute(
      "SELECT role FROM users WHERE id = ?",
      [adminId]
    );

    if (adminCheck.length === 0 || adminCheck[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado",
      });
    }

    const [users] = await db.execute(
      `SELECT id, name, email, phone, role, auth_provider, created_at, last_login 
       FROM users 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      users: users,
      total: users.length,
    });
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Cambiar rol de usuario (solo admin)
app.put("/api/admin/users/:userId/role", async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminId, newRole } = req.body;

    const [adminCheck] = await db.execute(
      "SELECT role FROM users WHERE id = ?",
      [adminId]
    );

    if (adminCheck.length === 0 || adminCheck[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado",
      });
    }

    if (parseInt(userId) === parseInt(adminId)) {
      return res.status(400).json({
        success: false,
        message: "No puedes cambiar tu propio rol",
      });
    }

    if (!["admin", "user"].includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Rol inválido",
      });
    }

    await db.execute("UPDATE users SET role = ? WHERE id = ?", [
      newRole,
      userId,
    ]);

    await db.execute(
      "INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at) VALUES (?, 'change_role', ?, ?, NOW())",
      [adminId, userId, `Cambió rol a: ${newRole}`]
    );

    console.log(`✅ Rol cambiado: User ${userId} -> ${newRole}`);

    res.json({
      success: true,
      message: "Rol actualizado correctamente",
    });
  } catch (error) {
    console.error("❌ Error cambiando rol:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Eliminar usuario (solo admin)
app.delete("/api/admin/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminId } = req.body;

    const [adminCheck] = await db.execute(
      "SELECT role FROM users WHERE id = ?",
      [adminId]
    );

    if (adminCheck.length === 0 || adminCheck[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado",
      });
    }

    if (parseInt(userId) === parseInt(adminId)) {
      return res.status(400).json({
        success: false,
        message: "No puedes eliminarte a ti mismo",
      });
    }

    const [userCheck] = await db.execute(
      "SELECT role, name FROM users WHERE id = ?",
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (userCheck[0].role === "admin") {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar a otro administrador",
      });
    }

    await db.execute("DELETE FROM users WHERE id = ?", [userId]);

    await db.execute(
      "INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at) VALUES (?, 'delete_user', ?, ?, NOW())",
      [adminId, userId, `Eliminó usuario: ${userCheck[0].name}`]
    );

    console.log(`✅ Usuario eliminado: ${userCheck[0].name}`);

    res.json({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// Obtener estadísticas (solo admin)
app.get("/api/admin/stats", async (req, res) => {
  try {
    const { adminId } = req.query;

    const [adminCheck] = await db.execute(
      "SELECT role FROM users WHERE id = ?",
      [adminId]
    );

    if (adminCheck.length === 0 || adminCheck[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado",
      });
    }

    const [totalUsers] = await db.execute(
      "SELECT COUNT(*) as total FROM users"
    );

    const [todayUsers] = await db.execute(
      "SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()"
    );

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers[0].total,
        todayUsers: todayUsers[0].total,
      },
    });
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor: " + error.message,
    });
  }
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Ruta no encontrada
app.use((req, res) => {
  console.log("❌ Ruta no encontrada:", req.method, req.url);
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada: " + req.url,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const server = app
  .listen(PORT, "0.0.0.0", () => {
    console.log("==============================================");
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Carpeta de uploads: ${uploadsDir}`);
    console.log(`🔐 OAuth configurado para Google, Facebook, Apple`);
    console.log("==============================================");
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ El puerto ${PORT} ya está en uso`);
    } else {
      console.error("❌ Error al iniciar el servidor:", err);
    }
    process.exit(1);
  });

// Manejo de señales
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM recibido, cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n⚠️ SIGINT recibido, cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
});

module.exports = app;