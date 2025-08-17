# Node.js resmi image kullanıyoruz
FROM node:18

# Çalışma dizini oluştur
WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./

# Production için bağımlılıkları yükle
RUN npm install --production

# Tüm kodları kopyala
COPY . .

# Railway’in vereceği portu dinle
ENV PORT=8000
EXPOSE 8000

# Başlatma komutu
CMD ["npm", "start"]
