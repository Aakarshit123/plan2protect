from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
import cv2
import numpy as np
# import torch  # Commented out for testing
import sys
import json
from typing import List, Dict, Any

app = FastAPI(title="Plan2Protect 3D Generator")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulate MiDaS model (for demo purposes)
# In production, you would load the actual MiDaS model
class MockMiDaS:
    def __init__(self):
        # self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using CPU for mock processing")
    
    def generate_depth_map(self, image_path: str) -> np.ndarray:
        """Generate a mock depth map for demonstration"""
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not load image")
        
        # Convert to grayscale for depth simulation
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        
        # Create a mock depth map (simulating distance from camera)
        # In real MiDaS, this would be the actual depth prediction
        depth_map = np.zeros((height, width), dtype=np.float32)
        
        # Simulate depth based on image intensity and position
        for y in range(height):
            for x in range(width):
                # Simulate depth: darker areas are "further away"
                intensity = gray[y, x] / 255.0
                # Add some spatial variation
                center_distance = np.sqrt((x - width/2)**2 + (y - height/2)**2)
                depth_map[y, x] = (1 - intensity) * 0.8 + (center_distance / (width/2)) * 0.2
        
        return depth_map
    
    def create_3d_points(self, depth_map: np.ndarray) -> List[List[float]]:
        """Convert depth map to 3D point cloud"""
        height, width = depth_map.shape
        points_3d = []
        
        # Sample points (every 10th pixel for performance)
        for y in range(0, height, 10):
            for x in range(0, width, 10):
                depth = depth_map[y, x]
                # Normalize coordinates
                x_norm = (x - width/2) / (width/2)
                y_norm = (y - height/2) / (height/2)
                z_norm = depth
                
                points_3d.append([x_norm, y_norm, z_norm])
        
        return points_3d

# Initialize mock model
model = MockMiDaS()

@app.post("/api/generate-3d")
async def generate_3d_model(image: UploadFile = File(...)):
    """Generate 3D model from uploaded image"""
    try:
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            content = await image.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Generate depth map
        depth_map = model.generate_depth_map(tmp_file_path)
        
        # Create 3D point cloud
        points_3d = model.create_3d_points(depth_map)
        
        # Load original image for size info
        img = cv2.imread(tmp_file_path)
        original_size = img.shape[:2]
        
        # Clean up
        os.unlink(tmp_file_path)
        
        # Calculate mock safety metrics
        avg_depth = np.mean(depth_map)
        depth_variance = np.var(depth_map)
        
        # Simulate safety analysis
        safety_score = max(50, min(95, int(70 + avg_depth * 20 - depth_variance * 10)))
        critical_issues = max(0, int(5 - avg_depth * 3))
        medium_issues = max(0, int(8 - avg_depth * 4))
        
        return JSONResponse({
            "success": True,
            "depth_map": depth_map.tolist(),
            "points_3d": points_3d,
            "original_size": original_size,
            "safety_metrics": {
                "overall_score": safety_score,
                "critical_issues": critical_issues,
                "medium_issues": medium_issues,
                "recommendations": max(1, critical_issues + medium_issues)
            },
            "message": "3D model generated successfully!"
        })
        
    except Exception as e:
        print(f"Error generating 3D model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Plan2Protect 3D Generator"}

@app.get("/")
async def root():
    return {"message": "Plan2Protect 3D Generator API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Plan2Protect 3D Generator...")
    print("📡 API will be available at: http://localhost:8000")
    print("🔗 Frontend should connect to: http://localhost:5173")
    uvicorn.run(app, host="0.0.0.0", port=8000) 