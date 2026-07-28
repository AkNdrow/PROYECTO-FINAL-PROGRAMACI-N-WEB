# 📡 Especificación y Justificación de la API REST - CleverNote

Este documento explica la arquitectura, endpoints y justificación técnica del uso de la API REST propia en **Laravel** (`api-CRUD`) ubicada en el directorio `/backend` de este repositorio.

---

## 🎯 Justificación Técnica de la API

La selección de esta arquitectura en Laravel responde a las siguientes razones de ingeniería:

1. **Seguridad con Laravel Sanctum (Tokens Bearer)**:
   - Permite la emisión de tokens ligeros (`plainTextToken`) en el endpoint `/api/login`.
   - Garantiza que cada petición de notas `.md` viaja de forma autenticada y cifrada con la cabecera `Authorization: Bearer <token>`.

2. **Aislamiento Estricto por Usuario (Multi-tenant)**:
   - La API valida en cada controlador (`ItemController.php`) que un usuario solo pueda leer, editar (`PUT`) o eliminar (`DELETE`) los documentos que son de su propiedad (`$request->user()->id !== $item->user_id`).

3. **Arquitectura Ligera y Modular (< 1000 Líneas)**:
   - Al ser una API REST pura que solo retorna JSON, no carga vistas de Blade ni pesados motores de plantilla en el servidor, maximizando la velocidad de respuesta y manteniendo el código backend sumamente reducido.

---

## 📋 Endpoints de la API REST

### 1. Autenticación (`AuthController`)

* **`POST /api/register`**
  - **Cuerpo JSON**: `{ "name": "Nombre", "email": "usuario@correo.com", "password": "password123" }`
  - **Respuesta (201)**: `{ "message": "Usuario registrado exitosamente", "user": { ... } }`

* **`POST /api/login`**
  - **Cuerpo JSON**: `{ "email": "usuario@correo.com", "password": "password123" }`
  - **Respuesta (200)**: `{ "message": "Inicio de sesión exitoso", "access_token": "1|token_hash...", "token_type": "Bearer" }`

---

### 2. Gestión de Documentos Markdown (`ItemController`)

*Todas las rutas requieren la cabecera `Authorization: Bearer <token>`.*

* **`GET /api/items`**
  - Retorna la lista de documentos `.md` pertenecientes al usuario autenticado.

* **`POST /api/items`**
  - **Cuerpo JSON**: `{ "name": "Título de la nota.md", "description": "# Contenido Markdown" }`
  - Crea un nuevo archivo en la base de datos.

* **`GET /api/items/{id}`**
  - Retorna los detalles de un documento por su ID.

* **`PUT /api/items/{id}`**
  - **Cuerpo JSON**: `{ "name": "Título Editado", "description": "# Contenido Actualizado" }`
  - Guarda los cambios realizados en el editor de Markdown.

* **`DELETE /api/items/{id}`**
  - Elimina el documento especificado.

---

## 🔄 Estrategia Híbrida y Resiliencia (Modo Offline / Local)

El servicio cliente `frontend/src/services/api.js` implementa un patrón **Fallback Graceful**:
- Si el servidor backend de Laravel se encuentra activo en `http://localhost:8000/api` o en el VPS de producción, todas las operaciones se procesan directamente contra la base de datos SQL.
- Si el backend está desconectado durante pruebas locales del equipo, la aplicación cae automáticamente a la simulación mediante `localStorage`, garantizando que las pruebas nunca se vean bloqueadas.
