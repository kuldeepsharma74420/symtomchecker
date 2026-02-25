# Jenkins Pipeline Quick Reference

## 📁 Available Jenkinsfiles

| File | Description | Use Case |
|------|-------------|----------|
| `Jenkinsfile` | Standard pipeline | Production deployments with manual approval |
| `Jenkinsfile-simple` | Beginner-friendly | Quick deployments, learning |
| `Jenkinsfile-advanced` | Full-featured | Advanced use with all options |

## 🚀 Quick Start

### 1. Choose Your Jenkinsfile

**For beginners**: Use `Jenkinsfile-simple`
```bash
# Rename it to Jenkinsfile
mv Jenkinsfile-simple Jenkinsfile
```

**For production**: Use `Jenkinsfile` (default)

**For advanced users**: Use `Jenkinsfile-advanced`

### 2. Update Configuration

Edit the Jenkinsfile and update:
```groovy
AWS_ACCOUNT_ID = '975371763536'  // Your AWS Account ID
AWS_REGION = 'us-east-1'         // Your AWS Region
```

### 3. Create Jenkins Job

1. Jenkins Dashboard → **New Item**
2. Enter name: `symptom-checker-deploy`
3. Select: **Pipeline**
4. Pipeline → Definition: **Pipeline script from SCM**
5. SCM: **Git**
6. Repository URL: Your Git repo
7. Script Path: `Jenkinsfile`
8. Save

### 4. Run the Pipeline

Click **Build Now** or **Build with Parameters**

## 🎛️ Pipeline Parameters (Standard & Advanced)

### Standard Jenkinsfile
- **ACTION**: deploy, destroy, plan
- **SKIP_TESTS**: Skip Maven tests
- **AUTO_APPROVE**: Auto-approve Terraform

### Advanced Jenkinsfile (Additional)
- **ENVIRONMENT**: production, staging, development
- **SKIP_BACKEND_BUILD**: Skip backend build
- **SKIP_FRONTEND_BUILD**: Skip frontend build

## 📊 Pipeline Stages

### Simple Pipeline (8 stages)
1. ✅ Checkout Code
2. ✅ Build Backend
3. ✅ Build Docker Images
4. ✅ Push to ECR
5. ✅ Deploy Infrastructure
6. ✅ Update ECS Services
7. ✅ Wait for Deployment
8. ✅ Get Application URL

### Standard Pipeline (10 stages)
All simple stages + Terraform Plan + Destroy option

### Advanced Pipeline (14 stages)
All standard stages + Validate + Tests + Security Scan + Health Check

## 🔧 Common Jenkins Commands

### View Build Status
```bash
# From Jenkins CLI
java -jar jenkins-cli.jar -s http://jenkins-url/ build symptom-checker-deploy
```

### Trigger Build via API
```bash
curl -X POST http://jenkins-url/job/symptom-checker-deploy/build \
  --user username:token
```

### Get Build Console Output
```bash
curl http://jenkins-url/job/symptom-checker-deploy/lastBuild/consoleText \
  --user username:token
```

## 🐛 Troubleshooting

### Build Fails at "Build Backend"
**Problem**: Maven not found
**Solution**: 
```bash
sudo yum install maven -y
```

### Build Fails at "Push to ECR"
**Problem**: Docker permission denied
**Solution**:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Build Fails at "Deploy Infrastructure"
**Problem**: AWS credentials not configured
**Solution**: Configure AWS credentials in Jenkins (see JENKINS_SETUP.md)

### Build Fails at "Wait for Deployment"
**Problem**: ECS service not stabilizing
**Solution**: Check CloudWatch logs
```bash
aws logs tail /ecs/symptom-checker-backend --follow
```

## 📝 Manual Deployment Steps (Without Jenkins)

If Jenkins is not available, deploy manually:

```bash
# 1. Build backend
cd backend
mvn clean package
docker build -t symptom-checker-backend .

# 2. Build frontend
cd ../frontend
docker build -t symptom-checker-frontend .

# 3. Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 975371763536.dkr.ecr.us-east-1.amazonaws.com

# 4. Tag and push
docker tag symptom-checker-backend:latest 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest
docker push 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest

docker tag symptom-checker-frontend:latest 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest
docker push 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest

# 5. Deploy with Terraform
cd ../terraform
terraform init
terraform apply

# 6. Update ECS services
aws ecs update-service --cluster enred-cluster --service symptom-checker-backend-service --force-new-deployment
aws ecs update-service --cluster enred-cluster --service symptom-checker-frontend-service --force-new-deployment
```

## 🔄 Rollback Procedure

### Via Jenkins
1. Build with Parameters
2. ACTION: `deploy`
3. Use previous Git commit/tag

### Manual Rollback
```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster enred-cluster \
  --service symptom-checker-backend-service \
  --task-definition symptom-checker-backend-task:PREVIOUS_REVISION

# Or use previous Docker image
docker pull 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:PREVIOUS_TAG
docker tag 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:PREVIOUS_TAG \
           975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest
docker push 975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest
aws ecs update-service --cluster enred-cluster --service symptom-checker-backend-service --force-new-deployment
```

## 📈 Monitoring

### Check Pipeline Status
- Jenkins Dashboard → Job → Build History

### Check ECS Deployment
```bash
aws ecs describe-services --cluster enred-cluster --services symptom-checker-backend-service
```

### View Application Logs
```bash
aws logs tail /ecs/symptom-checker-backend --follow
aws logs tail /ecs/symptom-checker-frontend --follow
```

### Check Application Health
```bash
# Get ALB URL
cd terraform
terraform output alb_url

# Test frontend
curl http://<alb-url>

# Test backend
curl http://<alb-url>/api/health
```

## 💡 Best Practices

1. ✅ Always test in staging before production
2. ✅ Use manual approval for production deployments
3. ✅ Keep Jenkinsfile in version control
4. ✅ Use Jenkins credentials for secrets
5. ✅ Enable build notifications (Slack, Email)
6. ✅ Archive build artifacts
7. ✅ Set up automated backups
8. ✅ Monitor build times and optimize
9. ✅ Use Blue-Green deployment for zero downtime
10. ✅ Document all pipeline changes

## 🔗 Useful Links

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Documentation](https://docs.docker.com/)

## 📞 Support

For issues:
1. Check Jenkins console output
2. Review CloudWatch logs
3. Verify AWS credentials and permissions
4. Check Terraform state
5. Refer to JENKINS_SETUP.md for detailed setup
