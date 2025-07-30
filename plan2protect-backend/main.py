from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
import os
from datetime import datetime, timedelta
import json
import uuid

app = FastAPI(
    title="Plan2Protect Backend API", 
    version="1.0.0",
    description="Backend API for Plan2Protect - Home Safety Assessment Platform"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    plan: str = "free"

class UserLogin(BaseModel):
    email: EmailStr

class AssessmentData(BaseModel):
    user_id: str
    image_url: str
    status: str = "processing"
    created_at: str
    risk_score: Optional[float] = None
    recommendations: Optional[List[str]] = None

class PlanUpgrade(BaseModel):
    user_id: str
    plan: str

class UserProfile(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None

# In-memory storage (replace with database in production)
users_db = {}
assessments_db = {}

# Admin emails
ADMIN_EMAILS = ['aakarshit.cse@gmail.com', 'orthodox396@gmail.com']

# Plan configurations
PLAN_CONFIGS = {
    "free": {
        "name": "Free Plan",
        "price": 0,
        "assessments_limit": 1,
        "storage_limit": 50,  # MB
        "features": ["Basic assessment", "Email support"]
    },
    "monthly": {
        "name": "Monthly Plan",
        "price": 29.99,
        "assessments_limit": 10,
        "storage_limit": 500,  # MB
        "features": ["10 assessments/month", "Priority support", "Detailed reports"]
    },
    "yearly": {
        "name": "Yearly Plan",
        "price": 299.99,
        "assessments_limit": 100,
        "storage_limit": 2000,  # MB
        "features": ["100 assessments/year", "Priority support", "Detailed reports", "3D visualization"]
    },
    "bundle": {
        "name": "Bundle Plan",
        "price": 499.99,
        "assessments_limit": -1,  # Unlimited
        "storage_limit": 5000,  # MB
        "features": ["Unlimited assessments", "Priority support", "Detailed reports", "3D visualization", "API access"]
    }
}

@app.get("/", response_class=HTMLResponse)
async def root():
    """Welcome page with API documentation"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Plan2Protect Backend API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
            .method { font-weight: bold; color: #667eea; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏠 Plan2Protect Backend API</h1>
                <p>Home Safety Assessment Platform</p>
            </div>
            
            <div class="section">
                <h2>📊 API Status</h2>
                <p><strong>Status:</strong> ✅ Running</p>
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Timestamp:</strong> """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """</p>
            </div>
            
            <div class="section">
                <h2>🔗 Quick Links</h2>
                <p><a href="/docs" target="_blank">📖 Interactive API Documentation</a></p>
                <p><a href="/health" target="_blank">💚 Health Check</a></p>
                <p><a href="/api/analytics/overview" target="_blank">📈 Analytics Overview</a></p>
            </div>
            
            <div class="section">
                <h2>🚀 Key Endpoints</h2>
                <div class="endpoint">
                    <span class="method">GET</span> /health - Health check
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/users/create - Create user account
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/users/login - User login
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/assessments/create - Create assessment
                </div>
                <div class="endpoint">
                    <span class="method">GET</span> /api/analytics/overview - Analytics data
                </div>
            </div>
            
            <div class="section">
                <h2>👥 User Types</h2>
                <h3>Admin Users</h3>
                <ul>
                    <li>Use Firebase Authentication</li>
                    <li>Full access to admin panel</li>
                    <li>Can view all user data and analytics</li>
                </ul>
                
                <h3>Regular Users</h3>
                <ul>
                    <li>Email-only authentication</li>
                    <li>Access to assessment features</li>
                    <li>Plan-based limitations</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    """

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "users_count": len(users_db),
        "assessments_count": len(assessments_db),
        "admin_emails": ADMIN_EMAILS
    }

@app.get("/api/plans")
async def get_plans():
    """Get available subscription plans"""
    return {"plans": PLAN_CONFIGS}

# User Management Endpoints
@app.post("/api/users/create")
async def create_user(user: UserCreate):
    """Create a new regular user (no Firebase Auth)"""
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    if user.email in ADMIN_EMAILS:
        raise HTTPException(status_code=400, detail="Admin users must use Firebase Authentication")
    
    user_id = str(uuid.uuid4())
    user_data = {
        "uid": user_id,
        "email": user.email,
        "name": user.name,
        "plan": user.plan,
        "isAdmin": False,
        "createdAt": datetime.now().isoformat(),
        "lastLogin": datetime.now().isoformat(),
        "totalRevenue": 0,
        "monthlyRevenue": 0,
        "assessmentsCompleted": 0,
        "storageUsed": 0,
        "subscriptionStatus": "active"
    }
    
    users_db[user.email] = user_data
    
    return {
        "success": True,
        "message": "User created successfully",
        "user_id": user_id, 
        "user": user_data
    }

@app.post("/api/users/login")
async def login_user(login: UserLogin):
    """Login regular user by email"""
    if login.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found. Please sign up first.")
    
    user = users_db[login.email]
    user["lastLogin"] = datetime.now().isoformat()
    users_db[login.email] = user
    
    return {
        "success": True,
        "message": "Login successful",
        "user": user
    }

@app.get("/api/users/{email}")
async def get_user(email: str):
    """Get user by email"""
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": users_db[email]}

@app.get("/api/users")
async def get_all_users():
    """Get all users (admin only)"""
    return {
        "users": list(users_db.values()),
        "total_count": len(users_db),
        "admin_count": len([u for u in users_db.values() if u["isAdmin"]]),
        "regular_count": len([u for u in users_db.values() if not u["isAdmin"]])
    }

@app.put("/api/users/{user_id}/plan")
async def upgrade_plan(user_id: str, plan_upgrade: PlanUpgrade):
    """Upgrade user plan"""
    # Find user by ID
    user = None
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            user = user_data
            break
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if plan_upgrade.plan not in PLAN_CONFIGS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    # Calculate revenue based on plan
    plan_config = PLAN_CONFIGS[plan_upgrade.plan]
    
    user["plan"] = plan_upgrade.plan
    user["totalRevenue"] = plan_config["price"]
    user["monthlyRevenue"] = plan_config["price"] if plan_upgrade.plan == "monthly" else plan_config["price"] / 12
    user["subscriptionStatus"] = "active"
    user["planStartDate"] = datetime.now().isoformat()
    user["planEndDate"] = (datetime.now() + timedelta(days=365 if plan_upgrade.plan in ["yearly", "bundle"] else 30)).isoformat()
    
    # Update in database
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            users_db[email] = user
            break
    
    return {
        "success": True,
        "message": f"Plan upgraded to {plan_config['name']}",
        "user": user
    }

@app.put("/api/users/{user_id}/profile")
async def update_user_profile(user_id: str, profile: UserProfile):
    """Update user profile"""
    # Find user by ID
    user = None
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            user = user_data
            break
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if profile.name:
        user["name"] = profile.name
    
    # Update in database
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            users_db[email] = user
            break
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "user": user
    }

