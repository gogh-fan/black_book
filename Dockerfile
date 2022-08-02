FROM node:16 AS builder
WORKDIR /blackbook/back
COPY . .
RUN npm install
RUN npm run build

FROM node:16-alpine
WORKDIR /blackbook/back
ENV NODE_ENV production
COPY --from=builder /blackbook/back/dist ./
EXPOSE 4000
CMD node dist/main
