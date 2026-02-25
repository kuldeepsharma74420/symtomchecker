aws_region         = "us-east-1"
project_name       = "symptom-checker"
environment        = "production"
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]

frontend_port   = 80
backend_port    = 8080
frontend_cpu    = 512
frontend_memory = 1024
backend_cpu     = 1024
backend_memory  = 2048
desired_count   = 2

# UPDATE THESE AFTER PUSHING IMAGES TO ECR
# Replace <account-id> with your AWS Account ID
frontend_image = "975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-frontend:latest"
backend_image  = "975371763536.dkr.ecr.us-east-1.amazonaws.com/symptom-checker-backend:latest"

# Database Configuration
db_instance_class = "db.t3.micro"
db_username       = "admin"
db_password       = "Kuldeep2002"  # CHANGE THIS!

# Application Secrets
jwt_secret          = "myVeryLongSecretKeyThatIsAtLeast256BitsLongForJWTSecurity1234567890"
azure_ai_endpoint   = "https://pstestopenaidply-2o475m7f43aoa.openai.azure.com/"
azure_ai_key        = "95a94311e4a84882a67dee27d87b2e80"
azure_ai_deployment = "pstestopenaidply-2o475m7f43aoa"
