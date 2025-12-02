# Build multi-etapa para la aplicación Spring Boot blockchain

# Etapa de construcción
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar pom.xml y descargar dependencias (capa cacheada)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar aplicación
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Crear directorio para la base de datos SQLite
RUN mkdir -p /app/data

# Copiar JAR desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Exponer puerto de la aplicación
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
