FROM node:14.5.0-alpine3.10

WORKDIR /app
COPY api/package.json /app/package.json
RUN npm install --loglevel verbose

COPY api /app
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["node", "dist/main"]
