FROM node:18-alpine as build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]