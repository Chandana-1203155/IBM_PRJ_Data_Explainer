# Deployment Guide - AI Data Explainer+

This guide provides detailed instructions for deploying AI Data Explainer+ to various platforms.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [AWS Deployment](#aws-deployment)
4. [Production Checklist](#production-checklist)
5. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Ollama (for local AI)

### Setup Steps

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd ai-data-explainer
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Ollama (if using local AI)**
   ```bash
   ollama pull llama3.2
   ollama serve
   ```

5. **Start backend**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

6. **Open frontend**
   ```bash
   cd frontend
   python -m http.server 8080
   # Open http://localhost:8080 in browser
   ```

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Using Docker

1. **Build image**
   ```bash
   docker build -t ai-data-explainer .
   ```

2. **Run container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e AI_PROVIDER=ollama \
     -e OLLAMA_URL=http://host.docker.internal:11434 \
     ai-data-explainer
   ```

3. **View logs**
   ```bash
   docker logs <container-id>
   ```

### Docker Compose Development

For development with hot reload:
```bash
docker-compose -f docker-compose.dev.yml up
```

## AWS Deployment

### Using Terraform (Recommended)

#### Prerequisites

- AWS CLI installed and configured
- Terraform installed
- AWS credentials configured

#### Steps

1. **Navigate to terraform directory**
   ```bash
   cd aws/terraform
   ```

2. **Initialize Terraform**
   ```bash
   terraform init
   ```

3. **Review and modify variables**
   ```bash
   # Edit terraform.tfvars or pass variables
   terraform plan \
     -var="environment=production" \
     -var="aws_region=us-east-1"
   ```

4. **Apply changes**
   ```bash
   terraform apply
   ```

5. **Get outputs**
   ```bash
   terraform output
   ```

6. **Configure secrets**
   ```bash
   # Store API keys in AWS Secrets Manager
   aws secretsmanager put-secret-value \
     --secret-id ai-data-explainer/groq-api-key \
     --secret-string "your-groq-api-key"
   
   aws secretsmanager put-secret-value \
     --secret-id ai-data-explainer/openrouter-api-key \
     --secret-string "your-openrouter-api-key"
   ```

7. **Build and push Docker image**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build image
   docker build -t ai-data-explainer .
   
   # Tag image
   docker tag ai-data-explainer:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-data-explainer:latest
   
   # Push image
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-data-explainer:latest
   ```

8. **Update ECS service**
   ```bash
   aws ecs update-service \
     --cluster ai-data-explainer-cluster \
     --service ai-data-explainer-service \
     --force-new-deployment
   ```

### Manual AWS Deployment

#### Using Deployment Script

1. **Make script executable**
   ```bash
   chmod +x aws/deploy.sh
   ```

2. **Set environment variables**
   ```bash
   export AWS_ACCOUNT_ID=your-account-id
   export AWS_REGION=us-east-1
   export GROQ_API_KEY=your-key
   export OPENROUTER_API_KEY=your-key
   ```

3. **Run deployment script**
   ```bash
   ./aws/deploy.sh
   ```

#### Manual Steps

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name ai-data-explainer
   ```

2. **Build and push image**
   ```bash
   docker build -t ai-data-explainer .
   docker tag ai-data-explainer:latest <account-id>.dkr.ecr.<region>.amazonaws.com/ai-data-explainer:latest
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/ai-data-explainer:latest
   ```

3. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name ai-data-explainer-cluster
   ```

4. **Create Task Definition**
   ```bash
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   ```

5. **Create Service**
   ```bash
   aws ecs create-service \
     --cluster ai-data-explainer-cluster \
     --service-name ai-data-explainer-service \
     --task-definition ai-data-explainer \
     --desired-count 2 \
     --launch-type FARGATE
   ```

## Production Checklist

### Security
- [ ] Set NODE_ENV=production
- [ ] Configure CORS_ORIGIN to specific domain
- [ ] Use HTTPS/TLS
- [ ] Configure security headers
- [ ] Enable all rate limiters
- [ ] Store API keys in AWS Secrets Manager
- [ ] Rotate API keys regularly
- [ ] Enable CloudTrail logging
- [ ] Configure WAF rules

### Performance
- [ ] Use CDN for static assets
- [ ] Enable compression
- [ ] Configure caching
- [ ] Monitor performance metrics
- [ ] Set up auto-scaling
- [ ] Use load balancer
- [ ] Enable CloudWatch alarms

### Monitoring
- [ ] Configure CloudWatch logs
- [ ] Set up error tracking (Sentry)
- [ ] Monitor API costs
- [ ] Set up usage alerts
- [ ] Configure health checks
- [ ] Monitor disk usage
- [ ] Track error rates

### Backup
- [ ] Backup environment variables
- [ ] Backup Terraform state
- [ ] Configure EBS snapshots
- [ ] Document recovery procedures
- [ ] Test backup restoration

### Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbooks for common tasks
- [ ] Document incident response
- [ ] Update API documentation

## Troubleshooting

### Common Issues

#### Docker Issues

**Container won't start**
```bash
# Check logs
docker-compose logs backend

# Rebuild image
docker-compose build --no-cache
docker-compose up
```

**Port conflicts**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"
```

#### AWS Issues

**ECS tasks failing**
```bash
# Check task logs
aws logs tail /ecs/ai-data-explainer --follow

# Check task definition
aws ecs describe-task-definition --task-definition ai-data-explainer
```

**Load balancer health checks failing**
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# Check target group health
aws elbv2 describe-target-health --target-group-arn <tg-arn>
```

#### Application Issues

**AI provider not responding**
```bash
# Check provider health
curl http://localhost:3000/api/provider/health

# Switch provider manually
curl -X POST http://localhost:3000/api/provider/switch
```

**File upload failing**
```bash
# Check file size limits
# Check upload directory permissions
# Check disk space
```

**Memory issues**
```bash
# Check memory usage
curl http://localhost:3000/api/performance/system

# Increase task memory in ECS task definition
```

### Getting Help

1. Check logs: `docker-compose logs -f`
2. Check documentation in `docs/` directory
3. Check GitHub issues
4. Review security and performance guides

## Maintenance

### Regular Tasks

**Daily**
- Monitor error logs
- Check rate limit violations
- Review API usage and costs

**Weekly**
- Review performance metrics
- Check security alerts
- Review provider API usage

**Monthly**
- Rotate API keys
- Review and update dependencies
- Security audit
- Performance review

**Quarterly**
- Full security review
- Update documentation
- Training for developers
- Third-party security assessment

## Scaling

### Horizontal Scaling

ECS auto-scaling can be configured to automatically adjust the number of tasks based on:
- CPU utilization
- Memory utilization
- Request count
- Custom metrics

### Vertical Scaling

Increase task CPU and memory in task definition based on requirements.

### Database Scaling

Since this application is stateless, scaling is handled by:
- Adding more ECS tasks
- Using load balancer
- Implementing Redis for session storage (if needed)

## Cost Optimization

1. **Use Fargate Spot** for non-critical workloads
2. **Configure auto-scaling** to scale down during off-peak hours
3. **Use Graviton instances** for cost savings
4. **Monitor AI API costs** and set up alerts
5. **Use CloudWatch** to identify cost optimization opportunities
6. **Clean up unused resources** regularly

## Rollback

### ECS Rollback

```bash
# Update service to previous task definition
aws ecs update-service \
  --cluster ai-data-explainer-cluster \
  --service ai-data-explainer-service \
  --task-definition <previous-task-definition-arn>
```

### Terraform Rollback

```bash
terraform plan
terraform apply
# Or restore from state backup
```

### Docker Rollback

```bash
# Rebuild previous image
docker build -t ai-data-explainer:previous .
docker tag ai-data-explainer:previous ai-data-explainer:latest
docker-compose up -d
```
