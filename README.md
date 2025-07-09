
# Blog FullStack con Docker 🐳

Este proyecto implementa una aplicación de blog simple utilizando una arquitectura de microservicios containerizada con Docker. La aplicación consta de:
- **Frontend**: Interfaz en React.js servida por Nginx
- **Backend**: API RESTful en Node.js/Express
- **Base de Datos**: MongoDB con persistencia de datos

## Prerrequisitos
- Docker Engine 20.10+
- Docker Compose 2.5+
- Git (opcional)

## Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone https://github.com/CarlosASM2001/FullStack-Blog.git
cd fullstack-blog
```

### 2. Configurar Variables de entorno
Crear archivo ` .env ` en la raíz del proyecto

Editar con las credenciales:
```bash
# Raíz del proyecto/.env
MONGO_USER=bloguser
MONGO_PASS=blogpass
MONGO_DB=blogdb
API_URL=http://backend:4000
```

### 3. Despliegue con Docker Compose
Construir imágenes e iniciar contenedores:
```bash
docker-compose up -d --build
```
Verificar estado de los servicios:
```bash
docker-compose ps
```
### 4. Variables de entorno requeridas


| Variable    | Example               | Description                           |
| :---------- | :-------------------- | :------------------------------------ |
| `MONGO_USER`| `bloguser`           | Usuario administrador de MongoDB username        |
| `MONGO_PASS`| `blogpass`   | MongoDB password                      |
| `MONGO_DB`  | `blogdb`              | Database name                         |
| `API_URL`   | `http://backend:4000` | Internal API URL for the frontend     |

**Note:** El archivo `.env` es obligatorio para el funcionamiento correcto.

## Acceso a la Aplicación

Una vez iniciados los contenedores, accede a:

| Servicio      | URL                                  |
| :------------ | :----------------------------------- |
| Frontend      | [http://localhost:3000](http://localhost:3000) |
| Backend (API) | [http://localhost:4000/users](http://localhost:4000/users) |
| MongoDB       | `mongodb://<MONGO_USER>:<MONGO_PASS>@localhost:27017/<MONGO_DB>?authSource=admin` (Compass) |

## Administracion de la aplicación
```bash
# Detener todos los servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart frontend

# Ver logs en tiempo real
docker-compose logs -f backend

# Eliminar todos los datos persistentes
docker-compose down -v
```

## Estructura del Proyecto
```bash
.
├── .env                     # Variables de entorno
├── docker-compose.yml       # Configuración de servicios
├── client/                  # Frontend (React)
│   ├── Dockerfile           # Configuración Docker para frontend
│   ├── nginx.conf           # Configuración de proxy inverso
│   ├── src/                 # Código fuente React
│   └── ...                  
├── api/                     # Backend (Node.js/Express)
│   ├── Dockerfile           # Configuración Docker para backend
│   ├── index.js             # Punto de entrada de la API
│   └── ...                  
└── README.md                # Este archivo
```