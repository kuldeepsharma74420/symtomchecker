output "db_endpoint" {
  description = "Database endpoint"
  value       = aws_db_instance.main.endpoint
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

output "db_host" {
  description = "Database host"
  value       = split(":", aws_db_instance.main.endpoint)[0]
}
