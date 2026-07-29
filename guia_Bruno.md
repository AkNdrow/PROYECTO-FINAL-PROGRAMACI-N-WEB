# Guía de Uso de Bruno API Client para CleverNote

Bruno es una alternativa rápida, ligera y de código abierto a Postman. En esta guía aprenderás cómo conectarte a la API de CleverNote desde Bruno para administrar los usuarios (CRUD), especialmente para **eliminar cuentas de prueba** y así poder volver a registrar el mismo correo durante tus validaciones de Email.

---

## 1. Concepto Básico
Tu servidor backend (Laravel) expone la base de datos a través de rutas (Endpoints). Usando Bruno, nos convertiremos en un "cliente" (como si fuéramos la aplicación React, pero en texto plano) para mandarle órdenes directas a la base de datos de tu VPS.

---

## 2. Configurar la Colección en Bruno

1. **Descarga e instala Bruno:** Si no lo tienes, descárgalo desde [usebruno.com](https://www.usebruno.com/).
2. **Crea una nueva Colección:**
   - Abre Bruno y haz clic en `Create Collection`.
   - Nombre: `CleverNote API`.
   - Ubicación: Elige una carpeta en tu computadora.
3. **Configura la Variable de Entorno (URL):**
   - En la esquina superior derecha de Bruno, haz clic en el botón de entornos (dice `No Environment`).
   - Crea un nuevo entorno llamado `VPS Producción`.
   - Añade una variable llamada `base_url` con el valor `https://clevernote.duckdns.org/api`.
   - Guarda y selecciona el entorno `VPS Producción`.

---

## 3. Crear Peticiones (CRUD de Usuarios)

A continuación, crearemos las peticiones necesarias para administrar usuarios. 

> [!WARNING]
> Como CleverNote está protegido por Sanctum, para poder Eliminar (DELETE) o Ver (GET) usuarios directamente por API, necesitaríamos tener permisos administrativos. Sin embargo, si lo que quieres es **eliminar rápidamente cuentas de prueba sin programar rutas administrativas seguras en Laravel**, es más rápido y seguro hacerlo mediante un comando en el servidor (ver sección 4).
> 
> Pero si deseas programarlo vía API, aquí están las configuraciones teóricas en Bruno:

### A. Iniciar Sesión (POST Login)
1. Clic derecho en la colección -> `New Request`.
2. Name: `Login` | Method: `POST` | URL: `{{base_url}}/login`
3. Ve a la pestaña **Body** -> selecciona `JSON`.
4. Escribe:
   ```json
   {
     "email": "tu@correo.com",
     "password": "TuPassword123"
   }
   ```
5. Haz clic en **Send**. En la respuesta, copia el `access_token` que te devuelva (lo usarás en las siguientes peticiones).

### B. Obtener Perfil del Usuario (GET User)
1. Clic derecho -> `New Request`.
2. Name: `Get User` | Method: `GET` | URL: `{{base_url}}/user`
3. Ve a la pestaña **Auth** -> selecciona `Bearer Token`.
4. Pega el Token que copiaste en el paso anterior.
5. Clic en **Send** para ver tus datos.

---

## 4. Alternativa Más Rápida: Borrar Registros desde la Consola (VPS)

Si tu único objetivo es **borrar los correos de prueba** para volver a usarlos sin tener que construir rutas DELETE en tu API y exponer la seguridad, lo más rápido es borrarlo directamente en MySQL dentro de tu VPS.

Abre la terminal SSH de tu VPS y ejecuta:

```bash
# Entrar a la base de datos
sudo mysql -u root -p

# Seleccionar la base de datos
USE clevernote_db;

# Borrar el usuario de prueba (Cámbialo por el correo que usaste)
DELETE FROM users WHERE email = 'tu_correo_de_prueba@gmail.com';

# Salir
exit;
```

Al hacer este `DELETE` directamente en la base de datos, el correo quedará liberado inmediatamente y podrás volver a intentar registrarlo desde la interfaz de React.
