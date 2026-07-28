# 🛠️ Documentación de Arquitectura del Repositorio - CleverNote

## 📁 Estructura del Repositorio

El proyecto se organiza bajo una estructura de monorepo limpio con separación de responsabilidades:

* **`/frontend`**: Aplicación de cliente desarrollada en React + Vite. Mantiene las interfaces de usuario (Login, Registro y Editor de documentos Markdown `.md`).
* **`/backend`**: API REST desarrollada en Laravel para la gestión de persistencia, autenticación y base de datos en entorno VPS.
* **`README.md`**: Descripción general y roles del proyecto.
* **`documentacion.md`**: Especificaciones técnicas y guía de arquitectura.
* **`error_doc.md`**: Bitácora técnica de resolución de problemas Git y SO.

---

## 👥 Flujo de Trabajo en Ramas (Git)

* **`main`**: Rama estable de producción donde se integran los avances probados.
* **`frontend`**: Rama de trabajo principal para Moisés (Frontend). Toda edición visual o de componentes de React se realiza aquí.
* **`backend`**: Rama de trabajo principal para Andrés (Full Stack). Desarrollo de endpoints, migraciones y controladores en Laravel.

---

## 💾 Persistencia de Datos (Markdown `.md`)

1. **Fase de Pruebas / Desarrollo Local**: Los documentos creados y editados en el componente `MarkdownEditorView` se almacenan localmente mediante `localStorage` para garantizar la funcionalidad sin dependencia del servidor backend.
2. **Fase de Entrega Final (VPS)**: La aplicación sincroniza mediante peticiones HTTP a la API de Laravel alojada en el VPS para almacenar las notas `.md` de forma permanente.

---

## ⚡ Regla de Optimización de Código

proyecto:
* Se reutilizan componentes modulares en React.
* Se evita añadir librerías innecesarias.
* El backend en Laravel se mantiene exclusivamente como una API REST liviana.
