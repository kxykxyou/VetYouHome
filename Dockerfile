FROM node:16.17.0

WORKDIR /vyhapp

# COPY source code and resources to target WORKDIR
COPY . .

# install node dependencies
RUN npm install

# port set to 3000
EXPOSE 3000

CMD ["node", "app.js"]