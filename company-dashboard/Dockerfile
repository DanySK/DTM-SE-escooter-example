FROM node:18.2.0-alpine3.14
WORKDIR /service
COPY *.js ./
COPY *.json ./
COPY public/* public/
RUN npm install
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
