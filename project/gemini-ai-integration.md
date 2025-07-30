# Plan2Protect Gemini AI Integration

## Overview
Integrate Google's Gemini AI for advanced reasoning, natural language processing, and intelligent safety analysis in home assessments.

## 1. Gemini AI Setup

### Install Dependencies
```bash
pip install google-generativeai
pip install python-dotenv
```

### Environment Configuration
```bash
# .env file
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_VISION_MODEL=gemini-pro-vision
```

## 2. Gemini AI Service Implementation

### Core Gemini Service
```python
# services/gemini_service.py
import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import Dict, List, Any
import base64
import json

load_dotenv()

class GeminiAIService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        genai.configure(api_key=self.api_key)
        
        # Initialize models
        self.text_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        
        # Safety analysis prompts
        self.safety_prompts = {
            'floor_plan_analysis': """
            Analyze this floor plan for home safety concerns. Consider:
            1. Emergency exit accessibility
            2. Fire safety (kitchen placement, smoke detector locations)
            3. Trip and fall hazards (stairs, uneven surfaces)
            4. Child safety (balconies, sharp corners)
            5. Electrical safety (outlet placement, wiring)
            6. Natural disaster preparedness (earthquake, flood zones)
            
            Provide a detailed analysis with:
            - Overall safety score (0-100)
            - Critical issues (high priority)
            - Moderate issues (medium priority)
            - Minor issues (low priority)
            - Specific recommendations for each issue
            - Estimated cost for safety improvements
            """,
            
            'depth_map_analysis': """
            Analyze this 3D depth map for structural safety concerns:
            1. Sudden depth changes (potential tripping hazards)
            2. Uneven surfaces
            3. Structural integrity indicators
            4. Accessibility issues
            5. Room layout safety
            
            Focus on:
            - Hazard identification
            - Risk assessment
            - Safety recommendations
            - Priority levels for fixes
            """,
            
            'room_specific_analysis': """
            Analyze this {room_type} for specific safety concerns:
            
            {room_specific_prompts}
            
            Provide:
            - Room-specific safety score
            - Critical safety issues
            - Improvement recommendations
            - Cost estimates
            - Priority timeline
            """
        }
    
    def analyze_floor_plan(self, floor_plan_image: str, room_info: Dict) -> Dict:
        """Analyze floor plan using Gemini Vision"""
        try:
            # Convert image to base64 if needed
            if isinstance(floor_plan_image, str) and not floor_plan_image.startswith('data:'):
                with open(floor_plan_image, 'rb') as img_file:
                    image_data = base64.b64encode(img_file.read()).decode()
            else:
                image_data = floor_plan_image
            
            # Create prompt with room information
            prompt = self.safety_prompts['floor_plan_analysis']
            if room_info.get('type'):
                room_prompt = self.safety_prompts['room_specific_analysis'].format(
                    room_type=room_info['type'],
                    room_specific_prompts=self._get_room_specific_prompts(room_info['type'])
                )
                prompt += f"\n\n{room_prompt}"
            
            # Generate analysis
            response = self.vision_model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": image_data}
            ])
            
            # Parse response
            analysis = self._parse_safety_analysis(response.text)
            return analysis
            
        except Exception as e:
            return {
                "error": str(e),
                "safety_score": 50,
                "issues": [],
                "recommendations": []
            }
    
    def analyze_depth_map(self, depth_map_data: str, original_image: str) -> Dict:
        """Analyze 3D depth map for structural safety"""
        try:
            prompt = self.safety_prompts['depth_map_analysis']
            
            response = self.vision_model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": depth_map_data},
                {"mime_type": "image/jpeg", "data": original_image}
            ])
            
            analysis = self._parse_depth_analysis(response.text)
            return analysis
            
        except Exception as e:
            return {
                "error": str(e),
                "structural_issues": [],
                "risk_assessment": "medium"
            }
    
    def generate_safety_report(self, assessment_data: Dict) -> str:
        """Generate comprehensive safety report using Gemini"""
        try:
            prompt = f"""
            Generate a professional home safety assessment report based on the following data:
            
            Assessment Results:
            - Overall Safety Score: {assessment_data.get('safety_score', 0)}/100
            - Critical Issues: {len(assessment_data.get('critical_issues', []))}
            - Moderate Issues: {len(assessment_data.get('moderate_issues', []))}
            - Minor Issues: {len(assessment_data.get('minor_issues', []))}
            
            Issues Found:
            {json.dumps(assessment_data.get('issues', []), indent=2)}
            
            Recommendations:
            {json.dumps(assessment_data.get('recommendations', []), indent=2)}
            
            Please create a comprehensive report that includes:
            1. Executive Summary
            2. Safety Score Breakdown
            3. Critical Issues (with detailed explanations)
            4. Moderate Issues (with explanations)
            5. Minor Issues (with explanations)
            6. Detailed Recommendations
            7. Cost Estimates
            8. Implementation Timeline
            9. Emergency Contact Information
            10. Next Steps
            
            Format the report professionally with clear sections, bullet points, and actionable items.
            """
            
            response = self.text_model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            return f"Error generating report: {str(e)}"
    
    def answer_safety_questions(self, question: str, context: Dict) -> str:
        """Answer user questions about safety using Gemini"""
        try:
            prompt = f"""
            Context: Home safety assessment data
            {json.dumps(context, indent=2)}
            
            Question: {question}
            
            Please provide a helpful, accurate answer based on the assessment data and general home safety knowledge.
            Include specific recommendations if applicable.
            """
            
            response = self.text_model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            return f"Error answering question: {str(e)}"
    
    def _get_room_specific_prompts(self, room_type: str) -> str:
        """Get room-specific safety prompts"""
        prompts = {
            'kitchen': """
            Kitchen-specific safety analysis:
            - Fire hazards (stove, oven, electrical appliances)
            - Sharp object storage
            - Chemical storage (cleaning products)
            - Ventilation and air quality
            - Child safety measures
            - Emergency shut-off locations
            """,
            
            'bathroom': """
            Bathroom-specific safety analysis:
            - Slip and fall hazards
            - Water damage indicators
            - Electrical safety (outlets near water)
            - Ventilation and mold prevention
            - Accessibility features
            - Emergency grab bars
            """,
            
            'bedroom': """
            Bedroom-specific safety analysis:
            - Emergency exit accessibility
            - Window safety
            - Electrical outlet placement
            - Furniture stability
            - Child safety (if applicable)
            - Air quality and ventilation
            """,
            
            'living_room': """
            Living room-specific safety analysis:
            - Furniture arrangement safety
            - Electrical cord management
            - Fireplace safety
            - Window and door security
            - Lighting and visibility
            - Trip hazard identification
            """,
            
            'basement': """
            Basement-specific safety analysis:
            - Moisture and mold issues
            - Structural integrity
            - Emergency exit accessibility
            - Electrical safety
            - Radon gas concerns
            - Flood risk assessment
            """
        }
        
        return prompts.get(room_type, "General room safety analysis")
    
    def _parse_safety_analysis(self, response_text: str) -> Dict:
        """Parse Gemini response into structured data"""
        try:
            # Extract safety score
            safety_score = 50  # default
            if "safety score" in response_text.lower():
                import re
                score_match = re.search(r'(\d+)/100', response_text)
                if score_match:
                    safety_score = int(score_match.group(1))
            
            # Extract issues by priority
            critical_issues = []
            moderate_issues = []
            minor_issues = []
            
            lines = response_text.split('\n')
            current_section = None
            
            for line in lines:
                line_lower = line.lower()
                if 'critical' in line_lower or 'high priority' in line_lower:
                    current_section = 'critical'
                elif 'moderate' in line_lower or 'medium priority' in line_lower:
                    current_section = 'moderate'
                elif 'minor' in line_lower or 'low priority' in line_lower:
                    current_section = 'minor'
                elif line.strip().startswith('-') or line.strip().startswith('•'):
                    issue = line.strip()[1:].strip()
                    if current_section == 'critical':
                        critical_issues.append(issue)
                    elif current_section == 'moderate':
                        moderate_issues.append(issue)
                    elif current_section == 'minor':
                        minor_issues.append(issue)
            
            return {
                "safety_score": safety_score,
                "critical_issues": critical_issues,
                "moderate_issues": moderate_issues,
                "minor_issues": minor_issues,
                "raw_analysis": response_text,
                "recommendations": self._extract_recommendations(response_text)
            }
            
        except Exception as e:
            return {
                "safety_score": 50,
                "critical_issues": [],
                "moderate_issues": [],
                "minor_issues": [],
                "raw_analysis": response_text,
                "error": str(e)
            }
    
    def _parse_depth_analysis(self, response_text: str) -> Dict:
        """Parse depth map analysis response"""
        try:
            structural_issues = []
            risk_assessment = "medium"
            
            lines = response_text.split('\n')
            for line in lines:
                if line.strip().startswith('-') or line.strip().startswith('•'):
                    issue = line.strip()[1:].strip()
                    structural_issues.append(issue)
            
            # Determine risk level
            if 'high risk' in response_text.lower() or 'critical' in response_text.lower():
                risk_assessment = "high"
            elif 'low risk' in response_text.lower() or 'minimal' in response_text.lower():
                risk_assessment = "low"
            
            return {
                "structural_issues": structural_issues,
                "risk_assessment": risk_assessment,
                "raw_analysis": response_text
            }
            
        except Exception as e:
            return {
                "structural_issues": [],
                "risk_assessment": "medium",
                "raw_analysis": response_text,
                "error": str(e)
            }
    
    def _extract_recommendations(self, text: str) -> List[str]:
        """Extract recommendations from analysis text"""
        recommendations = []
        lines = text.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in ['recommend', 'suggest', 'should', 'need to']):
                if line.strip().startswith('-') or line.strip().startswith('•'):
                    recommendations.append(line.strip()[1:].strip())
                elif line.strip():
                    recommendations.append(line.strip())
        
        return recommendations
```

