FROM endeveit/docker-jq AS deps

COPY package.json /tmp

RUN jq '{ dependencies, devDependencies, scripts }' < /tmp/package.json > /tmp/deps.json

# build environment
FROM node:14.8.0-alpine AS builder

WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin:$PATH

COPY --from=deps /tmp/deps.json ./package.json
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY tsconfig*.json ./

COPY public public
COPY src src

RUN yarn run build

# production environment
FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
