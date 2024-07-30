FROM node:18 as base

WORKDIR /app

RUN git clone git@github.com:deriv-com/p2p.git && \
    cd p2p && \
    npm install && \
    npm install -g serve && \
    npm run build

EXPOSE 4000

ENTRYPOINT ["serve"]

CMD ["-s", "p2p/dist", "-l", "4000"]
