# 📑 Documentación de Errores Git y Soluciones - CleverNote

Este documento registra los problemas técnicos ocurridos durante la reorganización del repositorio, sus causas raíz y las soluciones aplicadas para resolverlos sin pérdida de código.

---

## 1. Error de Repositorios Git Anidados (Embedded Git Repository)

### 📌 Surgimiento
Al ejecutar el comando `git add .` en la carpeta contenedora inicial `PR_FINAL`, Git devolvió el siguiente aviso:

```text
warning: adding embedded git repository: PROYECTO-FINAL-PROGRAMACI-N-WEB
hint: You've added another git repository inside your current repository.
```

### 🔍 Causa Técnica
Se ejecutó un comando `git init` en la carpeta raíz `PR_FINAL` y posteriormente se realizó un `git clone` del repositorio de GitHub dentro de esa misma carpeta. Esto generó **dos carpetas `.git` anidadas** (una externa y una interna). Git interpretó la carpeta clonada como un submódulo no configurado.

### 🛠️ Solución Aplicada
1. Se desvinculó el índice en el repositorio externo: `git rm --cached -f PROYECTO-FINAL-PROGRAMACI-N-WEB`.
2. Se eliminó la carpeta `.git` accidental de la raíz contenedora: `Remove-Item -Recurse -Force .git`.
3. Se ingresó directamente a la carpeta del proyecto clonado `PROYECTO-FINAL-PROGRAMACI-N-WEB` para trabajar sobre el repositorio Git oficial conectado a GitHub.

---

## 2. Bloqueo de Directorio en Windows durante Rebase (`Deletion of directory failed`)

### 📌 Surgimiento
Al intentar sincronizar los cambios de GitHub con el comando `git pull --rebase origin main`, la terminal se congeló en un bucle interactivo mostrando:

```text
Deletion of directory 'frontend/src/components' failed. Should I try again? (y/n)
Deletion of directory '.git/rebase-merge' failed. Should I try again? (y/n)
```

### 🔍 Causa Técnica
En sistemas operativos Windows, los indexadores del editor de código (VS Code / Antigravity), antivirus o exploradores de archivos mantienen **bloqueos de entrada/salida (File Handles)** sobre directorios vacíos o temporales mientras Git intenta moverlos o eliminarlos durante una reorganización de árbol de archivos (`git mv`).

### 🛠️ Solución Aplicada
1. Se forzó la cancelación del rebase bloqueado: `git rebase --abort`.
2. Se eliminó manualmente el directorio de estado temporal bloqueado: `Remove-Item -Recurse -Force .git/rebase-merge -ErrorAction SilentlyContinue`.
3. Se ejecutó una fusión estándar sin rebase para integrar las diferencias remotas y locales de forma segura:
   ```powershell
   git pull origin main --no-rebase --allow-unrelated-histories
   git push origin main
   ```

---

## 3. Excepción de Respuesta No Válida en API (`Unexpected token '<'` / `El servidor backend devolvió una respuesta inesperada`)

### 📌 Surgimiento
Al interactuar con los formularios de Login o Registro en el cliente React desplegado en el VPS, la consola o la interfaz devolvía los siguientes errores:
- `SyntaxError: Unexpected token '<', "<html> <h"... is not valid JSON`
- `El servidor backend devolvió una respuesta inesperada`

### 🔍 Causa Técnica
1. **Captura de Rutas por Middleware Web / Inertia.js**: Las rutas de autenticación web de Inertia (`routes/auth.php`) interceptaban las peticiones `POST /register` y `POST /login`, intentando renderizar vistas `.blade.php` e indicar la falta del archivo `manifest.json`.
2. **Reescritura de Nginx que recortaba el prefijo `/api`**: La regla `rewrite /api/(.*)$ /api/index.php?/$1 last;` recortaba `/api`, por lo que Laravel no encontraba la ruta registrada en `routes/api.php` y caía en el fallback HTML `404 Not Found` del frontend (`index.html`).
3. **Falta de Parámetro `password_confirmation` en Registro**: Laravel aplica la regla de validación `'confirmed'`, la cual exige recibir la confirmación de la contraseña bajo la clave `password_confirmation` en el payload JSON.
4. **Validación de Token CSRF en Peticiones API**: Laravel 11 aplica validación de tokens CSRF a nivel web por defecto. Al enviar solicitudes stateless desde React sin dicho token, se generaba la excepción `CSRF token mismatch.`.

### 🛠️ Soluciones Aplicadas

1. **Ruteo de Nginx con Prioridad Absoluta (`location ^~ /api`)**:
   Se reestructuró la configuración de Nginx en el VPS para preservar la ruta `/api` intacta y dirigirla a FastCGI sin recortar prefijos:
   ```nginx
   location ^~ /api {
       alias /var/www/html/CleverNote/backend/public;
       try_files $uri $uri/ /api/index.php?$query_string;

       location ~ \.php$ {
           include fastcgi_params;
           fastcgi_param SCRIPT_FILENAME /var/www/html/CleverNote/backend/public/index.php;
           fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
       }
   }
   ```

2. **Desacoplamiento de Rutas Web en Laravel (`web.php` y `api.php`)**:
   - Se comentó `require __DIR__.'/auth.php';` en `routes/web.php` para evitar que controladores de Inertia intercepten las solicitudes de la API.
   - Se asignaron nombres explícitos `->name('register')` y `->name('login')` en `routes/api.php`.

3. **Exclusión de CSRF para la API (`bootstrap/app.php`)**:
   Se exentaron las rutas de la API de la verificación CSRF:
   ```php
   $middleware->validateCsrfTokens(except: [
       'api/*',
       'register',
       'login',
       'api/register',
       'api/login',
   ]);
   ```

4. **Payload Completo y Manejo Seguro de Respuestas en React (`RegisterView.jsx` & `LoginView.jsx`)**:
   - Se incluyó `password_confirmation: formData.confirmPassword` en la petición HTTP POST.
   - Se reemplazó `response.json()` directo por `response.text()` + `JSON.parse()` en un bloque `try/catch` para capturar errores sin romper la interfaz y registrar el código HTTP correspondiente.

---

## 💡 Recomendación sobre `.gitignore`

* **Si es documentación del proyecto / bitácora de equipo**: Se recomienda **MANTENER EL ARCHIVO RASTREADO** (sin añadir a `.gitignore`), ya que sirve como base de conocimientos compartida para que el otro desarrollador (Moisés) conozca cómo resolver estos bloqueos en Windows.
* **Si es una nota personal temporal**: Se puede añadir `error_doc.md` a `.gitignore` agregando la línea `error_doc.md` al final de ese archivo.
