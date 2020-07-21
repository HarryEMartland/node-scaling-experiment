FROM node:alpine

RUN apk add curl

COPY ./ /app

WORKDIR /app

ENTRYPOINT ["node","bin/www"]