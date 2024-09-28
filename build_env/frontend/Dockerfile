# Fetching the latest node image on apline linux
FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./frontend/package.json ./
RUN npm install

# Copying all the files in our project
COPY ./frontend/. .

ENTRYPOINT ["npm", "run"]
CMD ["start"]
