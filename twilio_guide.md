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

## 2. Funcionamiento en CleverNote

En CleverNote, Twilio está integrado directamente en la lógica de creación de contenido. He creado una clase dedicada llamada `TwilioService` que se encarga de empaquetar toda la complejidad de comunicarse con la API de Twilio.

**La Acción Disparadora:**
El envío se dispara de forma automática **cuando un usuario crea un nuevo Ítem (o Documento)**. 
En el `ItemController`, justo después de que el registro se guarda exitosamente en la base de datos MySQL, el controlador "llama" al servicio de Twilio y le ordena despachar dos mensajes simultáneos (uno por SMS clásico y otro por WhatsApp) avisando: *"CleverNote: Se ha creado el nuevo ítem '[Nombre del Ítem]'"*.

> [!NOTE]
> Dado que estás utilizando una cuenta **Trial (de prueba)** de Twilio, existe una restricción impuesta por ellos: **Solo puedes enviar mensajes a números que hayas verificado previamente en tu consola de Twilio** (generalmente tu propio número de celular personal). Por ello, hemos configurado una variable `TWILIO_DESTINATION_PHONE` en tu `.env` que forza al sistema a enviarte todas las notificaciones a tu teléfono, simulando cómo le llegaría a un usuario real en producción.

---

## 3. ¿Cómo probarlo en el VPS?

Para comprobar que tu VPS está enviando los SMS y WhatsApp correctamente a tu celular, sigue estos pasos:

1. **Asegura la configuración `.env` en tu VPS:**
   Verifica que dentro de `/var/www/html/CleverNote/backend/.env` tengas las variables de Twilio bien escritas:
   ```env
   TWILIO_SID="tu_sid"
   TWILIO_TOKEN="tu_token"
   TWILIO_FROM_NUMBER="+18156654511"
   TWILIO_WHATSAPP_FROM="+14155238886"
   TWILIO_DESTINATION_PHONE="+529513543364" 
   ```
   *(Nota: Asegúrate de que `TWILIO_WHATSAPP_FROM` **NO** contenga la palabra `whatsapp:` antes del número, el sistema la añade sola).*

2. **Aplica los cambios y actualiza el código:**
   Si no lo has hecho, asegúrate de descargar la última versión del código y de instalar la librería de Twilio en el servidor:
   ```bash
   cd /var/www/html/CleverNote
   git pull origin main
   
   cd backend
   composer install
   ```

3. **Ejecuta la prueba desde Bruno (Tu PC):**
   * Abre **Bruno** en tu computadora local.
   * Selecciona la petición para **Crear un Ítem** (`POST /api/items` o la equivalente que estés usando).
   * Asegúrate de estar autenticado (pasando el Bearer Token en la pestaña Auth).
   * En el `Body` (JSON), envía un nuevo ítem, por ejemplo:
     ```json
     {
       "name": "Reporte de Ventas",
       "description": "Reporte mensual para probar Twilio"
     }
     ```
   * Haz clic en **Send**.

4. **¡Revisa tu Celular!**
   Al recibir el código `201 Created` en Bruno, tu VPS habrá completado el proceso y en unos segundos tu celular deberá vibrar recibiendo un SMS tradicional y un mensaje de WhatsApp desde el número de Twilio.
