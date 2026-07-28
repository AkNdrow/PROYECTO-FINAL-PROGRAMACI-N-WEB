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

## 💡 Recomendación sobre `.gitignore`

* **Si es documentación del proyecto / bitácora de equipo**: Se recomienda **MANTENER EL ARCHIVO RASTREADO** (sin añadir a `.gitignore`), ya que sirve como base de conocimientos compartida para que el otro desarrollador (Moisés) conozca cómo resolver estos bloqueos en Windows.
* **Si es una nota personal temporal**: Se puede añadir `error_doc.md` a `.gitignore` agregando la línea `error_doc.md` al final de ese archivo.
