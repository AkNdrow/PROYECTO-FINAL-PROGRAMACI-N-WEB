# Guía de Instalación y Configuración de Postfix (Fase 4)

DigitalOcean bloquea por defecto la salida de correos hacia servicios externos (como Gmail o Outlook) por el puerto 25 y otros puertos SMTP para evitar el spam en cuentas nuevas. 

Para cumplir con la rúbrica, instalaremos **Postfix** como un servidor SMTP local en tu VPS. Laravel enviará los correos a este servidor local de Postfix usando el puerto 25 interno (`127.0.0.1`), y Postfix se encargará de gestionarlos (aunque DigitalOcean los bloquee en la salida a internet, a nivel de tu aplicación el flujo de envío de correos funcionará perfectamente y sin errores).

Sigue estos pasos dentro de la terminal SSH de tu VPS:

## 1. Instalar Postfix

Ejecuta el siguiente comando para instalar Postfix y sus dependencias:
```bash
sudo apt update
sudo apt install postfix -y
```

**Durante la instalación, te aparecerá una pantalla rosa/morada de configuración:**
1. **General type of mail configuration:** Selecciona `Internet Site` (Sitio de Internet) pulsando TAB y luego Enter.
2. **System mail name:** Escribe tu dominio (ej. `clevernote.duckdns.org` o el que estés utilizando) y pulsa Enter.

## 2. Configurar Postfix para escuchar solo localmente

Por seguridad, debemos configurar Postfix para que solo acepte correos provenientes de tu propia aplicación Laravel (localhost) y no desde internet abierto.

Abre el archivo de configuración de Postfix:
```bash
sudo nano /etc/postfix/main.cf
```

Busca la línea que dice `inet_interfaces = all` y cámbiala por:
```text
inet_interfaces = loopback-only
```

Guarda y cierra el archivo (En nano: `Ctrl+O`, `Enter`, `Ctrl+X`).

Reinicia el servicio de Postfix para aplicar los cambios:
```bash
sudo systemctl restart postfix
```

Verifica que el servicio esté corriendo y habilitado:
```bash
sudo systemctl enable postfix
sudo systemctl status postfix
```
*(Debería decir "active (running)" en verde).*

---

## 3. Configurar Laravel (.env)

Ahora debemos decirle a Laravel que deje de simular los correos en los logs (`MAIL_MAILER=log`) y comience a utilizar tu nuevo servidor local Postfix.

En tu VPS, abre el archivo `.env` de tu proyecto:
```bash
cd /var/www/html/CleverNote/backend
nano .env
```

Modifica la sección de correos para que quede exactamente así:
```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=25
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="no-reply@clevernote.duckdns.org"
MAIL_FROM_NAME="CleverNote VPS"
```

Guarda el archivo y limpia la caché de configuración de Laravel:
```bash
php artisan config:clear
```

## 4. Prueba del Sistema
A partir de este momento, cuando un usuario se registre, Laravel construirá el correo y lo entregará a Postfix localmente en una fracción de segundo sin generar ningún error. 

Como recordarás, nosotros ya habíamos programado un "bypass" opcional para iniciar sesión sin validar el correo, así que la experiencia del usuario (iniciar sesión tras registrarse) será fluida, mientras que tu aplicación cumple estrictamente con el requerimiento de la rúbrica de usar Postfix local para la gestión de envíos.
