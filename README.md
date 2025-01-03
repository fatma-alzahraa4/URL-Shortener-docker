# URL-Shortener-docker

# Installation
git clone https://github.com/fatma-alzahraa4/URL-Shortener-docker.git
npm install  #install dependencies if doesn't use docker

# Environment variables:
env file will be inside config directory (config/.env)
DB_CONNECTION = mongodb+srv://fatmaalzahraakhaled91:o6iiN8CVv9V61mGI@cluster0.ga0ji.mongodb.net/URL_Shortener
REDIS_PORT = 6379
REDIS_HOST = finer-bedbug-27497.upstash.io
REDIS_PASSWORD = AWtpAAIjcDEzMjYzYTgyNGRmYTM0OTQ4OTM2OTY2NGRjZjgxNTc4M3AxMA
PORT = 5000

# Running the Application with Docker
docker-compose up --build

# Access the application:
The Node.js application will be accessible at http://localhost:3200 and http://localhost:5000 locally.

# Running the Message Queue (Redis pub/sub):
The message queue system is already set up in the application.
To ensure it works, check the logs of the node_app container for messages like:
Received message: *message*
Processed analytics event for shortId: *shortId*

