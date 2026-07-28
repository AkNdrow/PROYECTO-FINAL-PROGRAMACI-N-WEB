# Plan de Pruebas con Postman

En este documento se detallan las instrucciones para probar la API usando Postman. Asegúrate de tener tu servidor local corriendo (por ejemplo con `php artisan serve` en `http://localhost:8000`, o si usas XAMPP apuntando a la carpeta public, usa la URL correspondiente como `http://localhost/Laravel/api-CRUD/public/api/...`).

## 1. Configuración de Headers (Para todas las peticiones)

Laravel espera recibir información en formato JSON. En Postman, para cada request que hagas, ve a la pestaña **Headers** y añade:

- **Key:** `Accept`
- **Value:** `application/json`
*(Esto asegura que las validaciones fallen con un JSON 422 en vez de redirigir).*

---

## 2. Autenticación

### A. Registro de Usuario

- **Método:** `POST`
- **URL:** `/api/register`
- **Body** (selecciona `raw` y luego `JSON`):

  ```json
  {
      "name": "Prueba User",
      "email": "prueba@example.com",
      "password": "password123"
  }
  ```

- **Respuesta esperada:** 201 Created con el objeto del usuario.

### B. Iniciar Sesión (Login)

- **Método:** `POST`
- **URL:** `/api/login`
- **Body** (raw -> JSON):

  ```json
  {
      "email": "prueba@example.com",
      "password": "password123"
  }
  ```

- **Respuesta esperada:** 200 OK con un `access_token`.

> **IMPORTANTE:** Copia ese `access_token` generado porque lo necesitarás para las siguientes peticiones.

---

## 3. Configuración del Token en Postman

Para los endpoints protegidos (CRUD de Items):

1. En Postman, ve a la pestaña **Authorization**.
2. Selecciona el tipo **Bearer Token**.
3. En la caja de texto **Token**, pega el `access_token` que obtuviste en el Login.

---

## 4. Endpoints CRUD de Items

### C. Crear un Ítem (Store)

- **Método:** `POST`
- **URL:** `/api/items`
- **Autorización:** Bearer Token
- **Body** (raw -> JSON):

  ```json
  {
      "name": "Mi primer item",
      "description": "Esta es la descripción de prueba"
  }
  ```

- **Respuesta esperada:** 201 Created con los datos del ítem y su `id`.

### D. Listar Ítems (Index)

- **Método:** `GET`
- **URL:** `/api/items`
- **Autorización:** Bearer Token
- **Respuesta esperada:** 200 OK con un array de los ítems que le pertenecen al usuario.

### E. Ver un Ítem Específico (Show)

- **Método:** `GET`
- **URL:** `/api/items/{id}` *(reemplaza {id} por un ID válido, ej: `/api/items/1`)*
- **Autorización:** Bearer Token
- **Respuesta esperada:** 200 OK con los datos de un solo ítem. (Si intentas poner un ID de otro usuario, debe dar 403 No autorizado).

### F. Actualizar un Ítem (Update)

- **Método:** `PUT` (o `PATCH`)
- **URL:** `/api/items/{id}`
- **Autorización:** Bearer Token
- **Body** (raw -> JSON):

  ```json
  {
      "name": "Nombre actualizado"
  }
  ```

- **Respuesta esperada:** 200 OK con los datos actualizados.

### G. Eliminar un Ítem (Destroy)

- **Método:** `DELETE`
- **URL:** `/api/items/{id}`
- **Autorización:** Bearer Token
- **Respuesta esperada:** 200 OK con el mensaje "Ítem eliminado correctamente".

---

## 5. Pruebas en el Servidor VPS (Producción)

Para ejecutar estas mismas pruebas contra tu API real en producción (en el VPS), **lo único que cambia es la URL base**.

Los métodos (`GET`, `POST`, etc.), los Headers (`Accept: application/json`), el formato del Body y la Autorización (`Bearer Token`) siguen siendo exactamente los mismos.

Solo debes reemplazar el dominio de desarrollo por el dominio de tu servidor. Por ejemplo:

- De: `http://localhost:8000/api/register`
- A: `http://andrescg.duckdns.org/api/register`

Aplica esto para todos los endpoints (`/api/login`, `/api/items`, etc.) y Postman se conectará directamente a tu entorno de producción en el VPS.
