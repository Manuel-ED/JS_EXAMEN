import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configura la URL base de tu API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ 
    estudiante: '', 
    producto: '', 
    cantidad: 1, 
    observacion: '' 
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { 
    obtenerProductos(); 
  }, []);

  const obtenerProductos = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
      setError('');
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos. ¿El backend está corriendo?');
    } finally {
      setCargando(false);
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!form.estudiante.trim()) {
      alert('Ingresa el nombre del estudiante');
      return;
    }
    if (!form.producto) {
      alert('Selecciona un producto');
      return;
    }
    if (form.cantidad < 1) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    try {
      const pedido = {
        estudiante: form.estudiante,
        producto: form.producto,
        cantidad: parseInt(form.cantidad),
        observacion: form.observacion || ''
      };
      
      await axios.post(`${API_URL}/pedidos`, pedido);
      setMensaje(`✅ ¡Pedido registrado correctamente para ${form.estudiante}!`);
      setForm({ estudiante: '', producto: '', cantidad: 1, observacion: '' });
      
      // Recargar productos para actualizar stock (opcional)
      obtenerProductos();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      alert('❌ Error al registrar el pedido. Intenta nuevamente.');
    }
  };

  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos... ☕</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h1>☕ Cafetería UTP - Sistema de Pedidos</h1>
      
      {error && <p style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '5px' }}>{error}</p>}
      
      {/* SECCIÓN PRODUCTOS */}
      <h2>📦 Productos Disponibles</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {productos.map(p => (
          <div key={p.id} style={{ 
              border: p.stock === 0 ? '2px solid #f44336' : '1px solid #ddd',
              padding: '15px', 
              borderRadius: '10px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: p.stock === 0 ? '#fff5f5' : 'white',
              opacity: p.stock === 0 ? 0.7 : 1
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{p.nombre}</h3>
            <p style={{ margin: '5px 0' }}><strong>Categoría:</strong> {p.categoria}</p>
            <p style={{ margin: '5px 0', fontSize: '18px', color: '#2e7d32' }}>
              <strong>Precio:</strong> {new Intl.NumberFormat('es-PE', { 
                style: 'currency', 
                currency: 'PEN' 
              }).format(p.precio)}
            </p>
            
            {p.stock === 0 ? 
              <div style={{ 
                background: '#f44336', 
                color: 'white', 
                padding: '8px', 
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: '10px'
              }}>
                🚫 AGOTADO
              </div> : 
              <p style={{ margin: '5px 0', color: '#1565c0' }}>
                <strong>Stock disponible:</strong> {p.stock} unidades
              </p>
            }
          </div>
        ))}
      </div>

      {/* FORMULARIO DE PEDIDO */}
      <div style={{ 
        borderTop: '3px solid #ff9800', 
        paddingTop: '20px',
        marginTop: '20px'
      }}>
        <h2>📝 Registrar Nuevo Pedido</h2>
        <form onSubmit={handleEnviar} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
          <div>
            <label><strong>Nombre del Estudiante:</strong></label>
            <input 
              type="text"
              placeholder="Ej: Juan Pérez"
              value={form.estudiante}
              onChange={e => setForm({...form, estudiante: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div>
            <label><strong>Producto:</strong></label>
            <select 
              value={form.producto} 
              onChange={e => setForm({...form, producto: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">Seleccione un producto</option>
              {productos.filter(p => p.stock > 0).map(p => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre} - {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p.precio)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label><strong>Cantidad:</strong></label>
            <input 
              type="number"
              min="1"
              value={form.cantidad}
              onChange={e => setForm({...form, cantidad: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div>
            <label><strong>Observación (opcional):</strong></label>
            <textarea 
              placeholder="Ej: Sin azúcar, extra napolitano..."
              value={form.observacion}
              onChange={e => setForm({...form, observacion: e.target.value})}
              rows="3"
              style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              background: '#ff9800',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🛒 Enviar Pedido
          </button>
        </form>
        
        {mensaje && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '5px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;