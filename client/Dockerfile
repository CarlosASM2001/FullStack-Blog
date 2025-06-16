# Etapa 1: build de la app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: servidor web nginx para servir la app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Opcional: reemplazar config por defecto de nginx si lo necesitas
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
