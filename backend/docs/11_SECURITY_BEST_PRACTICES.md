# Security Best Practices - AI Data Explainer+

This document outlines the security measures implemented in AI Data Explainer+ and best practices for production deployment.

## Implemented Security Measures

### 1. Input Validation
- File type validation (CSV, Excel only)
- File size validation (10MB limit)
- Input sanitization using XSS protection
- Request validation using express-validator

### 2. Rate Limiting
- General API: 100 requests per 15 minutes
- File uploads: 10 uploads per hour
- AI requests: 10 requests per minute
- Chat messages: 20 messages per minute

### 3. Authentication & Authorization
- API key validation for AI providers
- Session-based authentication
- Automatic session cleanup (30 minutes)

### 4. Data Protection
- No persistent storage of user data
- In-memory session storage
- Automatic file cleanup (1 hour)
- No database (reduced attack surface)

### 5. API Security
- CORS configuration
- Helmet.js for HTTP headers
- Request logging
- Error handling without sensitive info exposure

### 6. AI Provider Security
- API keys stored in environment variables
- Never exposed in logs or responses
- Automatic fallback on provider failure
- Health checks for provider availability

## Production Deployment Checklist

### Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Configure `AI_PROVIDER`
- [ ] Set AI provider API keys
- [ ] Configure `CORS_ORIGIN` to specific domain
- [ ] Set appropriate `MAX_FILE_SIZE`
- [ ] Configure secure `UPLOAD_DIR` and `REPORT_DIR`

### Network Security
- [ ] Use HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Use reverse proxy (nginx/Apache)
- [ ] Enable DDoS protection
- [ ] Configure WAF (Web Application Firewall)

### Application Security
- [ ] Enable all rate limiters
- [ ] Configure Helmet.js properly
- [ ] Use strong session secrets
- [ ] Implement request timeouts
- [ ] Enable compression
- [ ] Set security headers

### File System Security
- [ ] Secure upload directory permissions
- [ ] Secure report directory permissions
- [ ] Implement file scanning for malware
- [ ] Regular cleanup of temporary files
- [ ] Monitor disk usage

### Monitoring & Logging
- [ ] Enable structured logging
- [ ] Set up log aggregation
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Monitor performance metrics
- [ ] Set up alerting for security events

### AI Provider Security
- [ ] Rotate API keys regularly
- [ ] Monitor API usage and costs
- [ ] Set up usage alerts
- [ ] Implement cost controls
- [ ] Review provider security best practices

## Security Headers

The application uses Helmet.js to set the following security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)
- `Content-Security-Policy` (configured per requirements)

## Rate Limiting Strategy

### General API
- Window: 15 minutes
- Max requests: 100
- Purpose: Prevent abuse, ensure fair usage

### Upload Endpoint
- Window: 1 hour
- Max uploads: 10
- Purpose: Prevent resource exhaustion, storage abuse

### AI Requests
- Window: 1 minute
- Max requests: 10
- Purpose: Control API costs, prevent abuse

### Chat Endpoint
- Window: 1 minute
- Max messages: 20
- Purpose: Prevent spam, ensure fair usage

## Input Sanitization

All user inputs are sanitized using XSS protection:
- Request bodies
- Query parameters
- URL parameters
- File names

No HTML tags are allowed in user input to prevent XSS attacks.

## File Upload Security

### Validation
- File type validation (extension check)
- File size validation (10MB limit)
- MIME type validation
- File content validation (CSV/Excel parsing)

### Storage
- Unique filenames (UUID-based)
- Temporary storage only
- Automatic cleanup (1 hour)
- No execution of uploaded files

### Processing
- Streaming file processing
- Memory-efficient parsing
- Error handling for malformed files
- No code execution from uploads

## Session Management

### Security Features
- UUID-based session IDs
- Automatic expiration (30 minutes)
- In-memory storage only
- Automatic cleanup of expired sessions
- Session data never persisted

### Best Practices
- Regenerate session IDs after login
- Implement session fixation protection
- Monitor session creation rate
- Limit concurrent sessions per user

## AI Provider Security

### API Key Management
- Store in environment variables
- Never commit to version control
- Rotate regularly
- Use different keys for dev/staging/prod
- Monitor for unauthorized usage

### Rate Limiting
- Implement per-provider rate limits
- Monitor API usage
- Set up cost alerts
- Implement circuit breakers

### Data Privacy
- No sensitive data sent to AI providers
- Sanitize data before sending
- Use anonymization when possible
- Review provider privacy policies

## Error Handling

### Security Principles
- Never expose stack traces in production
- Log errors securely (no sensitive data)
- Return generic error messages to users
- Implement proper HTTP status codes
- Monitor error rates for attacks

### Error Messages
- Development: Detailed error messages
- Production: Generic error messages
- Never reveal system information
- Never reveal API keys or secrets

## Monitoring & Alerting

### Security Metrics to Monitor
- Failed authentication attempts
- Rate limit violations
- Unusual file upload patterns
- High error rates
- Slow response times
- Unusual API usage patterns

### Alert Thresholds
- More than 10 failed auth attempts per minute
- Rate limit violations > 5 per minute
- File upload failures > 20%
- Error rate > 10%
- Response time > 5 seconds
- API cost anomalies

## Backup & Recovery

### Data Backup
- No persistent data to backup
- Session data is temporary
- Files are temporary
- Configuration backup recommended

### Disaster Recovery
- Redeploy from version control
- Restore environment variables
- Monitor system health
- Test recovery procedures regularly

## Compliance Considerations

### Data Privacy
- GDPR compliance (if applicable)
- Data minimization principle
- User consent for data processing
- Right to data deletion

### Security Standards
- OWASP Top 10 compliance
- Regular security audits
- Penetration testing
- Code security reviews

## Regular Security Tasks

### Daily
- Monitor error logs
- Check rate limit violations
- Review security alerts
- Monitor API usage

### Weekly
- Review access logs
- Check for unusual patterns
- Review provider API usage
- Update dependencies

### Monthly
- Rotate API keys
- Security audit
- Penetration testing
- Review and update security policies

### Quarterly
- Full security review
- Update security documentation
- Training for developers
- Third-party security assessment
