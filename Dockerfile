FROM node:20-alpine
WORKDIR /In-Orbit
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5432
CMD ["npm", "start"]
