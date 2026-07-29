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

---

## 4. ¿Cómo Borrar USUARIOS (Correos de prueba)?

> [!WARNING]
> En la configuración actual de tu código (`api.php`), **no existe una ruta para borrar usuarios** (`DELETE /api/users/{id}`). Laravel Breeze/Sanctum protege el modelo User fuertemente por defecto.

Si deseas borrar usuarios usando Bruno, primero debes crear la ruta y el controlador en tu código fuente:

**Paso A: En el código (Laravel)**
En tu archivo `api.php`, agrega:
```php
Route::middleware('auth:sanctum')->delete('/users/{id}', function ($id) {
    // Nota de seguridad: En el futuro deberías verificar que solo un admin pueda hacer esto.
    App\Models\User::destroy($id);
    return response()->json(['message' => 'Usuario eliminado']);
});
```
Sube los cambios a GitHub y haz `git pull` en el VPS.

**Paso B: En Bruno (Eliminar el correo)**
1. Method: `DELETE` | URL: `{{base_url}}/users/5` *(Donde 5 es el ID del usuario)*
2. Pestaña **Auth** -> Bearer Token.
3. **Send**. El usuario de prueba desaparecerá y podrás volver a registrar ese correo desde cero en la aplicación de React.
