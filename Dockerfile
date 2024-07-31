# Server Builder
FROM --platform=linux/arm64 public.ecr.aws/docker/library/node:16-alpine AS server-builder

WORKDIR /app

COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./server ./

RUN yarn build

# Client Builder
FROM --platform=linux/arm64 public.ecr.aws/docker/library/node:16-alpine AS client-builder

WORKDIR /app

COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./client ./

RUN yarn build

# Runner
FROM --platform=linux/arm64 public.ecr.aws/docker/library/node:16-alpine

RUN mkdir -p /home/node/app 
RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=server-builder /app/package.json ./

RUN yarn install --prod

COPY --chown=node:node --from=server-builder /app/build ./server
COPY --chown=node:node --from=client-builder /app/build ./client

CMD ["node", "server/app.js"]