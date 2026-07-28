# API REST - Laravel 12 CRUD

Esta es una API RESTful desarrollada con Laravel 12 y asegurada mediante **Laravel Sanctum**. Provee un CRUD completo para una entidad (`Item`) y asegura que un usuario solo pueda manipular los recursos que le pertenecen.

**URL Base de Producción:** `http://andrescg.duckdns.org`

---

## Guía de Pruebas con Postman (Entorno de Producción VPS)

A continuación, se detallan las instrucciones para probar la API que ya se encuentra desplegada en el VPS usando Postman.

### 1. Configuración Global de Headers
Dado que es una API, Laravel espera recibir peticiones indicando explícitamente que desean interactuar con JSON. En cada petición que hagas en Postman, ve a la pestaña **Headers** y añade:
- **Key:** `Accept`
- **Value:** `application/json`

---

### 2. Autenticación

#### A. Registro de Usuario (Register)
- **Método:** `POST`
- **URL:** `http://andrescg.duckdns.org/api/register`
- **Body** (pestaña `Body` -> selecciona `raw` y formato `JSON`):
  ```json
  {
      "name": "Prueba User VPS",
      "email": "vps@example.com",
      "password": "password123"
  }
  ```
- **Respuesta:** Recibirás un HTTP 201 Created con los datos de tu nuevo usuario.

#### B. Inicio de Sesión (Login)
- **Método:** `POST`
- **URL:** `http://andrescg.duckdns.org/api/login`
- **Body** (`raw` -> `JSON`):
  ```json
  {
      "email": "vps@example.com",
      "password": "password123"
  }
  ```
- **Respuesta:** Recibirás un HTTP 200 OK devolviéndote el `access_token`. 
> ⚠️ **IMPORTANTE:** Copia el valor de `access_token` ya que es tu llave maestra para las demás peticiones protegidas.

---

### 3. Configurar el Token para el CRUD
Para las siguientes rutas de ítems, necesitas estar autenticado.
1. En tu petición de Postman, ve a la pestaña **Authorization**.
2. En el menú desplegable "Type", elige **Bearer Token**.
3. En el campo **Token**, pega el token generado en el paso del Login.

---

### 4. Endpoints del CRUD de Ítems

#### C. Crear un Ítem (Store)
- **Método:** `POST`
- **URL:** `http://andrescg.duckdns.org/api/items`
- **Autorización:** Bearer Token
- **Body** (`raw` -> `JSON`):
  ```json
  {
      "name": "Ítem en el VPS",
      "description": "Prueba de creación directa en producción"
  }
  ```
- **Respuesta:** HTTP 201 Created con tu nuevo ítem y su ID generado.

#### D. Listar tus Ítems (Index)
- **Método:** `GET`
- **URL:** `http://andrescg.duckdns.org/api/items`
- **Autorización:** Bearer Token
- **Respuesta:** HTTP 200 OK devolviendo una lista (array) con todos los ítems vinculados a tu cuenta.

#### E. Ver un Ítem Específico (Show)
- **Método:** `GET`
- **URL:** `http://andrescg.duckdns.org/api/items/{id}` *(ej. `http://andrescg.duckdns.org/api/items/1`)*
- **Autorización:** Bearer Token
- **Respuesta:** HTTP 200 OK con los datos del ítem solicitado.

#### F. Actualizar un Ítem (Update)
- **Método:** `PUT` (o `PATCH`)
- **URL:** `http://andrescg.duckdns.org/api/items/{id}`
- **Autorización:** Bearer Token
- **Body** (`raw` -> `JSON`):
  ```json
  {
      "name": "Nombre Modificado VPS"
  }
  ```
- **Respuesta:** HTTP 200 OK con la información actualizada.

#### G. Eliminar un Ítem (Destroy)
- **Método:** `DELETE`
- **URL:** `http://andrescg.duckdns.org/api/items/{id}`
- **Autorización:** Bearer Token
- **Respuesta:** HTTP 200 OK confirmando la eliminación del recurso.
