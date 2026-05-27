package com.examen.api.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Data
public class Tarea {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descripcion;
    private boolean completada;
}