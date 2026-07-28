# Guía de Despliegue en VPS (Nginx + MySQL)

Este documento detalla los pasos exactos para llevar la API REST creada desde tu entorno de desarrollo hacia un servidor virtual privado (VPS) en producción con **Nginx**, **PHP** y **MySQL** ya instalados.

## 1. Clonar el repositorio
Ingresa a tu servidor por SSH. Posiciónate en el directorio donde alojas tus proyectos.
```bash
cd /var/www/html/AndresFolder/
git clone https://github.com/AkNdrow/CGAact4t4.git
cd CGAact4t4
```
*(Nota: Si ya clonaste el proyecto y estás dentro de la carpeta `CGAact4t4`, puedes saltar al paso 2).*

## 2. Instalar dependencias con Composer
Como es un entorno de producción, debemos instalar las dependencias omitiendo los paquetes de desarrollo y optimizando el autoloader.
```bash
composer install --optimize-autoloader --no-dev
```

## 3. Configuración del Entorno (.env)
Copia el archivo de ejemplo para crear el tuyo propio:
```bash
cp .env.example .env
```
Luego edita el archivo (ej. usando `nano .env`) y asegúrate de modificar las siguientes variables claves:

```env
APP_NAME=TuNombreDeApp
APP_ENV=production
APP_KEY= # (Se genera en el paso 4)
APP_DEBUG=false
APP_URL=http://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombre_de_tu_db
DB_USERNAME=usuario_mysql
DB_PASSWORD=contraseña_fuerte
```

## 4. Generar la llave de la aplicación y base de datos
Genera la APP_KEY para encriptar las sesiones y tokens de Sanctum:
```bash
php artisan key:generate
```

Luego, corre las migraciones. Al estar en producción (`APP_ENV=production`), Laravel pedirá confirmación, por eso usamos `--force`:
```bash
php artisan migrate --force
```

## 5. Ajustar permisos de directorios
Nginx y PHP-FPM suelen ejecutarse bajo el usuario `www-data` (en Ubuntu/Debian). Es obligatorio que los directorios `storage` y `bootstrap/cache` tengan permisos de escritura. Asegúrate de indicar las rutas absolutas de tu proyecto:
```bash
sudo chown -R www-data:www-data /var/www/html/AndresFolder/CGAact4t4
sudo find /var/www/html/AndresFolder/CGAact4t4 -type f -exec chmod 644 {} \;
sudo find /var/www/html/AndresFolder/CGAact4t4 -type d -exec chmod 755 {} \;
sudo chmod -R 775 /var/www/html/AndresFolder/CGAact4t4/storage
sudo chmod -R 775 /var/www/html/AndresFolder/CGAact4t4/bootstrap/cache
```

## 6. Configurar Nginx (Virtual Host)
Crea un archivo de configuración para tu dominio en Nginx:
```bash
sudo nano /etc/nginx/sites-available/api-crud
```

Pega la siguiente configuración (ajusta `server_name` y la versión de `php-fpm` según tu servidor):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tu-dominio.com; # O la IP de tu VPS
    
    # IMPORTANTE: El root DEBE apuntar a la carpeta public de Laravel
    root /var/www/html/AndresFolder/CGAact4t4/public;
 
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
 
    index index.php;
 
    charset utf-8;
 
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
 
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }
 
    error_page 404 /index.php;
 
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Cambia 8.2 por tu versión de PHP
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
 
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Habilita el sitio y recarga Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/api-crud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Optimización de Laravel
Para que el framework vuele, ejecuta estos comandos que guardarán la configuración en caché:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

¡Listo! Tu API ahora debería responder exitosamente a las peticiones JSON apuntando a tu dominio o IP pública del VPS.
