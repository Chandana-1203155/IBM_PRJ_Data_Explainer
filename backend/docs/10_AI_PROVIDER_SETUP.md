# AI Provider Setup Guide

This guide explains how to configure and use the AI providers in AI Data Explainer+.

## Supported Providers

### 1. Ollama (Local LLM)
- **Type**: Local
- **Priority**: 1 (Primary)
- **Cost**: Free
- **Models**: Any model available in Ollama (llama3.2, mistral, etc.)

### 2. Groq (Cloud API)
- **Type**: Cloud
- **Priority**: 2 (Fallback)
- **Cost**: Free tier available
- **Models**: llama3-70b-8192, mixtral-8x7b-32768

### 3. OpenRouter (Cloud API)
- **Type**: Cloud
- **Priority**: 3 (Fallback)
- **Cost**: Pay per use
- **Models**: meta-llama/llama-3-8b-instruct:free, mistralai/mistral-7b-instruct:free

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# AI Provider Selection
# Options: ollama, groq, openrouter
AI_PROVIDER=ollama

# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./backend/uploads

# Report Configuration
REPORT_DIR=./backend/reports

# CORS Configuration
CORS_ORIGIN=*
```

## Setting Up Providers

### Ollama Setup

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Windows
   # Download from https://ollama.com/download
   ```

2. **Pull a Model**
   ```bash
   ollama pull llama3.2
   # Or other models: mistral, codellama, etc.
   ```

3. **Verify Installation**
   ```bash
   ollama list
   ollama run llama3.2
   ```

4. **Configure Environment**
   ```env
   AI_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   ```

### Groq Setup

1. **Get API Key**
   - Visit https://console.groq.com/
   - Sign up for an account
   - Create an API key

2. **Configure Environment**
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_your_api_key_here
   ```

3. **Test Configuration**
   ```bash
   curl -X POST https://api.groq.com/openai/v1/chat/completions \
     -H "Authorization: Bearer gsk_your_api_key_here" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama3-70b-8192","messages":[{"role":"user","content":"test"}],"max_tokens":10}'
   ```

### OpenRouter Setup

1. **Get API Key**
   - Visit https://openrouter.ai/
   - Sign up for an account
   - Create an API key
   - Add credits (free tier available)

2. **Configure Environment**
   ```env
   AI_PROVIDER=openrouter
   OPENROUTER_API_KEY=sk-or-your_api_key_here
   ```

3. **Test Configuration**
   ```bash
   curl -X POST https://openrouter.ai/api/v1/chat/completions \
     -H "Authorization: Bearer sk-or-your_api_key_here" \
     -H "Content-Type: application/json" \
     -H "HTTP-Referer: http://localhost:3000" \
     -H "X-Title: AI Data Explainer+" \
     -d '{"model":"meta-llama/llama-3-8b-instruct:free","messages":[{"role":"user","content":"test"}],"max_tokens":10}'
   ```

## Automatic Fallback

The system automatically falls back to the next available provider if the current one fails:

1. **Primary Provider**: Configured via `AI_PROVIDER` environment variable
2. **Fallback Order**: Ollama → Groq → OpenRouter
3. **Health Checks**: Automatic health checks every 5 minutes
4. **Retry Logic**: Exponential backoff with 3 attempts per provider

## Provider Health Check

Check provider health via API:

```bash
curl http://localhost:3000/api/provider/health
```

Response:
```json
{
  "success": true,
  "health": {
    "Ollama": true,
    "Groq": false,
    "OpenRouter": true
  }
}
```

## Provider Statistics

Get provider usage statistics:

```bash
curl http://localhost:3000/api/provider/stats
```

Response:
```json
{
  "success": true,
  "serviceStats": {
    "totalProviders": 3,
    "currentIndex": 0,
    "currentProvider": "Ollama",
    "allProviders": ["Ollama", "Groq", "OpenRouter"]
  },
  "providerStats": [
    {
      "name": "Ollama",
      "type": "local",
      "priority": 1,
      "requestCount": 150,
      "errorCount": 5,
      "successRate": "96.67%"
    },
    ...
  ]
}
```

## Switch Providers Manually

```bash
curl -X POST http://localhost:3000/api/provider/switch
```

Response:
```json
{
  "success": true,
  "currentProvider": "Groq"
}
```

## Troubleshooting

### Ollama Not Responding

**Error**: `Ollama service is not running`

**Solution**:
```bash
# Start Ollama
ollama serve

# Check if running
curl http://localhost:11434/api/tags
```

### Model Not Found

**Error**: `Ollama model 'xxx' not found`

**Solution**:
```bash
# Pull the model
ollama pull llama3.2
```

### Invalid API Key

**Error**: `Invalid API key. Please check your credentials`

**Solution**:
- Verify API key in `.env` file
- Regenerate API key from provider console
- Ensure no extra spaces in the key

### Rate Limit Exceeded

**Error**: `API rate limit exceeded`

**Solution**:
- Wait for rate limit to reset
- Switch to a different provider
- Upgrade API plan if needed

## Best Practices

1. **Use Ollama for Development**: Free, fast, no API limits
2. **Configure Fallback Providers**: Ensure high availability
3. **Monitor Provider Stats**: Check performance and error rates
4. **Use Appropriate Models**: Choose models based on task complexity
5. **Secure API Keys**: Never commit `.env` file to version control

## Security Notes

- Never hardcode API keys in source code
- Use environment variables for all credentials
- Rotate API keys regularly
- Use HTTPS for all API calls
- Implement rate limiting in production
- Monitor API usage and costs
