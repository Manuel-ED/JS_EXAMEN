FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar el pom.xml y el código fuente
COPY pom.xml .
COPY src ./src

# Instalar Maven y compilar
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]