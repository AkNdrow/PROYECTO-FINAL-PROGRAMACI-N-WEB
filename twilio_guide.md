# Guía de Integración con Twilio (SMS y WhatsApp)

De acuerdo a la rúbrica, CleverNote debe enviar notificaciones por SMS y WhatsApp ante una "acción real del sistema". 

## 1. ¿Cómo obtener tus credenciales (Tokens) en Twilio?

Como ya tienes una cuenta en Twilio, el proceso para obtener las claves de API es sencillo:

1. **Inicia Sesión** en tu consola de Twilio: [console.twilio.com](https://console.twilio.com/).
2. **Ubica el "Account Info" (Información de la Cuenta):** 
   En la pantalla principal (Dashboard), baja un poco hasta encontrar la sección **Account Info**.
3. **Copia las 3 claves esenciales:**
   *   **Account SID:** Es un código largo que empieza con `AC...` (Este es tu usuario).
   *   **Auth Token:** Es una cadena secreta oculta con asteriscos. Dale al botón de copiar o mostrar (Esta es tu contraseña).
   *   **My Twilio phone number:** Es el número de teléfono virtual que Twilio te asignó al registrarte (ej. `+1 234 567 8900`). Desde este número saldrán los SMS.

### Para habilitar WhatsApp (Sandbox)
Como no tenemos una cuenta comercial de Meta verificada, usaremos el **Twilio Sandbox for WhatsApp**, que es perfecto para proyectos universitarios.

1. En el menú de la izquierda de Twilio, ve a **Messaging** > **Try it out** > **Send a WhatsApp message**.
2. Verás una pantalla que te pide enviar un mensaje (ej. `join fast-yellow`) a un número de WhatsApp de Twilio desde tu celular. Hazlo.
3. Esto vinculará tu celular personal al Sandbox.
4. **Copia el número de remitente de WhatsApp:** Twilio te indicará desde qué número debes enviar los mensajes (generalmente es algo como `whatsapp:+14155238886`).

---

## 2. Plan de Implementación en CleverNote

En la siguiente etapa de desarrollo, integraremos Twilio en nuestro backend de Laravel de esta manera:

### A. Archivo `.env`
Agregaremos estas variables a tu archivo `.env` del servidor:
```env
TWILIO_SID="tu_account_sid_aqui"
TWILIO_TOKEN="tu_auth_token_aqui"
TWILIO_FROM_NUMBER="+12345678900"
TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"
```

### B. Código Backend (Laravel)
Instalaré la librería oficial de Twilio para PHP (`composer require twilio/sdk`).
Crearé un servicio o Job en Laravel que se dispare cuando ocurra una acción importante. 

**¿Qué acción disparará el mensaje? (Propuesta):**
Cuando el administrador cambie el estado de un documento de un usuario a "Completado" o "Rechazado", el sistema le enviará un WhatsApp y un SMS automático avisándole: 
*"Hola [Usuario], tu documento [Nombre] ha sido actualizado a estado: Completado. Revisa tu panel."*

*(Podemos ajustar la acción disparadora a lo que prefieras).*
