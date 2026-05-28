package com.examen.api;

import com.examen.api.model.Producto;
import com.examen.api.repository.ProductoRepository;
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
    CommandLineRunner initData(ProductoRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Producto(null, "Café Americano", "Bebidas", 5.50, 10));
                repo.save(new Producto(null, "Café Latte", "Bebidas", 7.50, 8));
                repo.save(new Producto(null, "Sánguche de Pollo", "Comidas", 12.90, 5));
                repo.save(new Producto(null, "Sánguche de Jamón", "Comidas", 10.90, 3));
                repo.save(new Producto(null, "Queque de Naranja", "Postres", 4.50, 0));
                repo.save(new Producto(null, "Alfajor", "Postres", 3.50, 2));
                repo.save(new Producto(null, "Jugo de Papaya", "Bebidas", 7.00, 0));
                repo.save(new Producto(null, "Empanada de Carne", "Comidas", 6.50, 4));
                System.out.println("✅ Datos de productos cargados correctamente");
            }
        };
    }
}