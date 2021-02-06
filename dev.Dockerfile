#Build backend
FROM node:15.7.0 AS microservice
WORKDIR /app/server
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci
CMD ["npm", "start"]