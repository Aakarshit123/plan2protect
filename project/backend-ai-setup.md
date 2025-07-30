# Plan2Protect AI Backend with MiDaS Integration

## Overview
Integrate MiDaS (Mixed Depth Supervision) for 2D to 3D conversion in home safety assessments.

## 1. Backend Architecture

### Python FastAPI Backend
```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
torch==2.1.0
torchvision==0.16.0
opencv-python==4.8.1.78
numpy==1.24.3
Pillow==10.0.1
python-multipart==0.0.6
```

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── midas_model.py
│   │   └── safety_analyzer.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── depth_estimation.py
│   │   ├── risk_assessment.py
│   │   └── report_generator.py
│   └── utils/
│       ├── __init__.py
│       ├── image_processing.py
│       └── file_handlers.py
├── weights/
│   └── midas_weights/
└── requirements.txt
```

## 2. MiDaS Integration

### Install MiDaS
```bash
git clone https://github.com/isl-org/MiDaS.git
cd MiDaS
pip install -r requirements.txt
```

### Download Pre-trained Models
```python
# Download the best performing model
# BEiT Large 512 (highest accuracy)
wget https://github.com/isl-org/MiDaS/releases/download/v3_1/dpt_beit_large_512.pt

# Or use smaller models for faster processing
wget https://github.com/isl-org/MiDaS/releases/download/v3_1/dpt_swin2_tiny_256.pt
```

### MiDaS Service Implementation
```python
# services/depth_estimation.py
import torch
import cv2
import numpy as np
from PIL import Image
import sys
sys.path.append("MiDaS")

from midas.model_loader import default_models, load_model

