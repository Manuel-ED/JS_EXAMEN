package com.examen.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String categoria;
    private Double precio;
    private Integer stock;
}