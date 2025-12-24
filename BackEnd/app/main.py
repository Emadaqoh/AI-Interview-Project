# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.cv_routes import router as cv_router

app = FastAPI(title="CV Analyzer API")

# السماح للواجهة الأمامية بالوصول (Vite الافتراضي)
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ربط الـ router مع بادئة /api
app.include_router(cv_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "CV Analyzer Backend is running"}