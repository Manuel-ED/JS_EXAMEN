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

    @Autowired private ProductoRepository prodRepo;
    @Autowired private PedidoRepository pedidoRepo;

    @GetMapping("/productos")
    public List<Producto> listarProds() { 
        return prodRepo.findAll(); 
    }

    @GetMapping("/productos/{id}")
    public Producto obtenerUno(@PathVariable Long id) { 
        return prodRepo.findById(id).orElse(null); 
    }

    @PostMapping("/productos")
public Producto guardarProducto(@RequestBody Producto producto) {
    return prodRepo.save(producto);
}
}