# Quick Start Guide

## What You MUST Update Before Deployment

### 1. Get Your AWS Account ID
```bash
aws sts get-caller-identity --query Account --output text
```

### 2. Edit `terraform.tfvars`

Update these values:

```hcl
# Line 15-16: Replace <account-id> with your AWS Account ID
frontend_image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest"
backend_image  = "123456789012.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest"

# Line 20: CHANGE THIS PASSWORD!
db_password = "YourSecurePassword123!"
```

## Deployment Commands (In Order)

```bash
# 1. Initialize Terraform
cd terraform
terraform init

# 2. Create ECR repositories only
terraform apply -target=module.ecr

# 3. Build and push backend image
cd ../backend
mvn clean package
docker build -t symptom-checker-backend .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com
docker tag symptom-checker-backend:latest <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest
docker push <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest

# 4. Build and push frontend image
cd ../frontend
docker build -t symptom-checker-frontend .
docker tag symptom-checker-frontend:latest <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest
docker push <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest

# 5. Deploy everything
cd ../terraform
terraform apply

# 6. Get your application URL
terraform output alb_url
```

## What Gets Created

✅ VPC with public and private subnets  
✅ Internet Gateway and NAT Gateways  
✅ Application Load Balancer  
✅ ECS Fargate Cluster (enred-cluster)  
✅ Frontend Service (2 tasks)  
✅ Backend Service (2 tasks)  
✅ RDS MySQL Database  
✅ Security Groups  
✅ Auto-scaling policies  

## Estimated Deployment Time

- ECR creation: ~1 minute
- Image push: ~5-10 minutes (depends on internet speed)
- Full infrastructure: ~15-20 minutes

## After Deployment

Your application will be available at:
```
http://<alb-dns-name>
```

Backend API will be at:
```
http://<alb-dns-name>/api/*
```

## To Destroy Everything

```bash
cd terraform
terraform destroy
```

## Cost Warning

This infrastructure costs approximately **$150-180/month**. 

Main costs:
- NAT Gateways: ~$65/month (biggest cost)
- ECS Fargate: ~$50-80/month
- RDS: ~$15/month
- ALB: ~$20/month
