package com.examen.api.controller;

import com.examen.api.model.*;
import com.examen.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExamenController {

    @Autowired private TareaRepository tareaRepo;
    @Autowired private ProductoRepository prodRepo;

    @GetMapping("/productos")
    public List<Producto> listarProds() { return prodRepo.findAll(); }
    
    @PostMapping("/productos")
    public Producto guardarProd(@RequestBody Producto p) { return prodRepo.save(p); }

    @GetMapping("/tareas")
    public List<Tarea> listarTareas() { return tareaRepo.findAll(); }

    @PostMapping("/tareas")
    public Tarea guardarTarea(@RequestBody Tarea t) { return tareaRepo.save(t); }

    @DeleteMapping("/tareas/{id}")
    public void eliminarTarea(@PathVariable Long id) { tareaRepo.deleteById(id); }
}