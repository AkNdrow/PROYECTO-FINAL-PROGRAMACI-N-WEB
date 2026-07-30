import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import Pagination from './Pagination';
import { useAuth } from '../context/AuthContext';

export default function DocumentsView() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');
    
    try {
      const response = await fetch(`${apiUrl}/documents?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar documentos');
      }
      
      const data = await response.json();
      setDocuments(data.data);
      setTotalPages(data.meta.last_page || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage]);

  // Si cambia la búsqueda, reiniciamos a la página 1 y buscamos
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // Necesitamos llamar manualmente porque currentPage no cambiará
      setTimeout(() => {
        const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');
        fetch(`${apiUrl}/documents?page=1&search=${encodeURIComponent(query)}`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(data => {
          setDocuments(data.data);
          setTotalPages(data.meta.last_page || 1);
        });
      }, 0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchBar onSearch={handleSearch} />
      
      {error && <div style={{ color: '#f87171', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
      
      <DataTable documents={documents} loading={loading} />
      
      {!loading && documents.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}
