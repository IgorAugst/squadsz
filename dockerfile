FROM node
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install --production
COPY . .
CMD ["npm", "start"]