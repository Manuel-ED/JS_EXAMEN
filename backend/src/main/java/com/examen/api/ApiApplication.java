package com.examen.api;

import com.examen.api.model.Producto;
import com.examen.api.model.Incidencia;
import com.examen.api.repository.ProductoRepository;
import com.examen.api.repository.IncidenciaRepository;
import com.examen.api.model.Curso;
import com.examen.api.repository.CursoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(ProductoRepository prodRepo, IncidenciaRepository incidenciaRepo, CursoRepository cursoRepo) {
        return args -> {
            // Datos de productos
            if (prodRepo.count() == 0) {
                prodRepo.save(new Producto(null, "Café Americano", "Bebidas", 5.50, 10));
                prodRepo.save(new Producto(null, "Café Latte", "Bebidas", 7.50, 8));
                prodRepo.save(new Producto(null, "Sánguche de Pollo", "Comidas", 12.90, 5));
                prodRepo.save(new Producto(null, "Sánguche de Jamón", "Comidas", 10.90, 3));
                prodRepo.save(new Producto(null, "Queque de Naranja", "Postres", 4.50, 0));
                prodRepo.save(new Producto(null, "Alfajor", "Postres", 3.50, 2));
                prodRepo.save(new Producto(null, "Jugo de Papaya", "Bebidas", 7.00, 0));
                prodRepo.save(new Producto(null, "Empanada de Carne", "Comidas", 6.50, 4));
                System.out.println("✅ Datos de productos cargados correctamente");
            }
            
            // Datos de incidencias
            if (incidenciaRepo.count() == 0) {
                incidenciaRepo.save(new Incidencia(null, "Lab-101", "PC-05", "Hardware", "Teclado no funciona", "Pendiente"));
                incidenciaRepo.save(new Incidencia(null, "Lab-102", "PC-12", "Software", "No carga Windows", "En proceso"));
                incidenciaRepo.save(new Incidencia(null, "Lab-101", "PC-08", "Red", "Sin acceso a internet", "Atendida"));
                incidenciaRepo.save(new Incidencia(null, "Lab-103", "PC-03", "Hardware", "Mouse no responde", "Pendiente"));
                System.out.println("✅ Datos de incidencias cargados correctamente");
            }

            if (cursoRepo.count() == 0) {
                cursoRepo.save(new Curso(null, "C1001", "Desarrollo Web Avanzado", 4, "Virtual", 20));
                cursoRepo.save(new Curso(null, "C1002", "Base de Datos II", 3, "Presencial", 15));
                cursoRepo.save(new Curso(null, "C1003", "Inteligencia Artificial", 4, "Virtual", 0));
                cursoRepo.save(new Curso(null, "C1004", "Redes y Comunicaciones", 3, "Presencial", 8));
                cursoRepo.save(new Curso(null, "C1005", "Metodologías Ágiles", 2, "Semipresencial", 12));
                cursoRepo.save(new Curso(null, "C1006", "Seguridad Informática", 3, "Virtual", 5));
                System.out.println("✅ Datos de cursos cargados correctamente");
            }
        };
    }
}