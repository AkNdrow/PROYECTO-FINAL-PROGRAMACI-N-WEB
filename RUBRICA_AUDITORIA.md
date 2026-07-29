### 1. Base de Datos (10 pts)
* [ ] **Motor MySQL:** Configurado estrictamente sobre MySQL (no MariaDB).
* [ ] **Migraciones Laravel:** Todas las tablas creadas mediante `database/migrations/`.
* [ ] **Estructura N:M:** Mínimo 5 tablas relacionadas con al menos una relación de muchos a muchos (N:M).
* [ ] **Seeders:** Al menos 10-15 registros de prueba por tabla principal (`php artisan db:seed`).
* [ ] **Script SQL:** Respaldo `.sql` actualizado guardado en la raíz o en `database/dump.sql`.
* [ ] **Diagrama ER:** Diagrama Entidad-Relación incluido como imagen/Mermaid en el `README.md`.

---

### 2. Backend Laravel (15 pts)
* [ ] **API RESTful:** Rutas organizadas exclusivamente en `routes/api.php`.
* [ ] **Autenticación Sanctum:** Login, Registro, Logout y Recuperación de contraseña activos.
* [ ] **Form Requests:** Validaciones aisladas en `app/Http/Requests/` (prohibido `$request->validate()` en controladores).
* [ ] **API Resources:** Respuestas JSON estructuradas mediante `app/Http/Resources/`.
* [ ] **Respuestas y Códigos HTTP:** Retorno explícito de estatus `200`, `201`, `401`, `403`, `404`, `422`, `500`.
* [ ] **Relaciones Eloquent:** Definidas en los Modelos (`hasMany`, `belongsTo`, `belongsToMany`).

---

### 3. Frontend React (15 pts)
* [ ] **Consumo de API:** Manejo de peticiones vía Axios o Fetch centralizado (`src/services/api.js`).
* [ ] **Validaciones bajo Inputs:** Mensajes de error del backend (422) renderizados directamente bajo el `<input>` correspondiente (sin `alert()`).
* [ ] **Paginación Server-Side:** Paginación gestionada mediante parámetros `?page=X` consumidos de la API.
* [ ] **Filtros por API:** Buscador enviando `?search=termino` al backend en tiempo real.
* [ ] **Navbar con datos de Sesión:** Nombre, correo y avatar/icono visible con botón de Logout.
* [ ] **Modales de Confirmación:** Diálogos personalizados para acciones destructivas (sin `confirm()` o `alert()` nativos).
* [ ] **Responsividad & Estados:** Diseño adaptable (Mobile/Desktop) con spinners de carga (`loading states`) y manejo de caídas de red.

---

### 4. Usuarios y Niveles de Acceso (10 pts)
* [ ] **3 Niveles de Rol:** Administrador, Usuario Estándar/Cliente, y Rol Contextual (ej. Editor/Moderador).
* [ ] **Validación de Passwords:** Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial (validado en Form Request y en React).
* [ ] **Protección por Roles:** Middleware en Laravel (`role:x`) y componente `<ProtectedRoute />` en React.
* [ ] **Usuario Developer/Evaluación:** Credenciales fijas creadas vía Seeder y documentadas en el `README.md`.

---

### 5. Servicios de Comunicación (10 pts)
* [ ] **Correo Real (Postfix):** Configurado directamente en el VPS con registros SPF/DKIM activos.
* [ ] **SMS:** Integración funcional mediante API (ej. Twilio) gatillada por evento del sistema.
* [ ] **WhatsApp:** Integración funcional mediante API (Twilio / WhatsApp Cloud API) disparada por acción real.

---

### 6. Diseño en Figma (10 pts)
* [ ] **Prototipo Navegable:** Link activo incluido en el `README.md`.
* [ ] **Paleta de Colores & Logo:** Paleta justificada según teoría del color y logo original del equipo.
* [ ] **Fidelidad Visual:** UI en React consistente con el prototipo.

---

### 7. Versionamiento y GitHub (12 pts)
* [ ] **Repositorio Público:** Acceso abierto sin restricciones.
* [ ] **Commits Equitativos:** Historial con commits activos y mensajes descriptivos de **ambos integrantes**.
* [ ] **`README.md` Completo:** Instalación, credenciales, diagrama ER, URL de API, links de Figma y Projects.

---

### 8. GitHub Projects (12 pts)
* [ ] **Tablero Público:** Configurado como 'Public' en la configuración del proyecto.
* [ ] **Columnas Activas:** Backlog, To Do, In Progress, In Review, Done con tareas reales asignadas a ambos.

---

### 9. Pruebas con Bruno (6 pts)
* [ ] **Carpeta Versionada:** Colección guardada dentro del repositorio Git.
* [ ] **Endpoints Incluidos:** Login, obtención y uso de Token Bearer, y casos de prueba de error (`401`, `422`, `404`).

---

### 10. Despliegue en VPS (Requisito Crítico)
* [ ] **Producción en VPS:** Servido mediante Nginx como Proxy Reverso.
* [ ] **HTTPS / SSL:** Certificado emitido con Certbot / Let's Encrypt sobre dominio personal/DuckDNS.