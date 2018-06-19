FROM node:10
MAINTAINER Michael Vezina <michael.vezina@myant.ca>

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY ./package*.json ./
RUN npm install

# Copy source folder
COPY . .
