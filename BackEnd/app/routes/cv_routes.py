from fastapi import APIRouter, UploadFile, File, HTTPException
# تم تغيير analyze_with_phi3 إلى analyze_with_groq لتتناسب مع الخدمة الجديدة
from app.services.cv_service import extract_text, analyze_with_groq
from pydantic import BaseModel
from typing import List
from groq import Groq # استيراد مكتبة Groq
import json
import os
from dotenv import load_dotenv

router = APIRouter()

# 1. شحن المتغيرات من ملف .env
load_dotenv()

# 2. الحصول على المفتاح من بيئة النظام
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# 3. التأكد من أن المفتاح تم قراءته بنجاح (خطوة اختيارية للحماية)
if not GROQ_API_KEY:
    raise ValueError("الرجاء التأكد من وضع GROQ_API_KEY في ملف .env")

# 4. تعريف الكلاينت الآن سيعمل بدون مشاكل
client = Groq(api_key=GROQ_API_KEY)

# نماذج البيانات (Pydantic Models)
class SkillsRequest(BaseModel):
    skills: List[str]

class AssessmentRequest(BaseModel):
    questions: List[str]
    answers: List[str]

# 1. راوت رفع وتحليل السيرة الذاتية
@router.post("/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    text = extract_text(file.file, file.filename)
    
    if text is None:
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    # استخدام Groq للتحليل بدلاً من Phi-3
    analysis_result = analyze_with_groq(text)
    
    return {
        "filename": file.filename,
        "analysis": analysis_result
    }

# 2. راوت توليد أسئلة المقابلة (مباشرة ونصية)
@router.post("/generate-questions")
async def generate_questions(request: SkillsRequest):
    skills_text = ", ".join(request.skills)
    
    prompt = f"""
    Create 5 professional direct interview questions (open-ended) based on these skills: {skills_text}.
    Return ONLY a JSON object with a key 'questions' containing an array of strings.
    Format: {{"questions": ["Q1", "Q2", ...]}}
    """

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return result # سيعيد {"questions": [...]} كما يتوقع الفرونت إند عندك
        
    except Exception as e:
        print(f"Error: {e}")
        return {"questions": ["Could you describe your technical background?", "How do you stay updated with new technologies?"]}

# 3. راوت تقييم إجابات الموظف
@router.post("/evaluate-answers")
async def evaluate_answers(request: AssessmentRequest):
    # صمام أمان: إذا كانت كل الإجابات فارغة
    if all(not a.strip() for a in request.answers):
        return {
            "total_score": 0,
            "strengths": [],
            "weaknesses": ["Candidate provided no answers"],
            "overall_feedback": "الموظف لم يقم بالإجابة على أي سؤال."
        }

    qa_pairs = ""
    for q, a in zip(request.questions, request.answers):
        answer_text = a.strip() if a.strip() else "NO ANSWER PROVIDED"
        qa_pairs += f"Question: {q}\nAnswer: {answer_text}\n---\n"
    
    prompt = f"""
    Strict HR Evaluation: Analyze the following Q&A. 
    If the answer is 'NO ANSWER PROVIDED' or 'I don't know', score it as 0.
    
    QA Pairs:
    {qa_pairs}
    
    Return ONLY a JSON object:
    {{
      "total_score": integer (0-100),
      "strengths": ["list"],
      "weaknesses": ["list"],
      "overall_feedback": "string"
    }}
    """

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Evaluation Error: {e}")
        return {"total_score": 0, "overall_feedback": "حدث خطأ أثناء تحليل التقييم."}


# from fastapi import APIRouter, UploadFile, File, HTTPException
# from app.services.cv_service import extract_text, analyze_with_phi3
# from pydantic import BaseModel
# from typing import List
# import requests
# import json

# router = APIRouter()

# # نموذج لاستقبال البيانات القادمة من الفرونت إند
# class SkillsRequest(BaseModel):
#     skills: List[str]

# @router.post("/upload-cv")
# async def upload_cv(file: UploadFile = File(...)):
#     # 1. استخراج النص
#     text = extract_text(file.file, file.filename)
    
#     if text is None:
#         raise HTTPException(status_code=400, detail="Unsupported file format")
    
#     if not text.strip():
#         raise HTTPException(status_code=400, detail="Could not extract text from file")

#     # 2. تحليل النص باستخدام Phi-3
#     analysis_result = analyze_with_phi3(text)
    
#     return {
#         "filename": file.filename,
#         "analysis": analysis_result
#     }

# # --- الجزء الجديد المضاف لتوليد الأسئلة ---
# @router.post("/generate-questions")
# async def generate_questions(request: SkillsRequest):
#     url = "http://localhost:11434/api/generate"
#     skills_text = ", ".join(request.skills)
    
#     prompt = f"""
#     Create 5 professional direct interview questions (open-ended).
#     The candidate has these skills: {skills_text}.
#     Return ONLY a JSON array of strings.
#     Example format: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
#     """

#     try:
#         response = requests.post(url, json={
#             "model": "phi3", "prompt": prompt, "stream": False, "format": "json"
#         }, timeout=120)
        
#         raw_res = response.json().get("response", "[]")
#         # تحويل النص المستخرج لقائمة بايثون
#         questions_list = json.loads(raw_res)
#         return questions_list # ستكون عبارة عن مصفوفة نصوص
        
#     except Exception as e:
#         return ["Describe your experience with your core skills?", "How do you handle project deadlines?"]
    

# # أضف هذا النموذج في الأعلى مع SkillsRequest
# class AssessmentRequest(BaseModel):
#     questions: List[str]
#     answers: List[str]

# @router.post("/evaluate-answers")
# async def evaluate_answers(request: AssessmentRequest):
#     url = "http://localhost:11434/api/generate"
    
#     qa_pairs = ""
#     for q, a in zip(request.questions, request.answers):
#         # نرسل الإجابة أو كلمة 'Empty' إذا كانت فارغة
#         answer_text = a.strip() if a.strip() else "NO ANSWER PROVIDED"
#         qa_pairs += f"Question: {q}\nCandidate Answer: {answer_text}\n---\n"
    
#     prompt = f"""
#     Strict Evaluation Task: 
#     Analyze the following interview Q&A. 
#     CRITICAL RULE: If the 'Candidate Answer' is "NO ANSWER PROVIDED" or contains only random characters, the score for that question MUST BE 0.
#     Only give a high score for relevant, professional, and technical answers.

#     QA Pairs:
#     {qa_pairs}
    
#     Return ONLY a JSON object:
#     {{
#       "total_score": integer (0-100),
#       "strengths": ["list of strings"],
#       "weaknesses": ["list of strings"],
#       "overall_feedback": "string"
#     }}
#     """

#     try:
#         response = requests.post(url, json={
#             "model": "phi3", "prompt": prompt, "stream": False, "format": "json"
#         }, timeout=150)
        
#         result = json.loads(response.json().get("response", "{}"))
        
#         # صمام أمان برميجي: إذا كانت كل الإجابات فارغة، صفر النتيجة تلقائياً قبل الإرسال
#         if all(not a.strip() for a in request.answers):
#             return {
#                 "total_score": 0,
#                 "strengths": [],
#                 "weaknesses": ["لم يتم تقديم أي إجابات للمراجعة"],
#                 "overall_feedback": "الموظف لم يجب على أي سؤال خلال المقابلة."
#             }
            
#         return result
#     except Exception as e:
#         return {"total_score": 0, "overall_feedback": "Error analyzing empty answers."}