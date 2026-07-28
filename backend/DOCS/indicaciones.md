# Plan de Implementación de API REST (Laravel 12 + Sanctum)

Este documento centraliza las indicaciones paso a paso para la creación de la API. Está estructurado en fases para mantener un orden riguroso y facilitar el entendimiento.

---

## Fase 1: Configuración Inicial y Base de Datos
1. Configuración de variables de entorno `.env` (MySQL).
2. Instalación/publicación de Laravel Sanctum y configuración de `routes/api.php` mediante el comando de Laravel 12: `php artisan install:api`.
3. Migración inicial para usuarios y tokens: `php artisan migrate`.

## Fase 2: Autenticación con Laravel Sanctum
1. Creación del controlador de autenticación (`AuthController`).
2. Desarrollo del endpoint de Registro (`/api/register`) con validación de datos.
3. Desarrollo del endpoint de Login (`/api/login`) para expedir el Bearer Token.
4. Actualización del archivo `documentacion.md` explicando cómo funciona el modelo de autenticación y los tokens.

## Fase 3: Creación de la Entidad Principal (CRUD)
1. Definición de la entidad (por ejemplo, `Task` o `Item`).
2. Creación simultánea de Modelo, Migración y Controlador de API.
3. Configuración de la relación uno a muchos (Un usuario tiene muchas tareas).
4. Creación del API Resource para transformar las respuestas JSON de forma consistente.
5. Actualización de `documentacion.md` sobre API Resources.

## Fase 4: Desarrollo de Endpoints CRUD y Validaciones
1. Aplicación del middleware `auth:sanctum` a las rutas de la entidad.
2. Desarrollo de métodos: `index`, `store`, `show`, `update`, `destroy`.
3. Validaciones de Requests asegurando que las respuestas de error sean formato JSON (422 Unprocessable Entity).
4. Restricción de acceso: Un usuario solo podrá acceder, modificar o eliminar sus propios registros.

## Fase 5: Plan de Pruebas con Postman
1. Documentación de configuraciones necesarias (Variables de entorno, Headers).
2. Pruebas detalladas para registro, inicio de sesión y uso del token para el CRUD.
3. Ejemplos de Cuerpos JSON (Body) a enviar en cada petición.

## Fase 6: Guía de Despliegue en VPS (Nginx + MySQL)
1. Preparación del repositorio (clonado en el VPS).
2. Configuración de `.env` en producción.
3. Comandos vitales para Composer y configuraciones de permisos.
4. Instrucciones de configuración del virtual host en Nginx apuntando al directorio `public`.

---
> **Nota para el desarrollador:** Cada vez que culminemos una fase, te indicaré por aquí los comandos exactos de Git (`git add .`, `git commit -m "mensaje"`) que deberás ejecutar manualmente en tu terminal.