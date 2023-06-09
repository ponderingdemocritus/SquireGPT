FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install Python 3
RUN apk add --no-cache python3 py3-pip && \
    python3 -m ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools

# Set Python path
ENV PYTHONPATH=/usr/src/app

# Install build dependencies
RUN apk add --no-cache --virtual .build-deps \
    g++ \
    make \
    libc-dev \
    libgcc

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Remove build dependencies
RUN apk del .build-deps

# Copy app source
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]