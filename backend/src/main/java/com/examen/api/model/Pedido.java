package com.examen.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String estudiante;
    private String producto;
    private Integer cantidad;
    private String observacion;
}