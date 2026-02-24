#!/bin/bash
# Quick rebuild script for WSL

echo "Stopping containers..."
docker-compose down

echo "Rebuilding backend JAR..."
cd backend
mvn clean package -DskipTests
cd ..

echo "Starting containers..."
docker-compose up -d --build

echo "Waiting for services to start..."
sleep 10

echo "Checking status..."
docker-compose ps

echo ""
echo "View logs with: docker-compose logs -f"
echo "Access frontend at: http://localhost"
