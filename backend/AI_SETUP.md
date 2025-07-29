# AI Image Generation Setup Guide

## Prerequisites

1. **Stable Diffusion WebUI** must be running locally
2. **Java 17+** and **Maven** installed
3. **PostgreSQL** database running

## Setup Steps

### 1. Install and Run Stable Diffusion WebUI

```bash
# Clone Stable Diffusion WebUI
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Run with API enabled
python launch.py --api --listen --port 7860
```

### 2. Verify Stable Diffusion is Running

Visit: `http://127.0.0.1:7860`

You should see the Stable Diffusion WebUI interface.

### 3. Test the Health Check

```bash
curl http://localhost:8081/api/health/stable-diffusion
```

Expected response:
```json
{
  "status": "running",
  "message": "Stable Diffusion is running and accessible"
}
```

### 4. Test Image Generation

```bash
curl -X POST http://localhost:8081/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a beautiful sunset over mountains"}'
```

## Configuration

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Stable Diffusion URL
stable.diffusion.url=http://127.0.0.1:7860
```

### Frontend Configuration

The frontend is configured to connect to: `http://10.222.231.165:8081`

Update this URL in `frontend/app/prompt.tsx` if your backend runs on a different IP.

## Troubleshooting

### Common Issues

1. **"Cannot connect to Stable Diffusion"**
   - Ensure Stable Diffusion WebUI is running with `--api` flag
   - Check if port 7860 is accessible

2. **"Backend server error"**
   - Check backend logs for detailed error messages
   - Verify database connection

3. **"Network request failed"**
   - Ensure backend is running on the correct IP
   - Check firewall settings

### Debug Endpoints

- Health Check: `GET /api/health/stable-diffusion`
- AI Generation: `POST /api/ai/generate`
- Alternative: `POST /api/diffuse/generate`

## API Endpoints

### Generate Image
- **URL**: `POST /api/ai/generate`
- **Body**: `{"prompt": "your image description"}`
- **Response**: `{"image": "base64_encoded_image"}`

### Health Check
- **URL**: `GET /api/health/stable-diffusion`
- **Response**: `{"status": "running", "message": "..."}` 