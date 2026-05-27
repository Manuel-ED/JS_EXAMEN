package com.examen.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity 
@Data
public class Producto {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String categoria;
    private Double precio;
    private Integer stock;
}