FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/build ./
RUN npm install -g serve
EXPOSE 3000 
CMD serve -s