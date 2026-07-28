# Documentación de la API (Laravel 12 REST API)

Este documento contiene las explicaciones técnicas y decisiones arquitectónicas de las herramientas utilizadas para construir esta API. Su objetivo es mantener la simplicidad y asegurar la comprensión de cada componente de Laravel.

---

## 1. Introducción
El proyecto es una API RESTful construida con Laravel 12. Sigue un enfoque simple (sin over-engineering) donde las rutas están definidas exclusivamente en `routes/api.php` y se comunica mediante formato JSON.

*(Este archivo se irá actualizando a medida que avancemos por las fases del plan de implementación).*

## 2. Autenticación con Laravel Sanctum
Laravel Sanctum es un paquete oficial muy liviano que proporciona un sistema de autenticación sencillo para SPAs (Single Page Applications) o APIs simples.

**¿Por qué Sanctum y no JWT u OAuth (Passport)?**
Sanctum es mucho más simple de configurar, no requiere claves de encriptación complejas y en una API básica cumple perfectamente almacenando los tokens (`plainTextToken`) que luego verifica a través del Header `Authorization: Bearer <token>`.

**Implementación de Tokens:**
- **Modelo de Usuario:** Se debe añadir el trait `HasApiTokens` a la clase `User`. Este trait es el encargado de brindarnos el método `createToken()`.
- **Registro:** Recibe los datos, los valida (usando la función `validate()`), guarda el usuario en la BD encriptando el password mediante `Hash::make()` y retorna el usuario registrado en formato JSON.
- **Login:** Busca al usuario, verifica la contraseña y en caso de éxito, ejecuta `$user->createToken('auth_token')->plainTextToken`. Este token es el que entregaremos en nuestras peticiones subsiguientes.

## 3. Entidades y API Resources
Para el CRUD, hemos creado una entidad de ejemplo llamada `Item`. Esta entidad cuenta con su modelo, migración y un controlador.

**Modelo y Relaciones:**
En Laravel, las tablas relacionales se expresan en los Modelos. 
- En el modelo `Item` establecimos la relación `user()` (`belongsTo`), indicando que un Item le pertenece a un Usuario.
- En el modelo `User` establecimos la relación `items()` (`hasMany`), indicando que un Usuario puede tener muchos Items.

**API Resources (JsonResource):**
Cuando retornamos un Modelo directamente desde el controlador, Laravel lo convierte a JSON exponiendo todas sus columnas. Los **API Resources** sirven como una "capa de transformación" para formatear cómo queremos que se devuelvan los datos. 
- En el archivo `ItemResource` hemos definido explícitamente qué campos queremos mostrar (`id`, `name`, `description`, `user_id` y fechas formateadas). Esto nos permite ocultar columnas sensibles en el futuro o cambiar nombres de variables en la respuesta JSON sin afectar la estructura de la base de datos.

## 4. Endpoints CRUD y Validaciones
Los endpoints de nuestra API han sido desarrollados en el `ItemController` y protegidos.

**Protección y Rutas:**
- Usando `Route::apiResource('items', ItemController::class);` bajo el middleware `auth:sanctum` nos aseguramos de que *cualquier* petición a `/api/items` requiera obligatoriamente un token de autorización.

**Lógica de Controlador y Autorización:**
- **index / store:** Hacen uso de `$request->user()->items()` para garantizar que un usuario sólo liste sus propios ítems, y que al crear uno, automáticamente se asigne su `user_id`.
- **show / update / destroy:** Antes de retornar o modificar, se verifica: `if ($request->user()->id !== $item->user_id)`. Esto previene que un usuario con un token válido pueda modificar o eliminar el ítem de otro usuario (retornando un error 403 Forbidden).

**Validaciones Automáticas:**
- Laravel maneja el método `$request->validate()` inteligentemente. Al estar en el contexto de una API (debido al header `Accept: application/json` que debe enviar el cliente), si una validación falla (como un nombre vacío), Laravel *automáticamente* detiene el controlador y devuelve un HTTP 422 Unprocessable Entity con la lista JSON de errores. No hace falta hacer `try-catch` manualmente para los errores de validación.
