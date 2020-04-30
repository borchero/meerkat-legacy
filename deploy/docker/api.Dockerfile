FROM node:13.13.0-alpine3.10

WORKDIR /app
COPY package.json /app/package.json
RUN npm install

COPY . /app
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["node", "dist/main"]
