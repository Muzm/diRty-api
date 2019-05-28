FROM node:10.13.0
COPY . /app
WORKDIR /app
RUN npm install 
EXPOSE 3002 80
CMD npm start
