variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "symptom-checker"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "frontend_port" {
  description = "Frontend container port"
  type        = number
  default     = 80
}

variable "backend_port" {
  description = "Backend container port"
  type        = number
  default     = 8080
}

variable "frontend_cpu" {
  description = "Frontend task CPU"
  type        = number
  default     = 512
}

variable "frontend_memory" {
  description = "Frontend task memory"
  type        = number
  default     = 1024
}

variable "backend_cpu" {
  description = "Backend task CPU"
  type        = number
  default     = 1024
}

variable "backend_memory" {
  description = "Backend task memory"
  type        = number
  default     = 2048
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "frontend_image" {
  description = "Frontend Docker image"
  type        = string
}

variable "backend_image" {
  description = "Backend Docker image"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "azure_ai_endpoint" {
  description = "Azure OpenAI endpoint"
  type        = string
}

variable "azure_ai_key" {
  description = "Azure OpenAI API key"
  type        = string
  sensitive   = true
}

variable "azure_ai_deployment" {
  description = "Azure OpenAI deployment name"
  type        = string
}
