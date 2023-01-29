FROM node:latest

# Create books directory
WORKDIR /usr/src/books

#copy package.json to workdir
COPY package.json ./

#install dependencies
RUN npm install

#copy application files to workdir
COPY . .

# create DB, run migrations, seeders etc...
RUN npm run dockerInstall

#expose application port
EXPOSE 3000

#run application 
CMD [ "npm", "start" ]