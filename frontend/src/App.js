import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// ==================== PÁGINA DE INICIO ====================
function Inicio() {
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>📚 Bienvenido a mi Examen</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
        Selecciona una opción en el menú superior para ver cada pregunta.
      </p>
    </div>
  );
}

// ==================== COMPONENTE PREGUNTA 1 ====================
function Pregunta1() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ estudiante: '', producto: '', cantidad: 1, observacion: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { obtenerProductos(); }, []);

  const obtenerProductos = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los productos.');
    } finally {
      setCargando(false);
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!form.estudiante.trim()) { alert('Ingresa el nombre del estudiante'); return; }
    if (!form.producto) { alert('Selecciona un producto'); return; }
    if (form.cantidad < 1) { alert('La cantidad debe ser mayor a 0'); return; }

    try {
      await axios.post(`${API_URL}/pedidos`, {
        estudiante: form.estudiante,
        producto: form.producto,
        cantidad: parseInt(form.cantidad),
        observacion: form.observacion || ''
      });
      setMensaje(`✅ ¡Pedido registrado para ${form.estudiante}!`);
      setForm({ estudiante: '', producto: '', cantidad: 1, observacion: '' });
      obtenerProductos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      alert('❌ Error al registrar el pedido.');
    }
  };

  if (cargando) return <div>Cargando productos... ☕</div>;

  return (
    <div>
      <h2>☕ Productos - Cafetería UTP</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h3>📦 Productos Disponibles</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {productos.map(p => (
          <div key={p.id} style={{ 
            border: p.stock === 0 ? '2px solid #f44336' : '1px solid #ddd',
            padding: '15px', borderRadius: '10px',
            backgroundColor: p.stock === 0 ? '#fff5f5' : 'white'
          }}>
            <h3>{p.nombre}</h3>
            <p><strong>Categoría:</strong> {p.categoria}</p>
            <p><strong>Precio:</strong> {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p.precio)}</p>
            {p.stock === 0 ? 
              <div style={{ background: '#f44336', color: 'white', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>🚫 AGOTADO</div> : 
              <p><strong>Stock:</strong> {p.stock} unidades</p>
            }
          </div>
        ))}
      </div>

      <h3>📝 Registrar Nuevo Pedido</h3>
      <form onSubmit={handleEnviar} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
        <input type="text" placeholder="Nombre Estudiante" value={form.estudiante} onChange={e => setForm({...form, estudiante: e.target.value})} required style={{ padding: '8px' }} />
        <select value={form.producto} onChange={e => setForm({...form, producto: e.target.value})} required style={{ padding: '8px' }}>
          <option value="">Seleccione un producto</option>
          {productos.filter(p => p.stock > 0).map(p => (<option key={p.id} value={p.nombre}>{p.nombre}</option>))}
        </select>
        <input type="number" min="1" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required style={{ padding: '8px' }} />
        <textarea placeholder="Observación" value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} rows="2" style={{ padding: '8px' }} />
        <button type="submit" style={{ background: '#ff9800', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🛒 Enviar Pedido</button>
      </form>
      {mensaje && <p style={{ color: 'green', marginTop: '15px' }}>{mensaje}</p>}
    </div>
  );
}

// ==================== COMPONENTE PREGUNTA 2 ====================
function Pregunta2() {
  const [incidencias, setIncidencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ aula: '', equipo: '', tipo: '', descripcion: '' });
  const [mensaje, setMensaje] = useState('');

  const obtenerIncidencias = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/incidencias`);
      setIncidencias(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { obtenerIncidencias(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aula || !form.equipo || !form.tipo || !form.descripcion) {
      alert('Todos los campos son obligatorios');
      return;
    }
    try {
      await axios.post(`${API_URL}/incidencias`, form);
      setMensaje('✅ Incidencia registrada correctamente');
      setForm({ aula: '', equipo: '', tipo: '', descripcion: '' });
      obtenerIncidencias();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      alert('❌ Error al registrar incidencia');
    }
  };

  const cambiarEstado = async (id, estadoActual) => {
    let nuevoEstado = '';
    if (estadoActual === 'Pendiente') nuevoEstado = 'En proceso';
    else if (estadoActual === 'En proceso') nuevoEstado = 'Atendida';
    else return;
    
    try {
      await axios.put(`${API_URL}/incidencias/${id}/estado`, { estado: nuevoEstado });
      obtenerIncidencias();
    } catch (err) {
      alert('Error al cambiar estado');
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return '#f44336';
      case 'En proceso': return '#ff9800';
      case 'Atendida': return '#4caf50';
      default: return '#999';
    }
  };

  const totalIncidencias = incidencias.length;

  if (cargando) return <div>Cargando incidencias...</div>;

  return (
    <div>
      <h2>🛠️ Gestor de Incidencias - Laboratorio</h2>
      
      <div style={{ 
        background: '#2196f3', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h3>📊 Total de Incidencias</h3>
        <p style={{ fontSize: '48px', margin: '0', fontWeight: 'bold' }}>{totalIncidencias}</p>
      </div>

      <h3>📋 Lista de Incidencias</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th style={{ border: '1px solid #ddd', padding: '12px', background: '#f2f2f2' }}>Aula</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', background: '#f2f2f2' }}>Equipo</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', background: '#f2f2f2' }}>Tipo</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', background: '#f2f2f2' }}>Descripción</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', background: '#f2f2f2' }}>Estado</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', background: '#f2f2f2' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map(inc => (
              <tr key={inc.id}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{inc.aula}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{inc.equipo}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{inc.tipo}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{inc.descripcion}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', color: getEstadoColor(inc.estado), fontWeight: 'bold' }}>
                  {inc.estado}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {inc.estado !== 'Atendida' && (
                    <button 
                      onClick={() => cambiarEstado(inc.id, inc.estado)}
                      style={{
                        background: getEstadoColor(inc.estado),
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      {inc.estado === 'Pendiente' ? '▶ Iniciar' : '✅ Completar'}
                    </button>
                  )}
                  {inc.estado === 'Atendida' && <span>✅ Finalizada</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3>📝 Reportar Nueva Incidencia</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
          <input type="text" placeholder="Aula (ej: Lab-101)" value={form.aula} onChange={e => setForm({...form, aula: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
          <input type="text" placeholder="Equipo (ej: PC-05)" value={form.equipo} onChange={e => setForm({...form, equipo: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
          <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
            <option value="">Seleccione tipo</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Red">Red</option>
            <option value="Otro">Otro</option>
          </select>
          <textarea placeholder="Descripción del problema" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows="3" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
          <button type="submit" style={{ background: '#2196f3', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>📨 Registrar Incidencia</button>
        </form>
        {mensaje && <p style={{ color: 'green', marginTop: '15px' }}>{mensaje}</p>}
      </div>
    </div>
  );
}

// ==================== APP PRINCIPAL CON NAVEGACIÓN ====================
function App() {
  const [pagina, setPagina] = useState('inicio');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      {/* Barra de navegación */}
      <nav style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setPagina('inicio')}
          style={{
            background: pagina === 'inicio' ? '#4caf50' : '#f5f5f5',
            color: pagina === 'inicio' ? 'white' : '#333',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🏠 Inicio
        </button>
        <button 
          onClick={() => setPagina('pregunta1')}
          style={{
            background: pagina === 'pregunta1' ? '#ff9800' : '#f5f5f5',
            color: pagina === 'pregunta1' ? 'white' : '#333',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ☕ Productos
        </button>
        <button 
          onClick={() => setPagina('pregunta2')}
          style={{
            background: pagina === 'pregunta2' ? '#2196f3' : '#f5f5f5',
            color: pagina === 'pregunta2' ? 'white' : '#333',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🛠️ Incidencias
        </button>
      </nav>

      {/* Contenido según la página seleccionada */}
      {pagina === 'inicio' && <Inicio />}
      {pagina === 'pregunta1' && <Pregunta1 />}
      {pagina === 'pregunta2' && <Pregunta2 />}
    </div>
  );
}

export default App;