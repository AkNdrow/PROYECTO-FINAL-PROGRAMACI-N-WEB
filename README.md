# 📝 CleverNote — Sistema de Gestión y Documentación Técnica

## Problemática que Resuelve
Los estudiantes y profesionales técnicos suelen utilizar múltiples herramientas inconexas para escribir, previsualizar y organizar documentos en formatos específicos (Markdown, LaTeX, HTML y TXT). Esto genera desorden en la información y una baja en la productividad al no contar con un entorno centralizado que unifique la autenticación, la gestión, el almacenamiento seguro y la lectura ágil de estos distintos tipos de archivos en una sola plataforma.

---

##  Integrantes del Equipo

* **Andrés Cuevas García**
* **Moisés Pascual Coyolt**

---

##  Enlaces del Proyecto

* **Sitio Web Desplegado (VPS / HTTPS):** [https://clevernote.duckdns.org/login]
* **URL Base de la API REST:** `https://clevernote.duckdns.org/api`
* **Repositorio en GitHub:** [https://github.com/AkNdrow/PROYECTO-FINAL-PROGRAMACI-N-WEB]
* **Tablero de GitHub Projects:** [https://github.com/users/AkNdrow/projects/3]
* **Prototipo Navegable en Figma:** [https://www.figma.com/site/wavpoFaraouq3CfaEWxceD/Prototipo?node-id=0-1&p=f&t=EWkAyxBO23DbIgDb-0]

---

##  Credenciales de Prueba

Para la revisión de roles y permisos del sistema, se cuentan con los siguientes usuarios precargados en la base de datos:

| Rol | Correo Electrónico | Contraseña | Permisos / Alcance |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@clevernote.com` | `Admin#2026!` | Acceso total al sistema, gestión de usuarios y CRUD global. |
| **Cliente / Estándar** | `cliente@clevernote.com` | `Cliente#2026!` | Acceso limitado únicamente a sus propios documentos y almacenes. |
| **Developer / Editor** | `dev@clevernote.com` | `Developer#2026!` | Rol técnico para pruebas de edición y herramientas extendidas. |

---

##  Tecnologías Utilizadas

* **Backend:** Laravel 11 (API RESTful), Laravel Sanctum (Autenticación por Token).
* **Frontend:** React + Vite, Axios, Tailwind CSS / React Router DOM.
* **Base de Datos:** MySQL (Servido en VPS con InnoDB).
* **Infraestructura / Despliegue:** VPS Ubuntu Server, Nginx (Proxy Reverso), Let's Encrypt (Certbot SSL/HTTPS), Postfix (MTA Correo Local).
* **Integraciones:** Twilio API (Notificaciones por SMS y WhatsApp).
* **Testing:** Bruno (Colección de peticiones API versionada en carpeta `/bruno`).

---

##  Módulos Principales del Sistema

* **Módulo de Usuarios & Autenticación:** Registro, inicio de sesión, logout 
* **Módulo de Documentos (Notas):** CRUD completo de archivos (`.md`, `.latex`, `.txt`, `.html`), asociación de etiquetas ($N:M$) y filtrado server-side.
* **Módulo de Almacenes:** Sistema de agrupación lógica (carpetas/categorías) para organizar el entorno de trabajo del usuario.
* **Módulo de Tareas & Estados:** Tablero de control interactivo para gestionar el estado de revisión de cada documento.
* **Módulo de Notificaciones:** Disparo automático de alertas vía SMS y WhatsApp al realizar acciones críticas.

---

##  Diagrama Entidad-Relación (ER)

```mermaid
erDiagram
    roles {
        int id PK
        string name
        string description
    }

    users {
        int id PK
        int role_id FK
        string name
        string email
        string password
        datetime email_verified_at
        datetime created_at
        datetime updated_at
    }

    stores {
        int id PK
        int user_id FK
        string name
        string description
        datetime created_at
        datetime updated_at
    }

    documents {
        int id PK
        int user_id FK
        int store_id FK
        string title
        text content
        string extension
        string status
        datetime created_at
        datetime updated_at
    }

    tags {
        int id PK
        string name
        string color
        datetime created_at
        datetime updated_at
    }

    document_tag {
        int document_id PK, FK
        int tag_id PK, FK
    }

    roles ||--o{ users : "1 a N (posee)"
    users ||--o{ stores : "1 a N (crea/administra)"
    users ||--o{ documents : "1 a N (es autor de)"
    stores ||--o{ documents : "1 a N (agrupa)"
    documents ||--o{ document_tag : "1 a N (pivote)"
    tags ||--o{ document_tag : "1 a N (pivote)"