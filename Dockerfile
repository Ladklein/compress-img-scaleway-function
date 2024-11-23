FROM node:20-alpine3.19

RUN apk update && \
    apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json .

RUN npm install


COPY . .

EXPOSE 5001

CMD [ "npm", "run", "dev"]