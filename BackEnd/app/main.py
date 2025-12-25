# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.cv_routes import router as cv_router

app = FastAPI(title="CV Analyzer API")

# أضف رابط الـ Vercel الخاص بك هنا ورابط الـ localhost للتجربة
origins = [
    "http://localhost:5173",
    "https://your-frontend-name.vercel.app", # استبدل هذا برابط موقعك الحقيقي على فيرسل
    "*" # هذا الخيار يسمح لجميع الروابط بالوصول (مفيد جداً لضمان عمل المشروع فوراً)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # نستخدم "*" مؤقتاً لضمان عدم حدوث بلوك (CORS Error)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ربط الـ router مع بادئة /api
app.include_router(cv_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "CV Analyzer Backend is running"}