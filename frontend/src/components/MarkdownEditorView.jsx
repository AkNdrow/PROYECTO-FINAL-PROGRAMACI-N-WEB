import React, { useState } from 'react';
import './MarkdownEditorView.css';

const defaultMarkdown = `# Progreso semanal

- Revisar requisitos del proyecto.
- Preparar propuesta de diseño.
- Enviar cambios para revisión.

> Nota: Mantener el tono claro y directo.

## Tareas Pendientes
1. Integrar API REST en Laravel.
2. Probar autenticación con tokens Sanctum.
`;

const files = ['main.md', 'resumen.md', 'notas.txt'];

/**
 * Motor ligero de parsing de Markdown a HTML seguro
 */
function parseMarkdownToHtml(mdText) {
  if (!mdText) return '';

  let html = mdText
    // Escapar etiquetas HTML básicas para evitar XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Encabezados (# H1, ## H2, ### H3)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Citas (> texto)
  html = html.replace(/^&gt;\s?(.*$)/gim, '<blockquote>$1</blockquote>');

  // Negritas e Itálicas (**texto**, *texto*)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Código en línea (`codigo`)
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Listas desordenadas (- item o * item)
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Párrafos (líneas de texto normales)
  html = html.split('\n\n').map(paragraph => {
    if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<block') || paragraph.trim().startsWith('<ul')) {
      return paragraph;
    }
    return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`;
  }).join('');

  return html;
}

export default function MarkdownEditorView() {
  const [markdownContent, setMarkdownContent] = useState(defaultMarkdown);
  const [activeFile, setActiveFile] = useState('main.md');

  return (
    <div className="markdown-editor-view">
      <header className="markdown-toolbar">
        <div className="toolbar-title-block">
          <h1>CleverNote / {activeFile}</h1>
          <span className="status-pill">Guardado ✓</span>
        </div>

        <div className="toolbar-actions">
          <button className="toolbar-button secondary">Guardar</button>
          <button className="toolbar-button primary">Exportar PDF</button>
        </div>
      </header>

      <main className="markdown-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Archivos</h2>
            <span>Explorador</span>
          </div>

          <ul className="file-list">
            {files.map((file) => (
              <li
                key={file}
                className={file === activeFile ? 'active' : ''}
                onClick={() => setActiveFile(file)}
                style={{ cursor: 'pointer' }}
              >
                <span className="file-icon">📄</span>
                {file}
              </li>
            ))}
          </ul>
        </aside>

        <section className="editor-panel">
          <textarea
            className="markdown-textarea"
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            spellCheck={false}
            placeholder="Escribe tu contenido en Markdown aquí..."
          />
        </section>

        <section className="preview-panel">
          <div
            className="preview-paper"
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(markdownContent) }}
          />
        </section>
      </main>
    </div>
  );
}
