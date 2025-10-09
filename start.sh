#!/bin/bash

echo "Instalando frontend..."
cd frontend
npm install
npm run build

echo "Frontend listo. Iniciando backend..."
cd ../backend
npm install
node index.js