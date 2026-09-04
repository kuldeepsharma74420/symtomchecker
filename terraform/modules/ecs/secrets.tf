data "aws_secretsmanager_secret" "jwt_secret" {
  name = "/symptom-checker/prod/jwt-secret"
}

data "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = data.aws_secretsmanager_secret.jwt_secret.id
}

data "aws_secretsmanager_secret" "azure_ai_key" {
  name = "/symptom-checker/prod/azure-ai-key"
}

data "aws_secretsmanager_secret_version" "azure_ai_key" {
  secret_id = data.aws_secretsmanager_secret.azure_ai_key.id
}

data "aws_secretsmanager_secret" "azure_ai_endpoint" {
  name = "/symptom-checker/prod/azure-ai-endpoint"
}

data "aws_secretsmanager_secret_version" "azure_ai_endpoint" {
  secret_id = data.aws_secretsmanager_secret.azure_ai_endpoint.id
}

data "aws_secretsmanager_secret" "azure_ai_deployment" {
  name = "/symptom-checker/prod/azure-ai-deployment"
}

data "aws_secretsmanager_secret_version" "azure_ai_deployment" {
  secret_id = data.aws_secretsmanager_secret.azure_ai_deployment.id
}

data "aws_secretsmanager_secret" "db_password" {
  name = "/symptom-checker/prod/db-password"
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = data.aws_secretsmanager_secret.db_password.id
}
