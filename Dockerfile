# Usar una imagen oficial de Node.js como base
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación al contenedor
COPY . .

# Exponer el puerto en el que se ejecutará la API
EXPOSE 4000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "run", "dev"]
