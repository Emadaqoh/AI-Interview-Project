import React, { useState } from 'react';
import DualPanelUploader from './components/DualPanelUploader';
import InterviewPage from './components/InterviewPage';
import axios from 'axios';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // 1. دالة تستدعى عند اكتمال تحليل الـ CV من اللوحة اليسرى
  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
  };

  // 2. دالة لجلب الأسئلة والانتقال لصفحة المقابلة
  const startInterview = async () => {
    if (!analysisData || !analysisData.skills) return;

    setLoadingQuestions(true);
    try {
      // تم استبدال الرابط الكامل بمسار الـ endpoint فقط
      const res = await api.post("/api/generate-questions", {
        skills: analysisData.skills
      });
      
      setQuestions(res.data.questions);
      setIsInterviewMode(true);
    } catch (err) {
      console.error("خطأ في جلب الأسئلة:", err);
      alert("فشل في توليد الأسئلة");
    } finally {
      setLoadingQuestions(false);
    }
};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* شاشة التحميل عند توليد الأسئلة */}
      {loadingQuestions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-bold text-slate-700">جاري توليد أسئلة مخصصة لك...</p>
          </div>
        </div>
      )}

      {/* التنقل بين الواجهات */}
      {!isInterviewMode ? (
        <DualPanelUploader 
          onAnalysisComplete={handleAnalysisComplete} 
          onStartInterview={startInterview}
        />
      ) : (
        <div className="animate-in fade-in duration-700">
           <InterviewPage 
             questions={questions} 
             onBack={() => setIsInterviewMode(false)} 
           />
        </div>
      )}
    </div>
  );
}

export default App;