## 3. Enhanced API Integration

### Updated FastAPI Endpoints
```python
# main.py - Enhanced with Gemini AI
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from services.depth_estimation import DepthEstimationService
from services.gemini_service import GeminiAIService
from services.risk_assessment import SafetyAnalyzer

app = FastAPI(title="Plan2Protect AI Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
depth_service = DepthEstimationService()
gemini_service = GeminiAIService()
safety_analyzer = SafetyAnalyzer()

@app.post("/api/assess-safety-ai")
async def assess_home_safety_ai(
    floor_plan: UploadFile = File(...),
    room_type: str = Query("general", description="Type of room being assessed"),
    building_age: int = Query(0, description="Age of the building"),
    include_gemini_analysis: bool = Query(True, description="Include Gemini AI analysis")
):
    """Enhanced safety assessment with Gemini AI"""
    try:
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            content = await floor_plan.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Generate depth map using MiDaS
        depth_map = depth_service.estimate_depth(tmp_file_path)
        points_3d = depth_service.create_3d_model(depth_map, cv2.imread(tmp_file_path))
        
        # Traditional safety analysis
        room_info = {'type': room_type, 'age': building_age}
        traditional_risks = safety_analyzer.analyze_depth_map(depth_map, room_info)
        traditional_score = safety_analyzer.calculate_safety_score(traditional_risks)
        
        # Gemini AI analysis
        gemini_analysis = {}
        if include_gemini_analysis:
            # Convert image to base64 for Gemini
            with open(tmp_file_path, 'rb') as img_file:
                import base64
                image_base64 = base64.b64encode(img_file.read()).decode()
            
            # Get Gemini analysis
            gemini_analysis = gemini_service.analyze_floor_plan(
                image_base64, room_info
            )
            
            # Combine traditional and AI analysis
            combined_score = (traditional_score + gemini_analysis.get('safety_score', 50)) / 2
        else:
            combined_score = traditional_score
        
        # Generate comprehensive report
        assessment_data = {
            'safety_score': combined_score,
            'traditional_score': traditional_score,
            'gemini_score': gemini_analysis.get('safety_score', 0),
            'critical_issues': gemini_analysis.get('critical_issues', []),
            'moderate_issues': gemini_analysis.get('moderate_issues', []),
            'minor_issues': gemini_analysis.get('minor_issues', []),
            'traditional_risks': traditional_risks,
            'recommendations': gemini_analysis.get('recommendations', [])
        }
        
        # Generate AI-powered report
        ai_report = gemini_service.generate_safety_report(assessment_data)
        
        # Clean up
        os.unlink(tmp_file_path)
        
        return JSONResponse({
            "success": True,
            "safety_score": combined_score,
            "traditional_analysis": {
                "score": traditional_score,
                "risks": traditional_risks
            },
            "ai_analysis": gemini_analysis,
            "depth_map": depth_map.tolist(),
            "points_3d": points_3d.tolist(),
            "ai_report": ai_report,
            "assessment_data": assessment_data
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ask-safety-question")
async def ask_safety_question(
    question: str = Query(..., description="Safety-related question"),
    assessment_context: dict = Query(..., description="Assessment context data")
):
    """Ask Gemini AI safety questions"""
    try:
        answer = gemini_service.answer_safety_questions(question, assessment_context)
        return JSONResponse({
            "success": True,
            "question": question,
            "answer": answer
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-safety-report")
async def generate_safety_report(
    assessment_data: dict = Query(..., description="Assessment data for report generation")
):
    """Generate comprehensive safety report using Gemini AI"""
    try:
        report = gemini_service.generate_safety_report(assessment_data)
        return JSONResponse({
            "success": True,
            "report": report
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 4. Frontend Integration

### Enhanced StartAssessment Component
```typescript
// src/pages/StartAssessment.tsx - Enhanced with Gemini AI
const handleSubmit = async () => {
  if (!selectedFile) return;
  
  setCurrentStep('processing');
  
  const formData = new FormData();
  formData.append('floor_plan', selectedFile);
  formData.append('room_type', 'general');
  formData.append('building_age', '0');
  formData.append('include_gemini_analysis', 'true');
  
  try {
    const response = await fetch('http://localhost:8000/api/assess-safety-ai', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      setResults({
        id: Date.now().toString(),
        overallScore: data.safety_score,
        criticalIssues: data.ai_analysis.critical_issues?.length || 0,
        mediumIssues: data.ai_analysis.moderate_issues?.length || 0,
        recommendations: data.ai_analysis.recommendations?.length || 0,
        model3D: data.points_3d,
        riskZones: [
          ...data.ai_analysis.critical_issues?.map(issue => ({
            room: 'General',
            risk: 'high',
            description: issue
          })) || [],
          ...data.ai_analysis.moderate_issues?.map(issue => ({
            room: 'General',
            risk: 'medium',
            description: issue
          })) || [],
          ...data.ai_analysis.minor_issues?.map(issue => ({
            room: 'General',
            risk: 'low',
            description: issue
          })) || []
        ],
        timestamp: new Date().toISOString(),
        aiReport: data.ai_report,
        traditionalScore: data.traditional_analysis.score,
        aiScore: data.ai_analysis.safety_score
      });
      setCurrentStep('results');
    }
  } catch (error) {
    console.error('Assessment failed:', error);
    setCurrentStep('upload');
  }
};

