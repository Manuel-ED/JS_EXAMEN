import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ estudiante: '', producto: '', cantidad: 1, observacion: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => { obtenerProductos(); }, []);

  const obtenerProductos = async () => {
    const res = await axios.get('/api/productos');
    setProductos(res.data);
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pedidos', form);
      setMensaje("¡Pedido registrado correctamente!");
      setForm({ estudiante: '', producto: '', cantidad: 1, observacion: '' });
    } catch (err) { alert("Error al pedir"); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Cafetería UTP - Pedidos</h1>
      
      {/* SECCIÓN PRODUCTOS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {productos.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', opacity: p.stock === 0 ? 0.5 : 1 }}>
            <h3>{p.nombre}</h3>
            <p>Categoría: {p.categoria}</p>
            <p>Precio: {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p.precio)}</p>
            {p.stock === 0 ? <b style={{color: 'red'}}>SIN STOCK</b> : <span>Stock: {p.stock}</span>}
          </div>
        ))}
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleEnviar} style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <h2>Registrar Pedido</h2>
        <input placeholder="Nombre Estudiante" value={form.estudiante} onChange={e => setForm({...form, estudiante: e.target.value})} required /><br/>
        <select value={form.producto} onChange={e => setForm({...form, producto: e.target.value})} required>
          <option value="">Seleccione Producto</option>
          {productos.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
        </select><br/>
        <input type="number" placeholder="Cantidad" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} /><br/>
        <textarea placeholder="Observación" value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} /><br/>
        <button type="submit">Enviar Pedido</button>
      </form>
      {mensaje && <p style={{color: 'green'}}>{mensaje}</p>}
    </div>
  );
}
export default App;