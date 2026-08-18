FROM node:20-alpine

# Install Python and dependencies for PDF extractor
RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Install python dependencies for backend/src/services/extract_text.py
RUN pip install --no-cache-dir --break-system-packages pypdf python-docx reportlab

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
