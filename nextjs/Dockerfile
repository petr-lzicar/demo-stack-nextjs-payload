FROM node:20

WORKDIR /app

# Instalace systémových závislostí pro Sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*


COPY package*.json ./
RUN npm install

#COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
