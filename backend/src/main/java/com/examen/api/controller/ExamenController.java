package com.examen.api.controller;

import com.examen.api.model.*;
import com.examen.api.repository.*;
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
}