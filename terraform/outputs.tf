output "ecr_frontend_repository_url" {
  description = "Frontend ECR repository URL"
  value       = module.ecr.frontend_repository_url
}

output "ecr_backend_repository_url" {
  description = "Backend ECR repository URL"
  value       = module.ecr.backend_repository_url
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.alb_dns_name
}

output "alb_url" {
  description = "Application URL"
  value       = "http://${module.alb.alb_dns_name}"
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "frontend_service_name" {
  description = "Frontend service name"
  value       = module.ecs.frontend_service_name
}

output "backend_service_name" {
  description = "Backend service name"
  value       = module.ecs.backend_service_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.db_endpoint
}

output "rds_database_name" {
  description = "RDS database name"
  value       = module.rds.db_name
}