class DepthEstimationService:
    def __init__(self, model_path="weights/dpt_beit_large_512.pt"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model, self.transform, self.net_w, self.net_h = load_model(
            self.device, model_path, "dpt_beit_large_512", optimize=True
        )
    
    def estimate_depth(self, image_path):
        """Convert 2D image to depth map"""
        # Load and preprocess image
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Transform image
        img_input = self.transform({"image": img})["image"]
        
        # Compute depth
        with torch.no_grad():
            sample = torch.from_numpy(img_input).to(self.device).unsqueeze(0)
            prediction = self.model.forward(sample)
            prediction = torch.nn.functional.interpolate(
                prediction.unsqueeze(1),
                size=img.shape[:2],
                mode="bicubic",
                align_corners=False,
            ).squeeze()
            depth = prediction.cpu().numpy()
        
        return depth
    
    def create_3d_model(self, depth_map, original_image):
        """Create 3D point cloud from depth map"""
        # Convert depth map to 3D coordinates
        height, width = depth_map.shape
        x, y = np.meshgrid(np.arange(width), np.arange(height))
        
        # Normalize depth values
        depth_normalized = depth_map / depth_map.max()
        
        # Create 3D points
        points_3d = np.stack([x, y, depth_normalized * 100], axis=-1)
        
        return points_3d
```

## 3. Safety Analysis Integration

### Risk Assessment Service
```python
# services/risk_assessment.py
import numpy as np
from typing import Dict, List

class SafetyAnalyzer:
    def __init__(self):
        self.risk_thresholds = {
            'low': 0.3,
            'medium': 0.6,
            'high': 0.8
        }
    
    def analyze_depth_map(self, depth_map, room_info):
        """Analyze depth map for safety risks"""
        risks = []
        
        # Detect sudden depth changes (stairs, ledges)
        depth_gradient = np.gradient(depth_map)
        gradient_magnitude = np.sqrt(depth_gradient[0]**2 + depth_gradient[1]**2)
        
        # Find high gradient areas (potential hazards)
        hazard_areas = gradient_magnitude > np.percentile(gradient_magnitude, 95)
        
        if np.any(hazard_areas):
            risks.append({
                'type': 'sudden_depth_change',
                'severity': 'high',
                'description': 'Sudden depth changes detected - potential tripping hazard',
                'locations': np.where(hazard_areas)
            })
        
        # Analyze room-specific risks
        if room_info.get('type') == 'bathroom':
            risks.extend(self._analyze_bathroom_risks(depth_map))
        elif room_info.get('type') == 'kitchen':
            risks.extend(self._analyze_kitchen_risks(depth_map))
        
        return risks
    
    def _analyze_bathroom_risks(self, depth_map):
        """Analyze bathroom-specific safety risks"""
        risks = []
        
        # Check for slip hazards (smooth surfaces)
        surface_variance = np.var(depth_map)
        if surface_variance < 0.1:  # Very smooth surface
            risks.append({
                'type': 'slippery_surface',
                'severity': 'medium',
                'description': 'Smooth surface detected - consider non-slip mats'
            })
        
        return risks
    
    def _analyze_kitchen_risks(self, depth_map):
        """Analyze kitchen-specific safety risks"""
        risks = []
        
        # Check for fire hazards (proximity to heat sources)
        # This would require additional object detection
        
        return risks
    
    def calculate_safety_score(self, risks):
        """Calculate overall safety score (0-100)"""
        if not risks:
            return 95  # High score for no risks
        
        # Weight risks by severity
        severity_weights = {'low': 1, 'medium': 2, 'high': 3}
        total_weight = sum(severity_weights[risk['severity']] for risk in risks)
        
        # Calculate score (more risks = lower score)
        base_score = 100
        penalty = min(total_weight * 10, 80)  # Max 80 point penalty
        
        return max(base_score - penalty, 10)  # Minimum score of 10
```

## 4. API Endpoints

### FastAPI Main Application
```python
# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from services.depth_estimation import DepthEstimationService
from services.risk_assessment import SafetyAnalyzer
from services.report_generator import ReportGenerator

app = FastAPI(title="Plan2Protect AI Backend")

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
depth_service = DepthEstimationService()
safety_analyzer = SafetyAnalyzer()
report_generator = ReportGenerator()

@app.post("/api/assess-safety")
async def assess_home_safety(
    floor_plan: UploadFile = File(...),
    room_type: str = "general",
    building_age: int = 0
):
    """Main endpoint for home safety assessment"""
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            content = await floor_plan.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Generate depth map
        depth_map = depth_service.estimate_depth(tmp_file_path)
        
        # Create 3D model
        original_image = cv2.imread(tmp_file_path)
        points_3d = depth_service.create_3d_model(depth_map, original_image)
        
        # Analyze safety risks
        room_info = {'type': room_type, 'age': building_age}
        risks = safety_analyzer.analyze_depth_map(depth_map, room_info)
        
        # Calculate safety score
        safety_score = safety_analyzer.calculate_safety_score(risks)
        
        # Generate report
        report = report_generator.generate_report(
            risks, safety_score, depth_map, points_3d
        )
        
        # Clean up
        os.unlink(tmp_file_path)
        
        return JSONResponse({
            "success": True,
            "safety_score": safety_score,
            "risks": risks,
            "depth_map": depth_map.tolist(),
            "points_3d": points_3d.tolist(),
            "report": report
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Plan2Protect AI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 5. Frontend Integration

### Update StartAssessment Component
```typescript
// src/pages/StartAssessment.tsx - Add AI integration
const handleSubmit = async () => {
  if (!selectedFile) return;
  
  setCurrentStep('processing');
  
  const formData = new FormData();
  formData.append('floor_plan', selectedFile);
  formData.append('room_type', 'general');
  formData.append('building_age', '0');
  
  try {
    const response = await fetch('http://localhost:8000/api/assess-safety', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      setResults({
        id: Date.now().toString(),
        overallScore: data.safety_score,
        criticalIssues: data.risks.filter(r => r.severity === 'high').length,
        mediumIssues: data.risks.filter(r => r.severity === 'medium').length,
        recommendations: data.risks.length,
        model3D: data.points_3d,
        riskZones: data.risks.map(risk => ({
          room: 'General',
          risk: risk.severity,
          description: risk.description
        })),
        timestamp: new Date().toISOString()
      });
      setCurrentStep('results');
    }
  } catch (error) {
    console.error('Assessment failed:', error);
    setCurrentStep('upload');
  }
};
```

## 6. Performance Optimization

### Model Optimization
```python
# Use smaller models for faster processing
# dpt_swin2_tiny_256.pt - 22 FPS on CPU
# dpt_beit_large_512.pt - Higher accuracy, slower

# Enable GPU acceleration
if torch.cuda.is_available():
    model = model.cuda()
    model.eval()

# Use TensorRT for further optimization
# model = torch2trt(model, [sample_input])
```

### Caching Strategy
```python
# Cache processed results
import hashlib
import pickle

def get_cache_key(image_path):
    with open(image_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def get_cached_result(cache_key):
    cache_file = f"cache/{cache_key}.pkl"
    if os.path.exists(cache_file):
        with open(cache_file, 'rb') as f:
            return pickle.load(f)
    return None

def cache_result(cache_key, result):
    os.makedirs("cache", exist_ok=True)
    cache_file = f"cache/{cache_key}.pkl"
    with open(cache_file, 'wb') as f:
        pickle.dump(result, f)
```

## 7. Deployment

### Docker Setup
```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Clone MiDaS
RUN git clone https://github.com/isl-org/MiDaS.git

# Copy application code
COPY . .

# Download model weights
RUN mkdir -p weights && \
    wget -O weights/dpt_beit_large_512.pt \
    https://github.com/isl-org/MiDaS/releases/download/v3_1/dpt_beit_large_512.pt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  plan2protect-ai:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./cache:/app/cache
    environment:
      - CUDA_VISIBLE_DEVICES=0  # Use GPU if available
```

## 8. Testing

### Test Script
```python
# test_midas_integration.py
import requests
import time

def test_assessment():
    url = "http://localhost:8000/api/assess-safety"
    
    with open("test_floor_plan.jpg", "rb") as f:
        files = {"floor_plan": f}
        data = {"room_type": "general", "building_age": "10"}
        
        start_time = time.time()
        response = requests.post(url, files=files, data=data)
        end_time = time.time()
        
        print(f"Processing time: {end_time - start_time:.2f} seconds")
        print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_assessment()
```

## 9. Next Steps

1. **Set up the backend** with the provided code
2. **Test MiDaS integration** with sample floor plans
3. **Integrate with frontend** by updating API calls
4. **Add more safety analysis** rules
5. **Optimize performance** for production
6. **Add user authentication** to API endpoints
7. **Implement result caching** for better performance

This integration will provide real AI-powered 2D to 3D conversion and safety analysis for your Plan2Protect platform! 