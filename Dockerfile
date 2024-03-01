# Use Node 
FROM node:latest

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# Change the working directory on the Docker image to /app
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the /app directory
COPY /nodeJsProject/package.json /nodeJsProject/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 80

# Start the application
CMD npm start

CMD [ "node", "nodeJsProject.js" ]
