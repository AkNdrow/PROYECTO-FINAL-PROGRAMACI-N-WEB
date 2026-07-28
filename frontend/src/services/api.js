const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Función auxiliar para realizar peticiones HTTP con token de autorización Sanctum
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('clevernote_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Error en la petición');
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Servicio de Autenticación y CRUD conectado a la API de Laravel (con fallback local)
 */
export const api = {
  // 🔑 Inicio de Sesión
  async login(email, password) {
    try {
      const data = await fetchWithAuth('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return data;
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        console.warn('API Laravel desconectada. Usando modo de desarrollo local (localStorage).');
        return {
          access_token: 'mock_token_local_12345',
          user: { email, name: email.split('@')[0] },
        };
      }
      throw error;
    }
  },

  // 📝 Registro de Usuario
  async register(name, email, password) {
    try {
      const data = await fetchWithAuth('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      return data;
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        console.warn('API Laravel desconectada. Registrando usuario en modo local.');
        return {
          message: 'Usuario registrado exitosamente (Local)',
          user: { name, email },
        };
      }
      throw error;
    }
  },

  // 📂 Obtener Notas / Documentos
  async getItems() {
    try {
      const data = await fetchWithAuth('/items');
      return data.data || data;
    } catch (error) {
      console.warn('Cargando documentos desde localStorage.');
      const localDocs = localStorage.getItem('clevernote_docs');
      return localDocs ? JSON.parse(localDocs) : [];
    }
  },

  // 💾 Crear o Actualizar Nota Markdown (PUT / POST)
  async saveItem(itemData, id = null) {
    try {
      const endpoint = id ? `/items/${id}` : '/items';
      const method = id ? 'PUT' : 'POST';
      const data = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(itemData),
      });
      return data.data || data;
    } catch (error) {
      console.warn('Guardando documento en localStorage (Modo Offline).');
      const localDocs = JSON.parse(localStorage.getItem('clevernote_docs') || '[]');
      let updatedDocs;
      if (id) {
        updatedDocs = localDocs.map(d => d.id === id ? { ...d, ...itemData } : d);
      } else {
        const newDoc = { id: Date.now(), ...itemData, created_at: new Date().toISOString() };
        updatedDocs = [newDoc, ...localDocs];
      }
      localStorage.setItem('clevernote_docs', JSON.stringify(updatedDocs));
      return itemData;
    }
  },

  // 🗑️ Eliminar Nota
  async deleteItem(id) {
    try {
      return await fetchWithAuth(`/items/${id}`, { method: 'DELETE' });
    } catch (error) {
      const localDocs = JSON.parse(localStorage.getItem('clevernote_docs') || '[]');
      const filtered = localDocs.filter(d => d.id !== id);
      localStorage.setItem('clevernote_docs', JSON.stringify(filtered));
      return { message: 'Documento eliminado de localStorage' };
    }
  }
};
