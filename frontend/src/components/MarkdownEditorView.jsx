import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import './MarkdownEditorView.css';

const defaultMarkdown = `# Progreso semanal

- Revisar requisitos del proyecto.
- Preparar propuesta de diseño.
- Enviar cambios para revisión.

> Nota: Mantener el tono claro y directo.

## Tareas Pendientes
1. Integrar API REST en Laravel.
2. Probar autenticación con tokens Sanctum.

### Pruebas Finales
- Verificar respuesta en tiempo real.
`;

const files = ['main.md', 'resumen.md', 'notas.txt'];

/**
 * Extraer estructura dinámica de secciones (H1, H2, H3) usando Regex
 */
function extractHeadings(mdText) {
  if (!mdText) return [];
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(mdText)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }
  return headings;
}

/**
 * Motor ligero de parsing de Markdown a HTML seguro
 */
function parseMarkdownToHtml(mdText) {
  if (!mdText) return '';

  let html = mdText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Encabezados
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Citas
  html = html.replace(/^&gt;\s?(.*$)/gim, '<blockquote>$1</blockquote>');

  // Formato de texto
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Listas
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Párrafos
  return html.split('\n\n').map(paragraph => {
    if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<block') || paragraph.trim().startsWith('<ul')) {
      return paragraph;
    }
    return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`;
  }).join('');
}

export default function MarkdownEditorView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page') || '1';

  const [markdownContent, setMarkdownContent] = useState(defaultMarkdown);
  const [activeFile, setActiveFile] = useState(id ? `doc_${id}.md` : 'main.md');
  const [saveStatus, setSaveStatus] = useState('Guardado ✓');
  const [isSaving, setIsSaving] = useState(false);

  // Escaneo dinámico de encabezados vía Expresiones Regulares
  const headings = extractHeadings(markdownContent);

  useEffect(() => {
    if (id) {
      setActiveFile(`doc_${id}.md`);
    }
  }, [id]);

  // Lógica de guardado asíncrono (PUT a la API / localStorage) con indicador visual
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('Guardando...');

    try {
      await api.saveItem({
        name: activeFile,
        description: markdownContent,
      }, id || null);

      setTimeout(() => {
        setSaveStatus('Guardado ✓');
        setIsSaving(false);
      }, 500);
    } catch (err) {
      setSaveStatus('Error al guardar ✖');
      setIsSaving(false);
    }
  };

  return (
    <div className="markdown-editor-view">
      <header className="markdown-toolbar">
        <div className="toolbar-title-block">
          <h1>CleverNote / {activeFile}</h1>
          <span className={`status-pill ${isSaving ? 'saving' : ''}`}>{saveStatus}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Página: {pageParam}</span>
        </div>

        <div className="toolbar-actions">
          <button
            className="toolbar-button secondary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
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

          {/* Secciones e Índice Dinámico (H1, H2, H3) extraídos mediante Regex */}
          <div className="sidebar-header" style={{ marginTop: '1.5rem' }}>
            <h2>Estructura</h2>
            <span>Secciones dinámicas ({headings.length})</span>
          </div>

          <ul className="file-list" style={{ fontSize: '0.85rem' }}>
            {headings.length > 0 ? (
              headings.map((h, idx) => (
                <li key={idx} style={{ paddingLeft: `${(h.level - 1) * 0.75 + 0.5}rem`, opacity: 0.9 }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{'#'.repeat(h.level)}</span> {h.text}
                </li>
              ))
            ) : (
              <li style={{ color: '#64748b', fontSize: '0.8rem' }}>No hay encabezados</li>
            )}
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
