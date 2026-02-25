# Jenkins CI/CD Setup Guide

## Prerequisites

### 1. Jenkins Server Requirements
- Jenkins 2.x or higher
- Installed Plugins:
  - Pipeline
  - Git
  - AWS Steps Plugin
  - Docker Pipeline
  - Terraform Plugin (optional)

### 2. Required Tools on Jenkins Server
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker jenkins

# Install Maven
sudo yum install maven -y

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

## Jenkins Configuration

### Step 1: Configure AWS Credentials

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Manage Credentials**
2. Click **(global)** → **Add Credentials**
3. Select **AWS Credentials**
4. Add:
   - **ID**: `aws-credentials`
   - **Access Key ID**: Your AWS Access Key
   - **Secret Access Key**: Your AWS Secret Key
   - **Description**: AWS Credentials for ECS Deployment

### Step 2: Configure Terraform Variables as Jenkins Credentials

Add these as **Secret text** credentials:

1. **DB Password**
   - ID: `db-password`
   - Secret: Your database password

2. **JWT Secret**
   - ID: `jwt-secret`
   - Secret: Your JWT secret key

3. **Azure OpenAI Key**
   - ID: `azure-ai-key`
   - Secret: Your Azure OpenAI API key

### Step 3: Create Jenkins Pipeline Job

1. **New Item** → Enter name: `symptom-checker-deployment`
2. Select **Pipeline**
3. Configure:
   - **Description**: Symptom Checker Application Deployment
   - **Build Triggers**: 
     - ✅ GitHub hook trigger for GITScm polling (if using GitHub)
     - ✅ Poll SCM: `H/5 * * * *` (every 5 minutes)
   
4. **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your Git repository URL
   - **Credentials**: Add your Git credentials
   - **Branch**: `*/main` or `*/master`
   - **Script Path**: `Jenkinsfile`

5. Click **Save**

## Pipeline Parameters

The pipeline supports these parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| ACTION | Choice | deploy | Action to perform: deploy, destroy, or plan |
| SKIP_TESTS | Boolean | false | Skip running Maven tests |
| AUTO_APPROVE | Boolean | false | Auto-approve Terraform changes |

## Environment Variables to Configure

Update in Jenkinsfile if needed:

```groovy
environment {
    AWS_REGION = 'us-east-1'              // Your AWS region
    AWS_ACCOUNT_ID = '975371763536'       // Your AWS Account ID
    ECS_CLUSTER = 'enred-cluster'         // Your ECS cluster name
}
```

## Running the Pipeline

### Option 1: Deploy Application
1. Go to your Jenkins job
2. Click **Build with Parameters**
3. Select:
   - ACTION: `deploy`
   - SKIP_TESTS: `false` (or `true` to skip tests)
   - AUTO_APPROVE: `false` (requires manual approval)
4. Click **Build**

### Option 2: Plan Only (Dry Run)
1. Click **Build with Parameters**
2. Select:
   - ACTION: `plan`
3. Click **Build**

### Option 3: Destroy Infrastructure
1. Click **Build with Parameters**
2. Select:
   - ACTION: `destroy`
   - AUTO_APPROVE: `false` (recommended for safety)
3. Click **Build**

## Pipeline Stages Explained

1. **Checkout**: Clones the repository
2. **Build Backend**: Compiles Spring Boot application with Maven
3. **Build Docker Images**: Builds frontend and backend Docker images in parallel
4. **Push to ECR**: Pushes images to AWS ECR
5. **Terraform Init**: Initializes Terraform
6. **Terraform Plan**: Creates execution plan
7. **Terraform Apply**: Applies infrastructure changes (requires approval)
8. **Update ECS Services**: Forces new deployment with latest images
9. **Wait for Deployment**: Waits for services to stabilize
10. **Get Application URL**: Displays the ALB URL

## Monitoring the Deployment

### View Build Console Output
- Click on the build number → **Console Output**

### Check ECS Service Status
```bash
aws ecs describe-services \
  --cluster enred-cluster \
  --services symptom-checker-frontend-service symptom-checker-backend-service \
  --region us-east-1
```

### View Application Logs
```bash
# Backend logs
aws logs tail /ecs/symptom-checker-backend --follow

# Frontend logs
aws logs tail /ecs/symptom-checker-frontend --follow
```

## Troubleshooting

### Issue: Docker permission denied
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue: AWS credentials not found
- Verify AWS credentials are configured in Jenkins
- Check IAM permissions include:
  - ECR: Full access
  - ECS: Full access
  - EC2: Full access
  - RDS: Full access
  - IAM: PassRole permission

### Issue: Terraform state locked
```bash
# Manually unlock (use with caution)
cd terraform
terraform force-unlock <LOCK_ID>
```

### Issue: ECS service fails to stabilize
- Check CloudWatch logs for errors
- Verify security group rules
- Check target group health checks

## Security Best Practices

1. **Never commit credentials** to Git
2. **Use Jenkins credentials** for all secrets
3. **Enable RBAC** in Jenkins for access control
4. **Use separate AWS accounts** for dev/staging/prod
5. **Enable audit logging** in Jenkins
6. **Regularly update** Jenkins and plugins

## Webhook Setup (Optional)

### For GitHub:
1. Go to your GitHub repository → **Settings** → **Webhooks**
2. Click **Add webhook**
3. Payload URL: `http://<jenkins-url>/github-webhook/`
4. Content type: `application/json`
5. Events: **Just the push event**
6. Click **Add webhook**

### For GitLab:
1. Go to your GitLab project → **Settings** → **Webhooks**
2. URL: `http://<jenkins-url>/project/<job-name>`
3. Trigger: **Push events**
4. Click **Add webhook**

## Rollback Strategy

If deployment fails:

1. **Rollback ECS Service**:
   ```bash
   aws ecs update-service \
     --cluster enred-cluster \
     --service symptom-checker-backend-service \
     --task-definition symptom-checker-backend-task:<previous-revision> \
     --region us-east-1
   ```

2. **Rollback using previous Docker image**:
   ```bash
   # Tag previous image as latest
   docker tag ${ECR_BACKEND_REPO}:<previous-tag> ${ECR_BACKEND_REPO}:latest
   docker push ${ECR_BACKEND_REPO}:latest
   
   # Force new deployment
   aws ecs update-service --cluster enred-cluster --service symptom-checker-backend-service --force-new-deployment
   ```

## Cost Optimization

- **Use spot instances** for Jenkins agents
- **Schedule Jenkins** to shut down during non-working hours
- **Clean up old Docker images** regularly
- **Use ECS task auto-scaling** based on load

## Next Steps

1. Set up Jenkins server with required tools
2. Configure AWS credentials in Jenkins
3. Create the pipeline job
4. Run a test deployment
5. Set up monitoring and alerts
6. Configure webhooks for automatic deployments

## Support

For issues:
- Check Jenkins console output
- Review CloudWatch logs
- Verify AWS permissions
- Check Terraform state
