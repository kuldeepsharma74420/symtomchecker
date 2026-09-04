pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '975371763536'
        ECR_FRONTEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/symptom-checker-frontend"
        ECR_BACKEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/symptom-checker-backend"
        ECS_CLUSTER = 'symtomchecker-cluster'
        FRONTEND_SERVICE = 'symptom-checker-frontend-service'
        BACKEND_SERVICE = 'symptom-checker-backend-service'
    }
    
    parameters {
        choice(name: 'ACTION', choices: ['deploy', 'destroy', 'plan'], description: 'Select action to perform')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip running tests')
        booleanParam(name: 'AUTO_APPROVE', defaultValue: false, description: 'Auto approve Terraform apply')
        string(name: 'AWS_ACCESS_KEY_ID', defaultValue: '', description: 'AWS Access Key ID')
        password(name: 'AWS_SECRET_ACCESS_KEY', defaultValue: '', description: 'AWS Secret Access Key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/kuldeepsharma74420/symtomchecker.git'
                script {
                    env.BUILD_TAG = "${env.BUILD_NUMBER}"
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Building Spring Boot application..."
                        mvn clean package -DskipTests=${SKIP_TESTS}
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            sh """
                                echo "Building backend Docker image..."
                                docker build -t symptom-checker-backend:${BUILD_TAG} .
                                docker tag symptom-checker-backend:${BUILD_TAG} symptom-checker-backend:latest
                            """
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh """
                                echo "Building frontend Docker image..."
                                docker build -t symptom-checker-frontend:${BUILD_TAG} .
                                docker tag symptom-checker-frontend:${BUILD_TAG} symptom-checker-frontend:latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('Push to ECR') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                script {
                    sh """
                        export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                        export AWS_DEFAULT_REGION=${AWS_REGION}
                        
                        echo "Logging into ECR..."
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        
                        echo "Pushing backend image..."
                        docker tag symptom-checker-backend:${BUILD_TAG} ${ECR_BACKEND_REPO}:${BUILD_TAG}
                        docker tag symptom-checker-backend:${BUILD_TAG} ${ECR_BACKEND_REPO}:latest
                        docker push ${ECR_BACKEND_REPO}:${BUILD_TAG}
                        docker push ${ECR_BACKEND_REPO}:latest
                        
                        echo "Pushing frontend image..."
                        docker tag symptom-checker-frontend:${BUILD_TAG} ${ECR_FRONTEND_REPO}:${BUILD_TAG}
                        docker tag symptom-checker-frontend:${BUILD_TAG} ${ECR_FRONTEND_REPO}:latest
                        docker push ${ECR_FRONTEND_REPO}:${BUILD_TAG}
                        docker push ${ECR_FRONTEND_REPO}:latest
                    """
                }
            }
        }
        
        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    sh """
                        export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                        export AWS_DEFAULT_REGION=${AWS_REGION}
                        
                        echo "Initializing Terraform..."
                        terraform init
                    """
                }
            }
        }
        
        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    sh """
                        export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                        export AWS_DEFAULT_REGION=${AWS_REGION}
                        
                        echo "Running Terraform plan..."
                        terraform plan -out=tfplan
                    """
                }
            }
        }
        
        stage('Terraform Apply') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                dir('terraform') {
                    script {
                        sh """
                            export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                            export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                            export AWS_DEFAULT_REGION=${AWS_REGION}
                        """
                        try {
                            if (params.AUTO_APPROVE) {
                                sh 'terraform apply -auto-approve tfplan'
                            } else {
                                input message: 'Approve Terraform Apply?', ok: 'Apply'
                                sh 'terraform apply tfplan'
                            }
                        } catch (Exception e) {
                            echo "Terraform apply failed, attempting to import existing resources..."
                            sh '''
                                export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                                export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                                export AWS_DEFAULT_REGION=${AWS_REGION}
                                
                                # Try to import existing resources
                                terraform import module.rds.aws_db_subnet_group.main symptom-checker-db-subnet-group || true
                                terraform import module.rds.aws_security_group.rds symptom-checker-rds-sg || true
                                terraform import module.rds.aws_db_instance.main symptom-checker-db || true
                                
                                # Retry apply
                                terraform apply -auto-approve tfplan
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Update ECS Services') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                script {
                    try {
                        sh """
                            export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                            export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                            export AWS_DEFAULT_REGION=${AWS_REGION}
                            
                            echo "Forcing new deployment for ECS services..."
                            aws ecs update-service --cluster ${ECS_CLUSTER} --service ${FRONTEND_SERVICE} --force-new-deployment --region ${AWS_REGION}
                            aws ecs update-service --cluster ${ECS_CLUSTER} --service ${BACKEND_SERVICE} --force-new-deployment --region ${AWS_REGION}
                        """
                    } catch (Exception e) {
                        echo "ECS service update failed, services may not exist yet: ${e.getMessage()}"
                        echo "Continuing with deployment..."
                    }
                }
            }
        }
        
        stage('Wait for Deployment') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                script {
                    try {
                        sh """
                            export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                            export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                            export AWS_DEFAULT_REGION=${AWS_REGION}
                            
                            echo "Waiting for services to stabilize..."
                            aws ecs wait services-stable --cluster ${ECS_CLUSTER} --services ${FRONTEND_SERVICE} --region ${AWS_REGION}
                            aws ecs wait services-stable --cluster ${ECS_CLUSTER} --services ${BACKEND_SERVICE} --region ${AWS_REGION}
                        """
                    } catch (Exception e) {
                        echo "Service stabilization wait failed: ${e.getMessage()}"
                        echo "Services may still be starting up..."
                    }
                }
            }
        }
        
        stage('Terraform Destroy') {
            when {
                expression { params.ACTION == 'destroy' }
            }
            steps {
                dir('terraform') {
                    script {
                        sh """
                            export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                            export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                            export AWS_DEFAULT_REGION=${AWS_REGION}
                        """
                        if (params.AUTO_APPROVE) {
                            sh 'terraform destroy -auto-approve'
                        } else {
                            input message: 'Are you sure you want to destroy all resources?', ok: 'Destroy'
                            sh 'terraform destroy -auto-approve'
                        }
                    }
                }
            }
        }
        
        stage('Get Application URL') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                dir('terraform') {
                    script {
                        try {
                            sh """
                                export AWS_ACCESS_KEY_ID=${params.AWS_ACCESS_KEY_ID}
                                export AWS_SECRET_ACCESS_KEY=${params.AWS_SECRET_ACCESS_KEY}
                                export AWS_DEFAULT_REGION=${AWS_REGION}
                            """
                            def albUrl = sh(returnStdout: true, script: 'terraform output -raw alb_url').trim()
                            echo "=========================================="
                            echo "Application deployed successfully!"
                            echo "Application URL: ${albUrl}"
                            echo "=========================================="
                        } catch (Exception e) {
                            echo "Could not retrieve application URL: ${e.getMessage()}"
                            echo "Check Terraform outputs manually if needed"
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Docker images...'
            sh '''
                docker image prune -f
            '''
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}