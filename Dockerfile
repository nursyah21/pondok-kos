# Gunakan image Node.js sebagai dasar
#FROM node:20-alpine
FROM oven/bun:latest

# Install Bun
# RUN npm install -g bun

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
