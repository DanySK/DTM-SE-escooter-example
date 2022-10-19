FROM node:19-alpine
WORKDIR /root
COPY package*.json ./
COPY *.js ./
RUN npm install
EXPOSE 5300
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
