FROM node:latest AS build
WORKDIR /usr/src/app
COPY package.json tsconfig.json /usr/src/app/
RUN npm install

COPY  ./src /usr/src/app/src


FROM node:lts-alpine@sha256:28bed508446db2ee028d08e76fb47b935defa26a84986ca050d2596ea67fd506

RUN apk add dumb-init
RUN apk --no-cache add --virtual builds-deps build-base
# Specifies that packages should run as prod
ENV NODE_ENV production
WORKDIR /usr/src/app
# Changes ownership of files from root to node
COPY --chown=node:node --from=build /usr/src/app /usr/src/app/

# COPY --chown=node:node --from=build /build/node_modules /usr/src/app/node_modules
# COPY --from=build /usr/src/app /usr/src/app
RUN npm run build
# COPY .env .
RUN chmod -w /usr/src/app

USER node

CMD ["dumb-init", "node", "-r", "./dist/app.js"]
EXPOSE 3000