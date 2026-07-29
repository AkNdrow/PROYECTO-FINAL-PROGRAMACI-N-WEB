# Guía de Autenticación por Correo Electrónico (Email Verification)

Esta guía documenta el flujo de trabajo, la configuración y el proceso de pruebas para el sistema de Verificación de Correo Electrónico integrado en **CleverNote**.

---

## 1. ¿Cómo funciona el flujo? (User Flow)

La verificación de correo actúa como una capa de seguridad obligatoria entre el **Registro** y el **Primer Inicio de Sesión**. El objetivo es garantizar que todos los usuarios del sistema tengan cuentas de correo reales y accesibles.

El ciclo de vida es el siguiente:
1. **Registro:** El usuario ingresa sus datos (Nombre, Email, Contraseña) en el formulario de `/register`.
2. **Bloqueo Preventivo:** En lugar de darle acceso inmediato al Dashboard, la aplicación le muestra un aviso pidiéndole que revise su bandeja de entrada. Su cuenta en la base de datos queda marcada con `email_verified_at = null`.
3. **Envío del Email:** El backend (Laravel) detecta el registro y envía automáticamente un correo electrónico seguro con un botón y un enlace criptográfico único.
4. **Intento de Acceso (Denegado):** Si el usuario intenta hacer Login antes de hacer clic en el enlace, la API rechaza la petición con el mensaje: *"Debes confirmar tu correo electrónico"*.
5. **Confirmación:** El usuario hace clic en el enlace de su correo. La API valida el código criptográfico, actualiza la fecha en `email_verified_at` y redirige al usuario de vuelta a la pantalla de Login con el parámetro `?verified=1`.
6. **Acceso Concedido:** La interfaz muestra un banner verde de éxito y, al ingresar sus credenciales, el usuario finalmente accede al sistema.

---

## 2. Configuración Necesaria en el VPS (SMTP)

Para que el servidor pueda despachar los correos hacia bandejas como Gmail, Outlook o Yahoo, se debe usar un servidor SMTP.

Debes editar el archivo `/var/www/html/CleverNote/backend/.env` con las credenciales de tu cuenta (`clever.note.auth@gmail.com`). **Nunca uses tu contraseña principal**, debes generar una **Contraseña de Aplicación** (App Password de 16 caracteres) desde los ajustes de seguridad de tu cuenta de Google.

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=clever.note.auth@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
MAIL_ENCRYPTION=smtps
MAIL_FROM_ADDRESS="clever.note.auth@gmail.com"
MAIL_FROM_NAME="CleverNote"
```

Después de guardar el `.env`, es vital limpiar la caché de Laravel:
```bash
php artisan optimize:clear
systemctl restart php8.3-fpm
```

---

## 3. Guía de Pruebas (Paso a Paso)

Para asegurarte de que todo funciona correctamente, realiza la siguiente prueba integral de extremo a extremo (E2E):

### Paso 1: Creación de Cuenta
1. Entra a la aplicación web de CleverNote y ve a la vista de **Registro**.
2. Ingresa datos de prueba asegurándote de usar un correo electrónico real al que tengas acceso inmediato (por ejemplo, tu cuenta personal).
3. Haz clic en "Crear cuenta".
4. **Resultado esperado:** Debes ser redirigido a la pantalla de Login y visualizar una alerta en pantalla (o un texto) que indica: *"¡Cuenta creada con éxito! Se ha enviado un enlace a tu correo..."*

### Paso 2: Prueba de Bloqueo (Login Fallido)
1. Estando en la pantalla de Login, ingresa el correo y la contraseña que acabas de registrar.
2. Haz clic en "Iniciar Sesión".
3. **Resultado esperado:** El sistema debe rechazar el acceso y mostrar un mensaje de error en letras rojas indicando que primero debes confirmar tu correo. (No debes poder acceder al Dashboard).

### Paso 3: Verificación vía Email
1. Abre la bandeja de entrada del correo real que utilizaste en el Paso 1.
2. Busca un correo con el asunto **"Verify Email Address"** (Enviado por CleverNote). Si no está en la bandeja principal, revisa la carpeta de *Spam* o *Correo no deseado*.
3. Abre el correo y haz clic en el botón de verificación (Verify Email Address).
4. **Resultado esperado:** Se abrirá una nueva pestaña en tu navegador que apuntará brevemente al backend de Laravel y te redirigirá instantáneamente a: `https://clevernote.duckdns.org/login?verified=1`.

### Paso 4: Login Exitoso
1. Al ser redirigido de vuelta al frontend, deberás ver un **banner verde** en la pantalla de Login indicando: *"¡Correo verificado con éxito! Ya puedes iniciar sesión."*
2. Ingresa tus credenciales nuevamente.
3. Haz clic en "Iniciar Sesión".
4. **Resultado esperado:** Ingreso exitoso al Dashboard de la aplicación.

---

## 4. Solución de Problemas Comunes (Troubleshooting)

- **El correo no llega:** Revisa la carpeta de Spam. Si estás en el VPS, ejecuta `tail -f /var/www/html/CleverNote/backend/storage/logs/laravel.log` e intenta registrarte. Si ves un error relacionado con `Connection refused` o `Authentication failed`, las credenciales SMTP en el `.env` son incorrectas.
- **El enlace me da error "403 Invalid signature":** El enlace de Laravel caduca (por defecto a los 60 minutos). Si haces clic en un enlace viejo, será rechazado. Deberás solicitar uno nuevo.
- **Error 500 al registrarse:** Ocurre comúnmente si Laravel intenta enviar el correo pero no puede conectarse al servidor SMTP. Asegúrate de haber ejecutado `php artisan optimize:clear`.
