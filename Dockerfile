FROM node:18

# Setup workdir and copy package.json
WORKDIR /usr/src/app
COPY package*.json ./

# Install dependencies with ignore flag
RUN npm i --force

COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

CMD ["npm", "start"]