// Add AI chat functionality
const [safetyQuestion, setSafetyQuestion] = useState('');
const [aiAnswer, setAiAnswer] = useState('');

const askSafetyQuestion = async () => {
  if (!safetyQuestion.trim() || !results) return;
  
  try {
    const response = await fetch('http://localhost:8000/api/ask-safety-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: safetyQuestion,
        assessment_context: results
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      setAiAnswer(data.answer);
    }
  } catch (error) {
    console.error('Failed to get AI answer:', error);
  }
};
```

## 5. Premium Features Enhancement

### AI-Powered Premium Features
```typescript
// Enhanced premium features with Gemini AI
const PremiumFeatures = () => {
  return (
    <div className="premium-features">
      <h3>AI-Powered Premium Features</h3>
      
      {/* AI Safety Chat */}
      <div className="ai-chat-section">
        <h4>Ask AI Safety Expert</h4>
        <div className="chat-interface">
          <input
            type="text"
            placeholder="Ask about safety concerns..."
            value={safetyQuestion}
            onChange={(e) => setSafetyQuestion(e.target.value)}
          />
          <button onClick={askSafetyQuestion}>Ask AI</button>
        </div>
        {aiAnswer && (
          <div className="ai-response">
            <h5>AI Safety Expert Response:</h5>
            <p>{aiAnswer}</p>
          </div>
        )}
      </div>
      
      {/* AI-Generated Reports */}
      <div className="ai-reports-section">
        <h4>AI-Generated Safety Reports</h4>
        <button onClick={generateAIReport}>
          Generate Comprehensive AI Report
        </button>
        {aiReport && (
          <div className="ai-report">
            <h5>AI Safety Analysis Report:</h5>
            <div dangerouslySetInnerHTML={{ __html: aiReport }} />
          </div>
        )}
      </div>
      
      {/* Comparison Analysis */}
      <div className="comparison-section">
        <h4>Traditional vs AI Analysis</h4>
        <div className="score-comparison">
          <div className="traditional-score">
            <h5>Traditional Analysis</h5>
            <div className="score">{traditionalScore}/100</div>
          </div>
          <div className="ai-score">
            <h5>AI Analysis</h5>
            <div className="score">{aiScore}/100</div>
          </div>
          <div className="combined-score">
            <h5>Combined Score</h5>
            <div className="score">{overallScore}/100</div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 6. Environment Setup

### Environment Variables
```bash
# .env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_VISION_MODEL=gemini-pro-vision
MIDAS_MODEL_PATH=weights/dpt_beit_large_512.pt
```

### Docker Configuration
```dockerfile
# Dockerfile - Enhanced with Gemini
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
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

## 7. Benefits of Gemini AI Integration

### Enhanced Analysis
- **Natural Language Understanding**: Better interpretation of safety concerns
- **Contextual Reasoning**: Room-specific safety analysis
- **Comprehensive Reports**: Detailed, professional safety reports
- **Interactive Q&A**: Users can ask safety questions

### Premium Value
- **AI Chat Interface**: Real-time safety consultation
- **Advanced Reports**: Professional-grade safety documentation
- **Comparative Analysis**: Traditional vs AI assessment comparison
- **Personalized Recommendations**: Tailored safety advice

### Technical Advantages
- **Multi-modal Analysis**: Text and image understanding
- **Scalable Architecture**: Easy to extend with new features
- **Error Handling**: Robust fallback mechanisms
- **Performance Optimization**: Caching and efficient processing

This integration combines the power of MiDaS for 2D to 3D conversion with Gemini AI for intelligent reasoning, creating a comprehensive AI-powered home safety assessment platform! 