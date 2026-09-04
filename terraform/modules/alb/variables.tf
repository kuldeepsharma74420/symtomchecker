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

variable "public_subnets" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "alb_security_group" {
  description = "ALB security group ID"
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
