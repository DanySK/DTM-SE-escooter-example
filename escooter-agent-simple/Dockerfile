FROM node:20-alpine
WORKDIR /root
COPY package*.json ./
COPY *.js ./
RUN npm install
EXPOSE 5100
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
