import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, ShoppingCart, CheckSquare, RefreshCw } from 'lucide-react';

function App() {
  const [tareas, setTareas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener datos del backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const resTareas = await axios.get('/api/tareas');
      const resProds = await axios.get('/api/productos');
      setTareas(resTareas.data);
      setProductos(resProds.data);
    } catch (error) {
      console.error("Error conectando al back:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1> <LayoutDashboard /> Dashboard Examen </h1>
        <button onClick={fetchData} style={{ padding: '10px', cursor: 'pointer' }}>
          <RefreshCw size={20} className={loading ? 'spin' : ''} /> Actualizar
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* SECCIÓN TAREAS */}
        <section style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2> <CheckSquare color="green" /> Tareas ({tareas.length})</h2>
          <ul>
            {tareas.length > 0 ? tareas.map(t => (
              <li key={t.id}>{t.descripcion} - {t.completada ? '✅' : '⏳'}</li>
            )) : <p>No hay tareas registradas.</p>}
          </ul>
        </section>

        {/* SECCIÓN PRODUCTOS */}
        <section style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2> <ShoppingCart color="blue" /> Productos ({productos.length})</h2>
          <ul>
            {productos.length > 0 ? productos.map(p => (
              <li key={p.id}>{p.nombre} - S/ {p.precio}</li>
            )) : <p>No hay productos registrados.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;