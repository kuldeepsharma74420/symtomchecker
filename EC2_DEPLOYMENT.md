# EC2 Deployment Guide

## Prerequisites on EC2
1. Docker installed
2. Docker Compose installed
3. Port 80 and 8080 open in Security Group

## Deployment Steps

### 1. Install Docker (if not installed)
```bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
```

### 2. Install Docker Compose (if not installed)
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Upload Project to EC2
```bash
# From your local machine
scp -r -i your-key.pem Symptom-Checker ubuntu@your-ec2-ip:~/
```

### 4. Build Backend JAR (if not already built)
```bash
cd ~/Symptom-Checker/backend
# If Maven is installed:
mvn clean package -DskipTests
```

### 5. Deploy with Docker Compose
```bash
cd ~/Symptom-Checker
docker-compose up -d --build
```

### 6. Check Logs
```bash
docker-compose logs -f
```

### 7. Access Application
- Frontend: http://your-ec2-public-ip
- Backend API: http://your-ec2-public-ip:8080

## Troubleshooting

### Check container status
```bash
docker-compose ps
```

### View specific service logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### Restart services
```bash
docker-compose restart
```

### Stop and remove all containers
```bash
docker-compose down
```

### Rebuild after changes
```bash
docker-compose down
docker-compose up -d --build
```

## Security Group Configuration
Ensure these ports are open:
- Port 80 (HTTP) - Frontend
- Port 8080 (HTTP) - Backend API
- Port 22 (SSH) - For access
