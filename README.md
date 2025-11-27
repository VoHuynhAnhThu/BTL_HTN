# SmartDrip

This project is an IoT-based smart drip irrigation system that automates water distribution for crops based on real-time environmental conditions. Using sensors (soil humidity, temperature, light) and AI-driven predictions, the system ensures optimal water usae, reducing waste and improving efficiency.

# Documents

[Report](https://www.google.com/url?q=https://www.overleaf.com/read/hwynyghzpght%23e3d89a&sa=D&source=editors&ust=1746631251113166&usg=AOvVaw3lIohNsb_Ch8O6v4KdC3b-)

## AI Inference (Plant Disease Segmentation)

The `PLANT_AI` service exposes a FastAPI endpoint for leaf disease segmentation using a UNet++ EfficientNet-B1 model (`best_unetpp_effb1.pth`). It is integrated with the NestJS backend which proxies requests.

### Endpoints

| Service     | Endpoint            | Description                                      |
| ----------- | ------------------- | ------------------------------------------------ |
| AI (direct) | `GET /health`       | Model readiness & device info                    |
| AI (direct) | `GET /inference`    | Alias of `/health` for readiness/status          |
| AI (direct) | `POST /infer-image` | Upload image (form-data `file`) for segmentation |
| Backend     | `GET /ai/inference` | Proxies AI model readiness/status                |
| Backend     | `POST /ai/image`    | Proxies AI inference                             |

### Run Locally (CPU)

```bash
cd PLANT_AI
python api.py  # starts on 127.0.0.1:8001
```

Test:

```bash
curl -F "file=@leaf.jpg" http://127.0.0.1:8001/infer-image
```

### Docker Compose

```bash
docker compose build
docker compose up -d
```

Then test through backend (port 8080):

```bash
curl -F "file=@leaf.jpg" http://localhost:8080/ai/image
```

### Response Structure

```json
{
  "diseasesDetected": ["Healthy"],
  "classPercents": {
    "Background": 12.34,
    "Healthy": 80.11,
    "Alternaria leaf spot": 0.5,
    "Brown spot": 0.0,
    "Gray spot": 0.0,
    "Rust": 7.05
  },
  "maskOverlayBase64": "<PNG base64>",
  "imageSize": [512, 512]
}
```

### Optional: GPU Build

Replace base image in `PLANT_AI/Dockerfile` with a CUDA-enabled PyTorch image, e.g.:

```dockerfile
FROM pytorch/pytorch:2.6.0-cuda11.8-cudnn8-runtime
```

Then rebuild `docker compose build ai`.

### Streamlit Demo (Optional)

The `app.py` in `PLANT_AI` provides an interactive UI:

```bash
cd PLANT_AI
pip install -r requirements-ai.txt streamlit
streamlit run app.py
```

### Integration Notes

- Backend uses env `AI_SERVICE_URL` (already set in `docker-compose.yml`).
- Inference status endpoint exposed at `GET /ai/inference`.
- Increase max body size or add validation as needed for production.
