import React from 'react';
import './MarkdownEditorView.css';

const initialMarkdown = `# Progreso semanal

- Revisar requisitos del proyecto.
- Preparar propuesta de diseño.
- Enviar cambios para revisión.

> Nota: Mantener el tono claro y directo.
`;

const files = ['main.md', 'resumen.md', 'notas.txt'];

export default function MarkdownEditorView() {
  return (
    <div className="markdown-editor-view">
      <header className="markdown-toolbar">
        <div className="toolbar-title-block">
          <h1>CleverNote / main.md</h1>
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
              <li key={file} className={file === 'main.md' ? 'active' : ''}>
                <span className="file-icon">📄</span>
                {file}
              </li>
            ))}
          </ul>
        </aside>

        <section className="editor-panel">
          <textarea
            className="markdown-textarea"
            defaultValue={initialMarkdown}
            spellCheck={false}
          />
        </section>

        <section className="preview-panel">
          <div className="preview-paper">
            <h1>Progreso semanal</h1>
            <p>
              Este panel muestra una vista limpia de la documentación para revisar el
              contenido antes de compartirlo.
            </p>

            <ul>
              <li>Revisar requisitos del proyecto.</li>
              <li>Preparar propuesta de diseño.</li>
              <li>Enviar cambios para revisión.</li>
            </ul>

            <blockquote>
              Nota: Mantener el tono claro y directo.
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  );
}
