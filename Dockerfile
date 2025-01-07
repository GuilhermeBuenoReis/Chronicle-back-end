FROM node:20-alpine
WORKDIR /In-orbit
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5432
CMD ["npm", "start"]