# Assessment Management Endpoints
@app.post("/api/assessments/create")
async def create_assessment(
    user_id: str = Form(...),
    image: UploadFile = File(...)
):
    """Create a new assessment"""
    if not image:
        raise HTTPException(status_code=400, detail="Image is required")
    
    # Validate user exists
    user = None
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            user = user_data
            break
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check plan limits
    plan_config = PLAN_CONFIGS[user["plan"]]
    if plan_config["assessments_limit"] != -1 and user["assessmentsCompleted"] >= plan_config["assessments_limit"]:
        raise HTTPException(
            status_code=403, 
            detail=f"Assessment limit reached for {plan_config['name']}. Please upgrade your plan."
        )
    
    # Save image
    file_extension = image.filename.split(".")[-1]
    filename = f"{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
    file_path = f"uploads/{filename}"
    
    with open(file_path, "wb") as buffer:
        content = await image.read()
        buffer.write(content)
    
    # Simulate image processing
    assessment_id = str(uuid.uuid4())
    
    assessment_data = {
        "id": assessment_id,
        "user_id": user_id,
        "image_url": f"/uploads/{filename}",
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "risk_score": None,
        "recommendations": None
    }
    
    assessments_db[assessment_id] = assessment_data
    
    # Update user assessment count
    user["assessmentsCompleted"] += 1
    user["lastAssessmentDate"] = datetime.now().isoformat()
    
    # Update user storage usage
    file_size_mb = len(content) / (1024 * 1024)
    user["storageUsed"] += file_size_mb
    
    # Check storage limit
    if user["storageUsed"] > plan_config["storage_limit"]:
        raise HTTPException(
            status_code=403,
            detail=f"Storage limit exceeded for {plan_config['name']}. Please upgrade your plan."
        )
    
    # Update user in database
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            users_db[email] = user_data
            break
    
    return {
        "success": True,
        "message": "Assessment created successfully",
        "assessment": assessment_data
    }

