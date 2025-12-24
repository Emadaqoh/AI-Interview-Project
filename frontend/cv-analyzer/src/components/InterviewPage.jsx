import React, { useState } from 'react';
import api from '../api/axiosConfig'; // تأكد من صحة المسار حسب مكان الملف

function InterviewPage({ questions = [], onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loadingEval, setLoadingEval] = useState(false);

  // نأخذ أول 5 أسئلة فقط لضمان العدد المطلوب
  const limitedQuestions = questions.slice(0, 5);

  const handleFinish = async () => {
    const finalAnswers = [...answers, currentAnswer];
    setLoadingEval(true);
    try {
      const res = await api.post("/api/evaluate-answers", {
        questions: limitedQuestions,
        answers: finalAnswers
      });
      setEvaluation(res.data);
    } catch (err) {
      alert("خطأ في تقييم الإجابات");
    } finally {
      setLoadingEval(false);
    }
};

  // شاشة النتيجة النهائية (تنسيق متناسق مع اللوحة الإدارية)
  if (evaluation) return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-slate-900 p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Employee Evaluation Report</h2>
          <p className="text-slate-400 text-sm tracking-widest uppercase">AI Intelligent Assessment</p>
          <div className="text-7xl font-black text-blue-500 mt-8 mb-2">{evaluation.total_score}%</div>
          <p className="text-slate-300 font-medium">Overall Score</p>
        </div>
        
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 rounded-full"></span> Key Strengths
            </h4>
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <ul className="space-y-3">
                {evaluation.strengths?.map((s, i) => (
                  <li key={i} className="text-green-800 text-sm flex gap-2">
                    <span>•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span> Development Areas
            </h4>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <ul className="space-y-3">
                {evaluation.weaknesses?.map((w, i) => (
                  <li key={i} className="text-amber-800 text-sm flex gap-2">
                    <span>•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="px-10 pb-10">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-blue-600 font-bold mb-2 text-sm uppercase">General Feedback</h4>
            <p className="text-slate-700 leading-relaxed italic">"{evaluation.overall_feedback}"</p>
          </div>
          <button 
            onClick={onBack} 
            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Close Report & Return Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      {/* Loading Overlay */}
      {loadingEval && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="text-2xl font-bold">Analyzing Your Responses</h3>
          <p className="text-slate-300 mt-2">Our AI is evaluating your technical depth...</p>
        </div>
      )}

      {/* Header & Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Technical Interview</span>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">Question {currentStep + 1}</h3>
          </div>
          <p className="text-slate-400 font-bold">{currentStep + 1} / {limitedQuestions.length}</p>
        </div>
        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / limitedQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl shadow-slate-100 mb-6">
        <p className="text-xl text-slate-700 leading-snug font-medium mb-8">
          {limitedQuestions[currentStep]}
        </p>
        
        <textarea 
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none"
          placeholder="Type your detailed answer here..."
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => {
            if (currentStep < limitedQuestions.length - 1) {
              setAnswers([...answers, currentAnswer]);
              setCurrentStep(currentStep + 1);
              setCurrentAnswer("");
            } else {
              handleFinish();
            }
          }}
          disabled={!currentAnswer.trim()}
          className="flex-grow bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
        >
          {currentStep === limitedQuestions.length - 1 ? "Finish & Get Evaluation" : "Next Question"}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
      
      <button onClick={onBack} className="w-full mt-4 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors">
        Cancel Interview
      </button>
    </div>
  );
}

export default InterviewPage;