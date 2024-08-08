FROM --platform=$BUILDPLATFORM node:18 as build

ARG BUILDPLATFORM=linux/amd64

WORKDIR /app

ENV HUSKY=0

COPY . .

RUN npm install

ENV NODE_ENV=production
RUN npm run build

FROM --platform=$BUILDPLATFORM node:lts-alpine3.20

RUN npm install -g serve

COPY --from=build /app/dist /dist

EXPOSE 4000

ENTRYPOINT ["serve"]

CMD ["-s", "dist", "-l", "4000"]
