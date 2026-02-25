variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnets" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "ecs_tasks_security_group" {
  description = "ECS tasks security group ID"
  type        = string
}

variable "frontend_image" {
  description = "Frontend Docker image"
  type        = string
}

variable "backend_image" {
  description = "Backend Docker image"
  type        = string
}

variable "frontend_port" {
  description = "Frontend port"
  type        = number
}

variable "backend_port" {
  description = "Backend port"
  type        = number
}

variable "frontend_cpu" {
  description = "Frontend CPU"
  type        = number
}

variable "frontend_memory" {
  description = "Frontend memory"
  type        = number
}

variable "backend_cpu" {
  description = "Backend CPU"
  type        = number
}

variable "backend_memory" {
  description = "Backend memory"
  type        = number
}

variable "desired_count" {
  description = "Desired task count"
  type        = number
}

variable "frontend_target_group_arn" {
  description = "Frontend target group ARN"
  type        = string
}

variable "backend_target_group_arn" {
  description = "Backend target group ARN"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "db_host" {
  description = "Database host"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret"
  type        = string
  sensitive   = true
}

variable "azure_ai_endpoint" {
  description = "Azure AI endpoint"
  type        = string
}

variable "azure_ai_key" {
  description = "Azure AI key"
  type        = string
  sensitive   = true
}

variable "azure_ai_deployment" {
  description = "Azure AI deployment"
  type        = string
}