@app.get("/api/assessments/user/{user_id}")
async def get_user_assessments(user_id: str):
    """Get all assessments for a user"""
    user_assessments = [
        assessment for assessment in assessments_db.values()
        if assessment["user_id"] == user_id
    ]
    return {
        "assessments": user_assessments,
        "total_count": len(user_assessments)
    }

@app.get("/api/assessments/{assessment_id}")
async def get_assessment(assessment_id: str):
    """Get specific assessment"""
    if assessment_id not in assessments_db:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"assessment": assessments_db[assessment_id]}

@app.put("/api/assessments/{assessment_id}/complete")
async def complete_assessment(assessment_id: str):
    """Mark assessment as completed with results"""
    if assessment_id not in assessments_db:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment = assessments_db[assessment_id]
    assessment["status"] = "completed"
    assessment["risk_score"] = 85.5  # Simulated risk score
    assessment["recommendations"] = [
        "Install smoke detectors in all rooms",
        "Check electrical wiring regularly",
        "Keep fire extinguishers accessible",
        "Ensure proper ventilation in kitchen",
        "Regular maintenance of heating systems"
    ]
    
    assessments_db[assessment_id] = assessment
    return {
        "success": True,
        "message": "Assessment completed",
        "assessment": assessment
    }

# Analytics Endpoints
@app.get("/api/analytics/overview")
async def get_analytics_overview():
    """Get analytics overview for admin panel"""
    total_users = len(users_db)
    active_users = len([u for u in users_db.values() if u["subscriptionStatus"] == "active"])
    premium_users = len([u for u in users_db.values() if u["plan"] != "free"])
    
    total_revenue = sum(u["totalRevenue"] for u in users_db.values())
    monthly_revenue = sum(u["monthlyRevenue"] for u in users_db.values())
    
    total_assessments = sum(u["assessmentsCompleted"] for u in users_db.values())
    total_storage = sum(u["storageUsed"] for u in users_db.values())
    
    # Plan distribution
    plan_distribution = {}
    for user in users_db.values():
        plan = user["plan"]
        plan_distribution[plan] = plan_distribution.get(plan, 0) + 1
    
    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "premiumUsers": premium_users,
        "totalRevenue": total_revenue,
        "monthlyRevenue": monthly_revenue,
        "totalAssessments": total_assessments,
        "totalStorageUsed": total_storage,
        "planDistribution": plan_distribution,
        "lastUpdated": datetime.now().isoformat()
    }

@app.get("/api/analytics/users")
async def get_users_analytics():
    """Get detailed user analytics"""
    return {
        "users": list(users_db.values()),
        "totalCount": len(users_db),
        "adminCount": len([u for u in users_db.values() if u["isAdmin"]]),
        "regularCount": len([u for u in users_db.values() if not u["isAdmin"]])
    }

# Utility Endpoints
@app.post("/api/users/{user_id}/update-storage")
async def update_user_storage(user_id: str, storage_used: float):
    """Update user storage usage"""
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            user_data["storageUsed"] = storage_used
            users_db[email] = user_data
            return {
                "success": True,
                "message": "Storage updated successfully",
                "user": user_data
            }
    
    raise HTTPException(status_code=404, detail="User not found")

@app.get("/api/check-admin/{email}")
async def check_admin_status(email: str):
    """Check if email is admin"""
    return {"isAdmin": email in ADMIN_EMAILS}

@app.get("/api/user-limits/{user_id}")
async def get_user_limits(user_id: str):
    """Get user plan limits and current usage"""
    # Find user by ID
    user = None
    for email, user_data in users_db.items():
        if user_data["uid"] == user_id:
            user = user_data
            break
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    plan_config = PLAN_CONFIGS[user["plan"]]
    
    return {
        "user": user,
        "plan": plan_config,
        "usage": {
            "assessments": {
                "used": user["assessmentsCompleted"],
                "limit": plan_config["assessments_limit"],
                "remaining": plan_config["assessments_limit"] - user["assessmentsCompleted"] if plan_config["assessments_limit"] != -1 else -1
            },
            "storage": {
                "used": user["storageUsed"],
                "limit": plan_config["storage_limit"],
                "remaining": plan_config["storage_limit"] - user["storageUsed"]
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
