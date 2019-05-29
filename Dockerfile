# Base Image
FROM node:10.15.3
MAINTAINER loveloper44@gmail.com

# Download Dockerize
RUN apt-get update && apt-get install -y wget
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

# Create App Directory
RUN mkdir /app
RUN mkdir /app/apis
RUN mkdir /app/content

WORKDIR /app

# Install Dependencies
COPY package*.json /app/
RUN npm install

# Move Code
COPY index.js /app

EXPOSE 1080
CMD ["npm", "start"]
