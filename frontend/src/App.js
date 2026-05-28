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

// ==================== PREGUNTA 3: CURSOS Y MATRÍCULAS ====================
function Pregunta3() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [resumen, setResumen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    codigoEstudiante: '',
    curso: '',
    turno: ''
  });

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/cursos`);
      setCursos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.codigoEstudiante || !form.curso || !form.turno) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // Mostrar resumen antes de enviar
    const cursoSeleccionado = cursos.find(c => c.nombre === form.curso);
    setResumen({
      ...form,
      creditos: cursoSeleccionado?.creditos,
      modalidad: cursoSeleccionado?.modalidad
    });

    try {
      await axios.post(`${API_URL}/matriculas`, form);
      setMensaje(`✅ ¡Matrícula registrada para ${form.nombre}! Vacantes actualizadas.`);
      setForm({ nombre: '', codigoEstudiante: '', curso: '', turno: '' });
      obtenerCursos(); // Actualizar vacantes
      setTimeout(() => {
        setMensaje('');
        setResumen(null);
      }, 5000);
    } catch (err) {
      alert('❌ Error al registrar matrícula');
    }
  };

  const getModalidadColor = (modalidad) => {
    switch(modalidad) {
      case 'Virtual': return '#4caf50';
      case 'Presencial': return '#2196f3';
      case 'Semipresencial': return '#ff9800';
      default: return '#666';
    }
  };

  if (cargando) return <div>Cargando cursos...</div>;

  return (
    <div>
      <h2>📚 Cursos Disponibles - Sistema de Matrículas</h2>

      {/* Tabla responsiva con Bootstrap */}
      <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
        <table className="table table-striped table-bordered" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Nombre del Curso</th>
              <th>Créditos</th>
              <th>Modalidad</th>
              <th>Vacantes</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso.id} style={{
                backgroundColor: curso.vacantes === 0 ? '#f8d7da' : 'white'
              }}>
                <td>{curso.codigo}</td>
                <td>
                  <span style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {curso.nombre}
                  </span>
                </td>
                <td>{curso.creditos}</td>
                <td>
                  <span style={{
                    background: getModalidadColor(curso.modalidad),
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {curso.modalidad}
                  </span>
                </td>
                <td>
                  {curso.vacantes === 0 ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>🚫 SIN VACANTES</span>
                  ) : (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>{curso.vacantes} disponibles</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario de Matrícula */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3>📝 Solicitar Matrícula</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={e => setForm({...form, nombre: e.target.value})}
            required
            className="form-control"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Código de estudiante (ej: U20210001)"
            value={form.codigoEstudiante}
            onChange={e => setForm({...form, codigoEstudiante: e.target.value})}
            required
            className="form-control"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <select
            value={form.curso}
            onChange={e => setForm({...form, curso: e.target.value})}
            required
            className="form-select"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="">Seleccione un curso</option>
            {cursos.filter(c => c.vacantes > 0).map(curso => (
              <option key={curso.id} value={curso.nombre}>
                {curso.nombre} - {curso.modalidad} ({curso.vacantes} vacantes)
              </option>
            ))}
          </select>
          <select
            value={form.turno}
            onChange={e => setForm({...form, turno: e.target.value})}
            required
            className="form-select"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="">Seleccione un turno</option>
            <option value="Mañana">🌅 Mañana (8:00 - 12:00)</option>
            <option value="Tarde">🌇 Tarde (13:00 - 17:00)</option>
            <option value="Noche">🌙 Noche (18:00 - 22:00)</option>
          </select>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ background: '#2196f3', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            📨 Solicitar Matrícula
          </button>
        </form>

        {/* Resumen de matrícula */}
        {resumen && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#e3f2fd',
            borderRadius: '10px',
            borderLeft: '5px solid #2196f3'
          }}>
            <h4>📋 Resumen de Matrícula</h4>
            <p><strong>Estudiante:</strong> {resumen.nombre}</p>
            <p><strong>Código:</strong> {resumen.codigoEstudiante}</p>
            <p><strong>Curso:</strong> {resumen.curso}</p>
            <p><strong>Créditos:</strong> {resumen.creditos}</p>
            <p><strong>Modalidad:</strong> {resumen.modalidad}</p>
            <p><strong>Turno:</strong> {resumen.turno}</p>
            <p style={{ color: 'green', marginTop: '10px' }}>
              ✅ ¡Matrícula procesada correctamente!
            </p>
          </div>
        )}

        {mensaje && !resumen && (
          <p style={{ color: 'green', marginTop: '15px' }}>{mensaje}</p>
        )}
      </div>
    </div>
  );
}

// ==================== PREGUNTA 4: GESTOR DE TAREAS ====================
function Pregunta4() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    titulo: '',
    curso: '',
    fechaEntrega: '',
    estado: 'Pendiente',
    prioridad: 'Media'
  });

  useEffect(() => {
    obtenerTareas();
  }, []);

  const obtenerTareas = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/tareas`);
      setTareas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.curso || !form.fechaEntrega) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      if (editandoId) {
        // Editar tarea existente
        await axios.put(`${API_URL}/tareas/${editandoId}`, form);
        setMensaje('✏️ Tarea actualizada correctamente');
        setEditandoId(null);
      } else {
        // Crear nueva tarea
        await axios.post(`${API_URL}/tareas`, form);
        setMensaje('✅ Tarea registrada correctamente');
      }
      
      setForm({ titulo: '', curso: '', fechaEntrega: '', estado: 'Pendiente', prioridad: 'Media' });
      obtenerTareas();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      alert('❌ Error al procesar la tarea');
    }
  };

  const handleEditar = (tarea) => {
    setEditandoId(tarea.id);
    setForm({
      titulo: tarea.titulo,
      curso: tarea.curso,
      fechaEntrega: tarea.fechaEntrega,
      estado: tarea.estado,
      prioridad: tarea.prioridad
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await axios.delete(`${API_URL}/tareas/${id}`);
        setMensaje('🗑️ Tarea eliminada correctamente');
        obtenerTareas();
        setTimeout(() => setMensaje(''), 3000);
      } catch (err) {
        alert('❌ Error al eliminar la tarea');
      }
    }
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setForm({ titulo: '', curso: '', fechaEntrega: '', estado: 'Pendiente', prioridad: 'Media' });
  };

  const esTareaVencida = (fechaEntrega, estado) => {
    const hoy = new Date().toISOString().split('T')[0];
    return fechaEntrega < hoy && estado === 'Pendiente';
  };

  const esTareaUrgente = (fechaEntrega, prioridad) => {
    const hoy = new Date().toISOString().split('T')[0];
    const fecha = new Date(fechaEntrega);
    const hoyDate = new Date(hoy);
    const diferenciaDias = Math.ceil((fecha - hoyDate) / (1000 * 60 * 60 * 24));
    return diferenciaDias <= 3 && prioridad === 'Alta' && fecha >= hoy;
  };

  const getPrioridadColor = (prioridad) => {
    switch(prioridad) {
      case 'Alta': return '#f44336';
      case 'Media': return '#ff9800';
      case 'Baja': return '#4caf50';
      default: return '#999';
    }
  };

  // const formatearFechaParaInput = (fecha) => {
  //   if (!fecha) return '';
  //   return fecha;
  // };

  if (cargando) return <div>Cargando tareas...</div>;

  return (
    <div>
      <h2>📋 Gestor de Tareas Académicas</h2>

      {/* Alerta de tareas vencidas */}
      {tareas.some(t => esTareaVencida(t.fechaEntrega, t.estado)) && (
        <div style={{
          background: '#f44336',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          ⚠️ ¡ALERTA! Tienes tareas vencidas pendientes. ¡Revisa la tabla!
        </div>
      )}

      {/* Tabla de tareas */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Título</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Curso</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Fecha Entrega</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Estado</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Prioridad</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map(tarea => {
              const vencida = esTareaVencida(tarea.fechaEntrega, tarea.estado);
              const urgente = esTareaUrgente(tarea.fechaEntrega, tarea.prioridad);
              
              return (
                <tr key={tarea.id} style={{
                  backgroundColor: vencida ? '#ffebee' : urgente ? '#fff3e0' : 'white'
                }}>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    <strong>{tarea.titulo}</strong>
                    {vencida && <span style={{ color: 'red', marginLeft: '10px' }}>⏰ VENCIDA</span>}
                    {urgente && !vencida && <span style={{ color: 'orange', marginLeft: '10px' }}>🔥 URGENTE</span>}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{tarea.curso}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {new Intl.DateTimeFormat('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).format(new Date(tarea.fechaEntrega))}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    <select
                      value={tarea.estado}
                      onChange={async (e) => {
                        const nuevoEstado = e.target.value;
                        try {
                          await axios.put(`${API_URL}/tareas/${tarea.id}`, {
                            ...tarea,
                            estado: nuevoEstado
                          });
                          obtenerTareas();
                          setMensaje('Estado actualizado');
                          setTimeout(() => setMensaje(''), 2000);
                        } catch (err) {
                          alert('Error al actualizar estado');
                        }
                      }}
                      style={{ padding: '5px', borderRadius: '5px' }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    <span style={{
                      background: getPrioridadColor(tarea.prioridad),
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {tarea.prioridad}
                    </span>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    <button
                      onClick={() => handleEditar(tarea)}
                      style={{
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '5px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(tarea.id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Formulario Nueva/Editar Tarea */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3>{editandoId ? '✏️ Editar Tarea' : '📝 Nueva Tarea'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={form.titulo}
            onChange={e => setForm({...form, titulo: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Curso"
            value={form.curso}
            onChange={e => setForm({...form, curso: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="date"
            value={form.fechaEntrega}
            onChange={e => setForm({...form, fechaEntrega: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <select
            value={form.estado}
            onChange={e => setForm({...form, estado: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
          </select>
          <select
            value={form.prioridad}
            onChange={e => setForm({...form, prioridad: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="Alta">Alta 🔴</option>
            <option value="Media">Media 🟠</option>
            <option value="Baja">Baja 🟢</option>
          </select>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                background: editandoId ? '#ff9800' : '#4caf50',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              {editandoId ? '✏️ Actualizar Tarea' : '📨 Registrar Tarea'}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={handleCancelarEdicion}
                style={{
                  background: '#999',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        {mensaje && (
          <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{mensaje}</p>
        )}
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

        <button 
          onClick={() => setPagina('pregunta3')}
          style={{
            background: pagina === 'pregunta3' ? '#4caf50' : '#f5f5f5',
            color: pagina === 'pregunta3' ? 'white' : '#333',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📚 Cursos
        </button>

        <button 
        onClick={() => setPagina('pregunta4')}
        style={{
          background: pagina === 'pregunta4' ? '#9c27b0' : '#f5f5f5',
          color: pagina === 'pregunta4' ? 'white' : '#333',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        📋 Tareas
      </button>
      </nav>

      {/* Contenido según la página seleccionada */}
      {pagina === 'inicio' && <Inicio />}
      {pagina === 'pregunta1' && <Pregunta1 />}
      {pagina === 'pregunta2' && <Pregunta2 />}
      {pagina === 'pregunta3' && <Pregunta3 />}
      {pagina === 'pregunta4' && <Pregunta4 />}
    </div>
  );
}

export default App;