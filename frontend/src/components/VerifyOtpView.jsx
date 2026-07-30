import React, { useState } from 'react';
import AlertMessage from './AlertMessage';

function VerifyOtpView({ email, onVerified, onCancel }) {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (otpCode.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');

    try {
      const response = await fetch(`${apiUrl}/verify-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp_code: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar el código');
      }

      setSuccessMsg('¡Teléfono verificado con éxito! Ahora puedes iniciar sesión.');
      setTimeout(() => {
        if (onVerified) onVerified();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {successMsg && <AlertMessage type="success" message={successMsg} />}
      <div className="register-card" style={{ maxWidth: '400px' }}>
        <div className="register-brand">
          <h1>Verifica tu celular</h1>
          <p>Hemos enviado un código SMS y WhatsApp al número que registraste.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleVerify}>
          <label className="field">
            <span>Código de Verificación (6 dígitos):</span>
            <input 
              type="text" 
              name="otp_code" 
              value={otpCode} 
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
              placeholder="123456" 
              disabled={loading} 
              style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
              No olvides revisar también tu bandeja de correo para verificar tu email.
            </p>
          </label>

          <button type="submit" className="submit-btn" disabled={loading || otpCode.length !== 6}>
            {loading ? 'Verificando...' : 'Verificar Cuenta'}
          </button>
          
          <div className="login-prompt" style={{ marginTop: '1rem' }}>
             ¿Te equivocaste de número? <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline' }}>Volver</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtpView;
