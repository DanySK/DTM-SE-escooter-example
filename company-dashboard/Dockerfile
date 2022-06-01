FROM node:18-alpine
WORKDIR /root
COPY package*.json ./
COPY *.js ./
RUN npm install
EXPOSE 5200
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
