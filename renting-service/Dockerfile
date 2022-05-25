FROM node:18-alpine
WORKDIR /root
COPY package*.json ./
COPY app.js .
COPY bin bin
COPY routes routes
COPY views views
RUN npm install
EXPOSE 3000
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
