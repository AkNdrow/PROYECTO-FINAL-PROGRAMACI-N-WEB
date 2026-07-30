# Guía General de Autenticación y Seguridad

Esta guía documenta los flujos de seguridad que protegen el registro y acceso a **CleverNote**. Nuestro sistema implementa una **doble verificación obligatoria** al momento de crear una cuenta: Verificación por Correo Electrónico y Verificación por Teléfono (vía Twilio SMS/WhatsApp).

---

## 1. El Flujo de Registro (User Flow Completo)

Para garantizar que los usuarios proporcionen datos de contacto reales, el ciclo de vida del registro es el siguiente:

1. **Registro Inicial:** El usuario ingresa sus datos (Nombre, Email, Teléfono obligatorio, Contraseña) en el formulario de `/register`.
2. **Generación de Códigos y Bloqueo:** El sistema registra al usuario pero lo bloquea (`email_verified_at = null` y `phone_verified_at = null`). Simultáneamente:
   - Dispara el envío de un correo con un enlace criptográfico único.
   - Genera un código OTP de 6 dígitos aleatorio y lo envía vía Twilio (por SMS y WhatsApp) al celular proporcionado.
3. **Verificación de Teléfono (Paso 1):** El frontend cambia inmediatamente a la pantalla de verificación OTP. El usuario debe ingresar el código de 6 dígitos que recibió en su teléfono.
4. **Intento de Acceso Prematuro (Denegado):** Si el usuario intenta hacer Login sin haber verificado alguna de sus dos vías de contacto, la API lo rechazará.
5. **Verificación de Correo (Paso 2):** El usuario debe abrir su bandeja de entrada, buscar el correo enviado por CleverNote y hacer clic en el botón de confirmación. Esto actualizará su `email_verified_at`.
6. **Acceso Concedido:** Solo cuando el usuario tiene tanto el correo como el teléfono verificados, podrá iniciar sesión exitosamente y acceder al Dashboard.

---

## 2. Verificación de Correo Electrónico (SMTP)

### Configuración Necesaria (.env)
Para que el servidor despache los correos, usa tu cuenta de Google con una Contraseña de Aplicación:

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

### Solución de Problemas (Correo)
- **El correo no llega:** Revisa la carpeta de Spam. Verifica con `tail -f storage/logs/laravel.log` si hay errores de conexión (revisa el puerto o contraseña de aplicación).
- **El enlace da error "403 Invalid signature":** El enlace caduca a los 60 minutos. Si el usuario tarda demasiado, deberá solicitar uno nuevo.

---

## 3. Verificación de Teléfono (Twilio SMS/WhatsApp)

### Configuración Necesaria (.env)
Esta integración utiliza las credenciales de Twilio. Para las cuentas de prueba (Trial), Twilio exige enviar los mensajes a un número verificado previamente en la consola, por lo que usamos `TWILIO_DESTINATION_PHONE` para las pruebas:

```env
TWILIO_SID="tu_sid_aqui"
TWILIO_TOKEN="tu_token_aqui"
TWILIO_FROM_NUMBER="+18156654511"
TWILIO_WHATSAPP_FROM="+14155238886"
TWILIO_DESTINATION_PHONE="+52..." # Solo para desarrollo/trial
```

### Funcionamiento Técnico (Backend)
1. El `AuthController@register` genera un OTP de 6 dígitos usando `rand(100000, 999999)`.
2. Llama al `TwilioService` ejecutando `sendSMS()` y `sendWhatsApp()` al mismo tiempo.
3. Guarda el OTP temporalmente en la tabla `users` (columna `otp_code`).
4. Cuando el usuario envía el código a través de React, el endpoint `/api/verify-phone` compara los datos. Si coincide, vacía la columna `otp_code` (para que no se reuse) y marca la fecha en `phone_verified_at`.

### Solución de Problemas (Twilio)
- **Duplicate entry '...' for key 'users_phone_unique':** Ocurre si la migración inicial trató de forzar la columna `phone` en usuarios ya existentes. Asegúrate de que tu migración tenga `->nullable()` o corre un `migrate:fresh`.
- **No llega el WhatsApp:** Verifica que hayas enviado el mensaje de activación (`join [palabra]`) al Sandbox de Twilio desde tu celular personal.
- **Error 500 al enviar:** Confirma que las credenciales `.env` en producción coincidan y limpia la caché (`php artisan optimize:clear`).
