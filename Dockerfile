FROM node:10.13.0
COPY . /app
WORKDIR /app
RUN npm install 
EXPOSE 3002 3001
CMD npm start
