# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.0.0
FROM node:${NODE_VERSION}-alpine as build

RUN npm install typescript -g

# Build the application as a non-root user.
USER node

WORKDIR /home/node/app

# Copy the rest of the source files into the image.
COPY --chown=node:node . .

RUN npm install

# Compile
RUN tsc

FROM node:${NODE_VERSION}-alpine as run
ENV NODE_ENV production
COPY --from=build /home/node/app/node_modules /home/node/app/node_modules
COPY --from=build /home/node/app/out /home/node/app

VOLUME [ "/data" ]
WORKDIR /data

USER node

ENTRYPOINT ["node", "/home/node/app/cli.js"]