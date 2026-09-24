FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --cache .npm-cache && rm -rf .npm-cache

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
