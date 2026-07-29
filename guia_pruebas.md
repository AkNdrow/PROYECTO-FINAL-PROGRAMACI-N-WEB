# Guía General de Pruebas (Fase 1 a 3)

Esta guía te servirá para comprobar paso a paso y de manera visual que todo lo que hemos construido hasta ahora (Migraciones, Seguridad, Roles, Twilio y API Resources) funciona a la perfección.

## Preparación Previa
Asegúrate de que en tu VPS:
1. Tienes la base de datos recién migrada y "seedeada" (`php artisan migrate:fresh --seed`).
2. Tienes el archivo `.env` configurado correctamente con las credenciales de Twilio.
3. El código está actualizado (`git pull origin main`).
4. Tienes la colección de peticiones abierta en **Bruno** apuntando a tu VPS (`https://tu-dominio.com/api/...`).

---

## 🏗️ Prueba 1: Semillas (Seeders) y Base de Datos
**Objetivo:** Verificar que la base de datos no está vacía y cumple con la rúbrica (15 usuarios, 15 documentos, 15 etiquetas).

**Pasos:**
1. Entra a tu VPS por SSH.
2. Abre la consola de MySQL: `sudo mysql -u root -p` y usa la base de datos `USE clevernote_db;`
3. Ejecuta los siguientes comandos y comprueba que todos devuelvan un número mayor o igual a 15:
   * `SELECT COUNT(*) FROM users;`
   * `SELECT COUNT(*) FROM documents;`
   * `SELECT COUNT(*) FROM tags;`

---

## 🔐 Prueba 2: Seguridad de Contraseñas (Form Requests)
**Objetivo:** Verificar que el sistema rechaza contraseñas débiles.

**Pasos:**
1. Ve a Bruno -> Petición **POST Register** (`/api/register`).
2. En el body, intenta registrar a un usuario con datos falsos pero con la contraseña `12345678`.
3. Haz clic en **Send**.
4. **Resultado esperado:** La API devolverá un error `422 Unprocessable Entity` diciendo que la contraseña debe contener al menos una letra mayúscula, un número y un símbolo.
5. Ahora cambia la contraseña a `SuperSeguro123!` y dale a Send. 
6. **Resultado esperado:** Código `201 Created` y el usuario se crea.

---

## 👮 Prueba 3: Middleware de Roles (RBAC)
**Objetivo:** Comprobar que un Cliente no puede ver ni gestionar a otros usuarios, pero el Administrador sí.

**Pasos (Cliente):**
1. Ve a Bruno -> Petición **POST Login** (`/api/login`).
2. Inicia sesión con el usuario que acabas de crear (que automáticamente nace como Cliente/Rol 2).
3. Copia el token que te devuelve.
4. Ve a la petición **GET Users** (`/api/users`), pega el token en la pestaña Auth (Bearer Token) y dale a Send.
5. **Resultado esperado:** Error `403 Forbidden` con el mensaje: "Acceso denegado. No tienes los permisos necesarios..."

**Pasos (Administrador):**
1. Ve a Bruno -> Petición **POST Login** e inicia sesión con el admin (`admin@clevernote.com` / `AdminClever1!`).
2. Copia su token.
3. Ve de nuevo a **GET Users**, pega el nuevo token y dale a Send.
4. **Resultado esperado:** Código `200 OK` y verás una hermosa lista JSON con los 15 usuarios que se crearon en las semillas.

---

## 📦 Prueba 4: API Resources (Serialización JSON)
**Objetivo:** Verificar que no estamos exponiendo la base de datos cruda y que el JSON está formateado en español.

**Pasos:**
1. Con tu token de Administrador, lanza la petición **GET Documents** (`/api/documents`). *(Si no tienes la petición en Bruno, créala apuntando a `GET /api/documents` y pásale el token del admin).*
2. Observa el JSON de respuesta.
3. **Resultado esperado:** En lugar de ver campos en inglés crudos como `user_id` o `created_at`, verás un formato limpio en español como `titulo`, `autor` (nombre del autor, no el ID numérico), `etiquetas` (lista de nombres, no tablas pivot) y `fecha_creacion`.

---

## 📱 Prueba 5: Integración de Twilio (SMS y WhatsApp)
**Objetivo:** Comprobar la conexión con la API de Twilio ante un evento real del sistema.

**Pasos:**
1. Asegúrate de tener tu número de teléfono verificado en la consola de Twilio y guardado en tu `.env` del VPS.
2. Ve a Bruno -> Petición **POST Items** (o POST Documents). `POST /api/documents`
3. Usa tu token (puede ser el de Admin o Cliente) en la pestaña Auth.
4. En el body JSON envía:
   ```json
   {
     "title": "Documento de Prueba Twilio",
     "content": "Probando notificaciones de CleverNote",
     "type": "privado",
     "status": "borrador"
   }
   ```
5. Dale a **Send**.
6. **Resultado esperado:** Bruno devolverá un código `201 Created` y casi de inmediato **tu celular personal sonará** con un SMS y un WhatsApp diciendo: *"CleverNote: Has creado un nuevo documento 'Documento de Prueba Twilio'."*
