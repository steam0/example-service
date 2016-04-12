# HomeKontrolApp
This is a home kontrol app

# Build
docker build -t home-server-[c86|ARM] -f [x86|ARM]/Dockerfile .

# Run
docker run -d -p 3000:3000 --name="[your_container_name]" --restart="always" home-server-[system_name]
