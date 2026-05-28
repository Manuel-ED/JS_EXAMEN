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
}