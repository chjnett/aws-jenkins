pipeline {
    agent any

    environment {
        // 💡 환경 변수 설정 방법:
        // 방법 1) Jenkins Credentials: credentials('AWS_ACCOUNT_ID')
        // 방법 2) jenkins/.env 파일 사용 (docker-compose 권장)
        // 자세한 가이드: docs/jenkins-env-setup.md
        
        // AWS_ACCOUNT_ID = 'your-aws-account-id' // Use value from jenkins/.env
        AWS_REGION = 'ap-northeast-2'
        ECR_REPO_FRONTEND = 'energy-truck-frontend'
        ECR_REPO_BACKEND = 'energy-truck-backend'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        CLUSTER_NAME = 'energy-truck-cluster'
        SERVICE_FRONTEND = 'energy-truck-frontend-service'
        SERVICE_BACKEND = 'energy-truck-backend-service'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.build("${ECR_REPO_FRONTEND}:${IMAGE_TAG}", "-f energy-trading-app/Dockerfile energy-trading-app")
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    docker.build("${ECR_REPO_BACKEND}:${IMAGE_TAG}", "-f backend/Dockerfile backend")
                }
            }
        }

        stage('Login to ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    def frontendImage = docker.image("${ECR_REPO_FRONTEND}:${IMAGE_TAG}")
                    def backendImage = docker.image("${ECR_REPO_BACKEND}:${IMAGE_TAG}")
                    
                    // Tag for ECR
                    sh "docker tag ${ECR_REPO_FRONTEND}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_FRONTEND}:${IMAGE_TAG}"
                    sh "docker tag ${ECR_REPO_BACKEND}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_BACKEND}:${IMAGE_TAG}"
                    
                    // Push
                    sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_FRONTEND}:${IMAGE_TAG}"
                    sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_BACKEND}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                script {
                    // Update ECS Service (Force new deployment)
                    sh "aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_FRONTEND} --force-new-deployment --region ${AWS_REGION}"
                    sh "aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_BACKEND} --force-new-deployment --region ${AWS_REGION}"
                }
            }
        }
    }
}
