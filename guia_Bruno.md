# Guía de Uso de Bruno API Client para CleverNote

Bruno es una alternativa rápida, ligera y de código abierto a Postman. En esta guía aprenderás cómo conectarte a la API de CleverNote desde Bruno para probar y administrar los registros de la base de datos (CRUD), y qué necesitas para poder borrar usuarios de prueba.

---

## 1. Configurar Bruno y el Entorno

Para no tener que escribir la URL completa en cada petición, configuraremos una variable de entorno.

1. **Descarga e instala Bruno:** Desde [usebruno.com](https://www.usebruno.com/).
2. **Crea la Colección:** Abre Bruno, clic en `Create Collection` -> Nombre: `CleverNote API`.
3. **Crea el Entorno:** 
   - Arriba a la derecha, haz clic en `No Environment` -> `Configure`.
   - Crea uno nuevo llamado `VPS Producción`.
   - Agrega la variable: `base_url` con el valor `https://clevernote.duckdns.org/api`.
   - Selecciona `VPS Producción` en el menú desplegable.

---

## 2. Autenticación (Paso Obligatorio)

Casi todas las rutas CRUD en Laravel están protegidas por Sanctum. Necesitas un Token.

1. Clic derecho en la colección -> `New Request`.
2. Name: **1. Login** | Method: `POST` | URL: `{{base_url}}/login`
3. Pestaña **Body** -> selecciona `JSON`:
   ```json
   {
     "email": "tu_correo@gmail.com",
     "password": "TuPassword123"
   }
   ```
4. Clic en **Send**. En la respuesta de abajo, copia el valor larguísimo de `access_token` (sin comillas).

> [!TIP]
> **¿Cómo usar el Token?** En todas las peticiones que verás a continuación, debes ir a la pestaña **Auth** de Bruno, seleccionar **Bearer Token** y pegar el token que acabas de copiar.

---

## 3. Guía Práctica de CRUD (Usando la tabla "Items")

Actualmente en tu API tienes programado el recurso `apiResource('items')`, el cual ya incluye automáticamente las 5 rutas CRUD estándar. Aquí tienes cómo probarlas todas:

### C - CREATE (Crear un registro)
1. Clic derecho -> `New Request`. Name: **Create Item** | Method: `POST` | URL: `{{base_url}}/items`
2. Pestaña **Auth** -> Pega tu Bearer Token.
3. Pestaña **Body** -> `JSON`:
   ```json
   {
     "name": "Mi primer documento",
     "description": "Este es el contenido de prueba."
   }
   ```
4. **Send**. Te devolverá un 201 Created con el ID del nuevo item (ej. `id: 1`).

### R - READ (Leer registros)
**Ver todos tus ítems:**
1. Method: `GET` | URL: `{{base_url}}/items`
2. Pestaña **Auth** -> Pega el token.
3. **Send**. Devuelve una lista (array) con todos los ítems.

**Ver un ítem en específico:**
1. Method: `GET` | URL: `{{base_url}}/items/1` *(El '1' es el ID del ítem)*
2. Pestaña **Auth** -> Pega el token.
3. **Send**. Devuelve solo la información de ese registro.

### U - UPDATE (Actualizar un registro)
1. Method: `PUT` (o `PATCH`) | URL: `{{base_url}}/items/1`
2. Pestaña **Auth** -> Pega el token.
3. Pestaña **Body** -> `JSON`:
   ```json
   {
     "name": "Documento Editado",
     "description": "Texto actualizado exitosamente."
   }
   ```
4. **Send**. Te devolverá un 200 OK con los nuevos datos.

### D - DELETE (Borrar un registro)
1. Method: `DELETE` | URL: `{{base_url}}/items/1`
2. Pestaña **Auth** -> Pega el token.
3. No necesita Body.
4. **Send**. Te devolverá un 200 OK confirmando que fue borrado. Si intentas hacer un GET al ID 1, ahora te dará 404 Not Found.

## 4. CRUD Completo de Usuarios

> [!TIP]
> ¡He creado el Controlador completo de Usuarios para ti! Ya puedes Listar, Ver, Actualizar y Borrar usuarios directamente desde Bruno, al igual que los ítems. Recuerda que no existe el método POST de usuarios aquí porque la creación está delegada a la ruta segura de `/register`.

**Paso A: Actualizar el VPS**
Entra por SSH a tu VPS y ejecuta:
```bash
cd /var/www/html/CleverNote
git pull origin main
```

**Paso B: Probar el CRUD en Bruno**

- **Leer todos los usuarios:** Method: `GET` | URL: `{{base_url}}/users`
- **Ver un usuario en específico:** Method: `GET` | URL: `{{base_url}}/users/5`
- **Actualizar nombre de un usuario:** Method: `PUT` | URL: `{{base_url}}/users/5` 
  *(Body JSON: `{"name": "Nombre Actualizado"}`)*
- **Borrar un usuario:** Method: `DELETE` | URL: `{{base_url}}/users/5` 

---

## 5. Borrado Manual Rápido (Consola MySQL)

Si te quedas bloqueado en el Login (por ejemplo, si el VPS te exige verificar el correo pero no te llega) y **no puedes obtener tu Token para usar la API**, la forma más rápida de borrar tu cuenta de prueba es directamente en la base de datos del VPS.

Abre la terminal SSH de tu VPS y ejecuta:

```bash
# Entrar a la base de datos (te pedirá la contraseña del VPS o MySQL)
sudo mysql -u root -p

# Seleccionar la base de datos
USE clevernote_db;

# Borrar el usuario de prueba (Cámbialo por tu correo real)
DELETE FROM users WHERE email = 'tu_correo_de_prueba@gmail.com';

# Salir
exit;
```

Al hacer esto, el correo quedará liberado inmediatamente y podrás registrarlo de nuevo.
