# Terraform Infrastructure for Symptom Checker Application

This Terraform configuration deploys a complete AWS infrastructure for the Symptom Checker application including:
- VPC with public and private subnets
- ECR repositories for Docker images
- Application Load Balancer (ALB)
- ECS Fargate cluster with frontend and backend services
- RDS MySQL database
- Auto-scaling configuration

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```

2. **Terraform** installed (version >= 1.0)
   ```bash
   terraform --version
   ```

3. **Docker** installed for building images

## Deployment Steps

### Step 1: Update Configuration

Edit `terraform.tfvars` and update the following:

1. **AWS Account ID** - Get it by running:
   ```bash
   aws sts get-caller-identity --query Account --output text
   ```

2. Update image URLs in `terraform.tfvars`:
   ```hcl
   frontend_image = "<YOUR-ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest"
   backend_image  = "<YOUR-ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest"
   ```

3. **Change database password**:
   ```hcl
   db_password = "YourSecurePassword123!"
   ```

4. **Verify Azure OpenAI credentials** are correct

### Step 2: Create ECR Repositories First

```bash
cd terraform
terraform init
terraform apply -target=module.ecr
```

Note the ECR repository URLs from the output.

### Step 3: Build and Push Docker Images

#### Build Backend
```bash
cd ../backend
mvn clean package
docker build -t symptom-checker-backend .
```

#### Tag and Push Backend
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com

docker tag symptom-checker-backend:latest <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest

docker push <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest
```

#### Build Frontend
```bash
cd ../frontend
docker build -t symptom-checker-frontend .
```

#### Tag and Push Frontend
```bash
docker tag symptom-checker-frontend:latest <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest

docker push <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest
```

### Step 4: Deploy Complete Infrastructure

```bash
cd ../terraform
terraform apply
```

Review the plan and type `yes` to confirm.

**Deployment time**: Approximately 15-20 minutes

### Step 5: Get Application URL

After deployment completes, get the ALB URL:
```bash
terraform output alb_url
```

Visit the URL in your browser to access the application.

## Important Outputs

After deployment, Terraform will output:
- `alb_url` - Your application URL
- `ecr_frontend_repository_url` - Frontend ECR repository
- `ecr_backend_repository_url` - Backend ECR repository
- `rds_endpoint` - Database endpoint
- `ecs_cluster_name` - ECS cluster name

## Infrastructure Components

### Networking
- **VPC**: 10.0.0.0/16
- **Public Subnets**: 2 subnets across 2 AZs (for ALB)
- **Private Subnets**: 2 subnets across 2 AZs (for ECS tasks and RDS)
- **NAT Gateways**: 2 (one per AZ for high availability)

### Compute
- **ECS Cluster**: enred-cluster
- **Frontend Service**: 2 tasks (auto-scales 2-4)
- **Backend Service**: 2 tasks (auto-scales 2-4)
- **Task CPU/Memory**:
  - Frontend: 0.5 vCPU, 1 GB
  - Backend: 1 vCPU, 2 GB

### Database
- **Engine**: MySQL 8.0
- **Instance**: db.t3.micro
- **Storage**: 20 GB gp3
- **Database Name**: symptom_checker

### Load Balancer
- **Type**: Application Load Balancer
- **Routing**:
  - `/` → Frontend
  - `/api/*` → Backend

## Cost Estimation

Approximate monthly costs (us-east-1):
- NAT Gateways: ~$65/month (2 gateways)
- ECS Fargate: ~$50-80/month (4 tasks)
- RDS db.t3.micro: ~$15/month
- ALB: ~$20/month
- **Total**: ~$150-180/month

## Updating the Application

### Update Backend
```bash
cd backend
mvn clean package
docker build -t symptom-checker-backend .
docker tag symptom-checker-backend:latest <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest
docker push <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest

# Force new deployment
aws ecs update-service --cluster enred-cluster --service symptom-checker-backend-service --force-new-deployment
```

### Update Frontend
```bash
cd frontend
docker build -t symptom-checker-frontend .
docker tag symptom-checker-frontend:latest <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest
docker push <ACCOUNT-ID>.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest

# Force new deployment
aws ecs update-service --cluster enred-cluster --service symptom-checker-frontend-service --force-new-deployment
```

## Troubleshooting

### Check ECS Service Status
```bash
aws ecs describe-services --cluster enred-cluster --services symptom-checker-backend-service symptom-checker-frontend-service
```

### View Logs
```bash
# Backend logs
aws logs tail /ecs/symptom-checker-backend --follow

# Frontend logs
aws logs tail /ecs/symptom-checker-frontend --follow
```

### Check Target Health
```bash
aws elbv2 describe-target-health --target-group-arn <TARGET-GROUP-ARN>
```

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

**Warning**: This will delete all resources including the database. Make sure to backup any important data first.

## Security Notes

1. **Database Password**: Change the default password in `terraform.tfvars`
2. **Secrets**: For production, consider using AWS Secrets Manager
3. **HTTPS**: Add SSL certificate to ALB for production use
4. **Network**: RDS and ECS tasks are in private subnets (not publicly accessible)

## Support

For issues or questions, refer to:
- AWS ECS Documentation: https://docs.aws.amazon.com/ecs/
- Terraform AWS Provider: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
