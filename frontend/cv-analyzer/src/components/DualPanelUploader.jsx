import React, { useState } from 'react';
import api from '../api/axiosConfig';
import ProfessionalDataSheet from './ProfessionalDataSheet';

const DualPanelUploader = ({ onAnalysisComplete, onStartInterview }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));

      setAnalysis(null);
    }
  };

  const resetAll = () => {
  setFile(null);
  setPreviewUrl(null);
  setAnalysis(null);
  setUploading(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // نستخدم api هنا أيضاً
      const res = await api.post('/api/upload-cv', formData);
      setAnalysis(res.data.analysis);
      if (onAnalysisComplete) onAnalysisComplete(res.data.analysis);
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
};

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      
      {/* 1. الـ Header العلوي الجديد */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">AI_PROJECT <span className="text-blue-600">.CORE</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-sm font-bold text-slate-700">CV Intelligent Analyzer</p>
          </div>
          <button 
            onClick={resetAll}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            + New Analysis
          </button>
        </div>
      </header>

      {/* محتوى الصفحة الرئيسي */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        
        {/* القسم الأيسر: عرض البيانات المستخرجة */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto border-r border-slate-200 bg-white custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
             CV Data
            </h2>
            
            {/* زر بدء المقابلة - يظهر فقط بعد التحليل */}
            {analysis && (
              <button 
                onClick={onStartInterview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all flex items-center gap-2 animate-bounce-subtle"
              >
                <span>Generate Interview Questions</span>
                <span className="text-lg">✨</span>
              </button>
            )}
          </div>

          {!analysis ? (
            <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
              <p className="text-lg font-medium">يرجى رفع ملف أولاً لاستخراج البيانات</p>
            </div>
          ) : (
            <ProfessionalDataSheet data={analysis} />
          )}
        </div>

        {/* القسم الأيمن: رفع الملف ومعاينته */}
        <div className="w-full lg:w-1/2 p-8 bg-[#f1f5f9] flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-700">Document Preview</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Live Visual Verification</p>
            </div>
            
            {file && (
              <label className="cursor-pointer bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600">Change Document</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
              </label>
            )}
          </div>

          <div className="flex-grow bg-white rounded-2xl shadow-inner border border-slate-200 overflow-hidden relative shadow-2xl shadow-slate-200/50">
            {previewUrl ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-none" 
                title="CV Preview"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 rotate-3">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload your Resume</h3>
                <p className="text-slate-400 mb-8 max-w-xs">Supported formats: PDF and DOCX. Max file size: 10MB.</p>
                
                <input type="file" onChange={handleFileChange} className="hidden" id="initialUpload" />
                <label htmlFor="initialUpload" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold cursor-pointer hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  Select Document
                </label>
              </div>
            )}
          </div>

          {file && !analysis && (
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className={`mt-4 w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                uploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing with AI...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Extract Data</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DualPanelUploader;