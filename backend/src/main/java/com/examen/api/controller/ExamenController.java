package com.examen.api.controller;
import com.examen.api.model.*;
import com.examen.api.repository.*;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExamenController {

    @Autowired private ProductoRepository prodRepo;
    @Autowired private PedidoRepository pedidoRepo;

    @GetMapping("/productos")
    public List<Producto> listarProds() { 
        return prodRepo.findAll(); 
    }

    @GetMapping("/productos/{id}")
    public Optional<Producto> obtenerUno(@PathVariable Long id) { 
        return prodRepo.findById(id); 
    }

    @PostMapping("/productos")
    public Producto guardarProducto(@RequestBody Producto producto) {
        return prodRepo.save(producto);
    }

    @PostMapping("/pedidos")
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoRepo.save(pedido);
    }
    
    @GetMapping("/pedidos")
    public List<Pedido> listarPedidos() {
        return pedidoRepo.findAll();
    }

// ===== PREGUNTA 2: INCIDENCIAS =====
@Autowired private IncidenciaRepository incidenciaRepo;

@GetMapping("/incidencias")
public List<Incidencia> listarIncidencias() {
    return incidenciaRepo.findAll();
}

@PostMapping("/incidencias")
public Incidencia crearIncidencia(@RequestBody Incidencia incidencia) {
    incidencia.setEstado("Pendiente");
    return incidenciaRepo.save(incidencia);
}

@PutMapping("/incidencias/{id}/estado")
public Incidencia cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
    Incidencia inc = incidenciaRepo.findById(id).orElseThrow();
    inc.setEstado(body.get("estado"));
    return incidenciaRepo.save(inc);
}

// ===== PREGUNTA 3: CURSOS Y MATRÍCULAS =====
@Autowired private CursoRepository cursoRepo;
@Autowired private MatriculaRepository matriculaRepo;

@GetMapping("/cursos")
public List<Curso> listarCursos() {
    return cursoRepo.findAll();
}

@GetMapping("/cursos/{id}")
public Optional<Curso> obtenerCurso(@PathVariable Long id) {
    return cursoRepo.findById(id);
}

@PostMapping("/matriculas")
public Matricula crearMatricula(@RequestBody Matricula matricula) {
    // Reducir vacantes del curso
    Curso curso = cursoRepo.findByNombre(matricula.getCurso());
    if (curso != null && curso.getVacantes() > 0) {
        curso.setVacantes(curso.getVacantes() - 1);
        cursoRepo.save(curso);
    }
    return matriculaRepo.save(matricula);
}

// ===== PREGUNTA 4: TAREAS =====
@Autowired private TareaRepository tareaRepo;

@GetMapping("/tareas")
public List<Tarea> listarTareas() {
    return tareaRepo.findAll();
}

@PostMapping("/tareas")
public Tarea crearTarea(@RequestBody Tarea tarea) {
    return tareaRepo.save(tarea);
}

@PutMapping("/tareas/{id}")
public Tarea actualizarTarea(@PathVariable Long id, @RequestBody Tarea tarea) {
    Tarea existing = tareaRepo.findById(id).orElseThrow();
    existing.setTitulo(tarea.getTitulo());
    existing.setCurso(tarea.getCurso());
    existing.setFechaEntrega(tarea.getFechaEntrega());
    existing.setEstado(tarea.getEstado());
    existing.setPrioridad(tarea.getPrioridad());
    return tareaRepo.save(existing);
}

@DeleteMapping("/tareas/{id}")
public void eliminarTarea(@PathVariable Long id) {
    tareaRepo.deleteById(id);
}
}