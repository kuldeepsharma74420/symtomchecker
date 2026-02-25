module "vpc" {
  source             = "./modules/vpc"
  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

module "security_groups" {
  source        = "./modules/security-groups"
  project_name  = var.project_name
  environment   = var.environment
  vpc_id        = module.vpc.vpc_id
  frontend_port = var.frontend_port
  backend_port  = var.backend_port
}

module "rds" {
  source                   = "./modules/rds"
  project_name             = var.project_name
  environment              = var.environment
  vpc_id                   = module.vpc.vpc_id
  private_subnets          = module.vpc.private_subnets
  ecs_tasks_security_group = module.security_groups.ecs_tasks_security_group_id
  db_instance_class        = var.db_instance_class
  db_username              = var.db_username
  db_password              = var.db_password
}

module "alb" {
  source             = "./modules/alb"
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnets     = module.vpc.public_subnets
  alb_security_group = module.security_groups.alb_security_group_id
  frontend_port      = var.frontend_port
  backend_port       = var.backend_port
}

module "ecs" {
  source                    = "./modules/ecs"
  project_name              = var.project_name
  environment               = var.environment
  vpc_id                    = module.vpc.vpc_id
  private_subnets           = module.vpc.private_subnets
  ecs_tasks_security_group  = module.security_groups.ecs_tasks_security_group_id
  frontend_image            = var.frontend_image
  backend_image             = var.backend_image
  frontend_port             = var.frontend_port
  backend_port              = var.backend_port
  frontend_cpu              = var.frontend_cpu
  frontend_memory           = var.frontend_memory
  backend_cpu               = var.backend_cpu
  backend_memory            = var.backend_memory
  desired_count             = var.desired_count
  frontend_target_group_arn = module.alb.frontend_target_group_arn
  backend_target_group_arn  = module.alb.backend_target_group_arn
  aws_region                = var.aws_region
  db_host                   = module.rds.db_host
  db_name                   = module.rds.db_name
  db_username               = var.db_username
  db_password               = var.db_password
  jwt_secret                = var.jwt_secret
  azure_ai_endpoint         = var.azure_ai_endpoint
  azure_ai_key              = var.azure_ai_key
  azure_ai_deployment       = var.azure_ai_deployment
}
