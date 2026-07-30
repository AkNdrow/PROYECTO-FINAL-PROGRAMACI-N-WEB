# Documentación: Arquitectura y Lógica de Base de Datos

Este documento describe la estructura actual, el flujo de conexión y el modelo de datos implementado en **CleverNote** hasta la fecha actual.

---

## 1. Tecnología Principal

El sistema utiliza un enfoque moderno de bases de datos relacionales basado en el patrón **MVC (Modelo-Vista-Controlador)**:
*   **Motor de Base de Datos:** MySQL.
*   **Gestor ORM (Object-Relational Mapping):** Laravel Eloquent.

> [!NOTE]
> En CleverNote no se escriben consultas SQL puras (`SELECT`, `INSERT`). Toda la interacción con MySQL se realiza a través de **Modelos PHP** (como `User.php`), lo que garantiza seguridad contra inyecciones SQL y un código mucho más limpio.

---

## 2. Flujo de Conexión (El archivo `.env`)

El puente entre la aplicación (Laravel) y el motor de MySQL es el archivo `.env`. Las credenciales configuradas aquí dictan dónde y cómo se almacena la información.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clevernote_db
DB_USERNAME=clevernote_user
DB_PASSWORD=********
```
*   **`DB_HOST=127.0.0.1`**: Indica que el servicio de MySQL corre en la misma máquina física (el VPS o el entorno local).
*   **Usuarios Restringidos**: En producción (VPS), se utiliza un usuario específico (`clevernote_user`) con contraseña segura, en lugar del usuario administrador `root`. Esta es una práctica fundamental de ciberseguridad.

---

## 3. Arquitectura Actual (Esquema de Tablas)

La base de datos se construye utilizando **Migraciones**, las cuales funcionan como un control de versiones de las tablas. Se encuentran en `backend/database/migrations/`.

Hasta el momento, la base de datos cuenta con las siguientes tablas principales:

### A. Tabla `users` (Módulo de Usuarios)
Almacena la información de los usuarios registrados y el estado de su validación.
*   `id` (Clave Primaria)
*   `name` (String)
*   `email` (String, Único)
*   `email_verified_at` (Timestamp, NULL por defecto. Se llena al confirmar el correo).
*   `password` (String, Hash encriptado con Bcrypt).

### B. Tabla `personal_access_tokens` (Autenticación)
Gestionada automáticamente por **Laravel Sanctum**. Emite y verifica los tokens (Bearer Tokens) cada vez que el Frontend (React) intenta acceder a rutas protegidas.

### C. Tabla `items` (Estructura Genérica / Notas preliminares)
Actualmente sirve como base para el futuro módulo de Documentos/Almacenes.
*   `id` (Clave Primaria)
*   `user_id` (Clave Foránea apuntando a `users.id`)
*   `name` (String)
*   `description` (Text)

> [!TIP]
> **Relaciones Eloquent:** En el modelo `app/Models/User.php`, existe la función `items()` con la instrucción `$this->hasMany(Item::class)`. Esto impone una relación de **"Uno a Muchos"** (Un usuario es dueño de múltiples ítems). La base de datos aplica un `onDelete('cascade')`, lo que significa que si se borra un usuario, todos sus ítems se borrarán automáticamente.

---

## 4. Comandos de Administración (Consola)

Para gestionar la base de datos a nivel de desarrollo o despliegue en el VPS, se utilizan los siguientes comandos de `artisan`:

| Comando | Función |
| :--- | :--- |
| `php artisan migrate` | Lee los archivos de la carpeta `migrations/` y crea o actualiza las tablas faltantes en MySQL. |
| `php artisan migrate:rollback` | Deshace la última migración (útil si se cometió un error en una tabla). |
| `php artisan migrate:fresh` | **¡Peligro!** Borra absolutamente todas las tablas y las vuelve a crear desde cero, perdiendo todos los datos. |

---

## 5. Próximos Pasos (Evolución de la Arquitectura)

De acuerdo a la planificación del proyecto (README), la estructura actual deberá evolucionar. Próximamente se deberán crear las migraciones para:
1.  **`documents`**: Reemplazará o expandirá a `items`, almacenando el contenido en Markdown, tipo de formato (MD, LaTeX, TXT) y ruta de acceso.
2.  **`folders`**: Módulo de almacenes para permitir jerarquía (una carpeta tiene muchos documentos).
3.  **`tasks`**: Seguimiento de estado de los documentos (Pendiente, Completado).



##  Documentación de Base de Datos (MySQL)

### 1. Estructura y Parámetros Generales
* **Motor de Base de Datos:** MySQL (Servidor de producción VPS / Entorno de desarrollo local).
* **Gestión de Esquema:** Migraciones nativas de Laravel (`backend/database/migrations/`).
* **Respaldo Físico:** Script SQL completo generado en `backend/database/dump.sql`.

---

### 2. Tablas y Modelo de Datos
El proyecto implementa las tablas requeridas por el dominio del sistema más la infraestructura de autenticación y cache de Laravel:

* **`users`**: Registro de usuarios, contraseñas hasheadas y referencia de rol (`role_id`).
* **`roles`**: Definición de niveles de acceso (`admin`, `client`, `editor`).
* **`documents`**: Almacenamiento de documentos y notas creados en CleverNote.
* **`tags`**: Catálogo de etiquetas para clasificación de contenido.
* **`items`**: Módulos complementarios asignados al sistema.
* **`document_tag` (Tabla Pivote - Relación N:M)**: Implementación de la relación **Muchos a Muchos** entre documentos y etiquetas (un documento puede poseer múltiples etiquetas y una etiqueta puede pertenecer a varios documentos).

---

### 3. Poblado Automático (Seeders y Factories)
Se configuró `DatabaseSeeder.php` para la regeneración completa de datos de prueba:

* **`RoleSeeder`**: Carga de roles base del sistema.
* **`UserSeeder`**: Generación de 1 usuario Administrador de evaluación (`admin@clevernote.com`) y 14 usuarios tipo cliente mediante `UserFactory`.
* **`DocumentSeeder`**: Creación automatizada de 2 a 4 documentos asociados a cada usuario registrado.
* **`TagSeeder`**: Generación de 15 etiquetas y asignación aleatoria de 1 a 3 etiquetas por documento en la tabla pivote `document_tag`.

---

### 4. Comandos de Despliegue y Mantenimiento

Para reconstruir la base de datos y ejecutar el sembrado de datos de prueba:
```bash
php artisan migrate:fresh --seed