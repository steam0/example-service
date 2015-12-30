# Initialize
FROM ubuntu
MAINTAINER  Henrik Stene <hstene@me.com>

# Install nodejs
RUN apt-get update
RUN apt-get -y install nodejs
RUN apt-get -y install npm

# Add file
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# Go to app root
WORKDIR /opt/app
ADD webapp.js /opt/app
ADD README.md /opt/app

#Exposing ports
EXPOSE 3000

# Start NODE app
CMD ["node", "webapp.js"]