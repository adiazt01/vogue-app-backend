FROM node:22-alpine

WORKDIR /usr/src/app

# Copia los archivos de dependencias primero
COPY package.json yarn.lock ./

# Instala dependencias con Yarn
RUN yarn install --frozen-lockfile

# Copia el resto del código fuente
COPY . .

# Expone el puerto de la app
EXPOSE 3000

# Comando por defecto (ajusta según tu script de inicio)
CMD ["yarn", "start:dev"]