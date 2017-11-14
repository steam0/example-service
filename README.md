# example-service
Service skeleton

# Build
docker build -t example-service -f [x86|ARM]/Dockerfile .

# Run
docker run -d -p 3000:3000 --name example-service --restart always -e AUTH_SERVER_IP=ip -e AUTH_SERVER_PORT=port example-service
