#!/bin/bash

# AWS Deployment Script - AI Data Explainer+

set -e

# Configuration
APP_NAME="ai-data-explainer"
REGION="us-east-1"
ECR_REPOSITORY="${APP_NAME}"
CLUSTER_NAME="${APP_NAME}-cluster"
SERVICE_NAME="${APP_NAME}-service"
TASK_FAMILY="${APP_NAME}-task"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting AWS deployment for AI Data Explainer+${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install it first.${NC}"
    exit 1
fi

# Login to ECR
echo -e "${YELLOW}Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $ECR_REPOSITORY .

# Tag image
echo -e "${YELLOW}Tagging Docker image...${NC}"
docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Push image to ECR
echo -e "${YELLOW}Pushing Docker image to ECR...${NC}"
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Update ECS service
echo -e "${YELLOW}Updating ECS service...${NC}"
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $REGION

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Application is available at: https://api.${APP_NAME}.com${NC}"
