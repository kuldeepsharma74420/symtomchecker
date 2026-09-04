output "frontend_repository_url" {
  description = "Frontend repository URL"
  value       = aws_ecr_repository.frontend.repository_url
}

output "backend_repository_url" {
  description = "Backend repository URL"
  value       = aws_ecr_repository.backend.repository_url
}
