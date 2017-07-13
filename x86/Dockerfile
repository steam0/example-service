# Download OS
FROM    centos:centos6

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN     yum install -y epel-release

# Install Node.js and npm
RUN 	curl -sL https://rpm.nodesource.com/setup_6.x | bash -
RUN     yum install -y nodejs

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# Bundle app source
COPY webapp.js /src/

EXPOSE 3000
CMD ["node", "/src/webapp.js"]
