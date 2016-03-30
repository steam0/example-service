#Download OS
FROM	resin/rpi-raspbian

# Install CURL
RUN	apt-get update
RUN 	apt-get install --yes curl
RUN	curl -sL https://deb.nodesource.com/setup_5.x | bash -

# Install Node.js and npm
RUN     apt-get install --yes nodejs
RUN	apt-get install --yes build-essential
RUN	apt-get install --yes npm

# Install app dependencies
COPY 	package.json /src/package.json
RUN 	cd /src; npm install

# Bundle app source
COPY 	webapp.js /src/

EXPOSE 3000
CMD 	["node", "/src/webapp.js"]
