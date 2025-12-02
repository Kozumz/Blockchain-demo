# LEOCOIN Blockchain Frontend

Interfaz web moderna para la API de blockchain LEOCOIN, construida con React, TypeScript y Mantine UI.

## Características

- **Transacciones**: Crear y visualizar transacciones LEOCOIN
- **Blockchain**: Explorar todos los bloques de la cadena
- **Admin Panel**: Modificar bloques para demostrar detección de manipulación

## Tecnologías

- React 18 + TypeScript
- Mantine UI v7
- Vite
- Axios
- Tabler Icons

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Variables de Entorno

Crea un archivo `.env` con:

```
VITE_API_URL=http://localhost:8080/api
```

## Docker

El frontend se ejecuta en Nginx en el puerto 3000 cuando se usa docker-compose.

```bash
# Desde el directorio raíz del proyecto
docker-compose up -d
```

Accede a la aplicación en: http://localhost:3000
