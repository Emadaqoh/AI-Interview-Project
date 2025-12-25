import React, { useState } from 'react';
import api from '../api/axiosConfig';
import ProfessionalDataSheet from './ProfessionalDataSheet';

const DualPanelUploader = ({ onAnalysisComplete, onStartInterview }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  // إضافة حالة لمعرفة نوع الملف
  const [isPdf, setIsPdf] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysis(null);
      
      // التحقق هل الملف PDF أم Word
      setIsPdf(selectedFile.type === 'application/pdf');
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setUploading(false);
    setIsPdf(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
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
    // التغيير 1: h-screen للكمبيوتر فقط، و min-h-screen للجوال للسماح بالتمرير
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#f8fafc]">
      
      {/* الهيدر: تقليل الحواشي في الجوال px-4 بدلاً من px-8 */}
      <header className="h-16 flex-none bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 lg:static shadow-sm lg:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm lg:text-base">AI</div>
          <h1 className="text-base lg:text-lg font-bold text-slate-800 tracking-tight">AI_PROJECT <span className="text-blue-600">.CORE</span></h1>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-sm font-bold text-slate-700">CV Intelligent Analyzer</p>
          </div>
          <button 
            onClick={resetAll}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all whitespace-nowrap"
          >
            + New Analysis
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي: استخدام order لتغيير الترتيب في الجوال */}
      {/* lg:flex-row (كمبيوتر: صف) | flex-col (جوال: عمود) */}
      <div className="flex flex-col lg:flex-row flex-grow lg:overflow-hidden">
        
        {/* القسم الأيسر (البيانات): يظهر ثانياً في الجوال order-2 */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 order-2 lg:order-1 bg-white border-r border-slate-200 custom-scrollbar lg:overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 lg:h-8 bg-blue-600 rounded-full"></span>
              CV Data
            </h2>
            
            {analysis && (
              <button 
                onClick={onStartInterview}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 animate-bounce-subtle"
              >
                <span>Generate Questions</span>
                <span className="text-lg">✨</span>
              </button>
            )}
          </div>

          {!analysis ? (
            <div className="h-48 lg:h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
              <p className="text-base lg:text-lg font-medium text-center px-4">يرجى رفع ملف أولاً لاستخراج البيانات</p>
            </div>
          ) : (
            <ProfessionalDataSheet data={analysis} />
          )}
        </div>

        {/* القسم الأيمن (الرفع): يظهر أولاً في الجوال order-1 */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 order-1 lg:order-2 bg-[#f1f5f9] flex flex-col border-b lg:border-b-0 border-slate-200">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-lg lg:text-xl font-bold text-slate-700">Document Preview</h2>
              <p className="text-[10px] lg:text-xs text-slate-400 font-medium uppercase tracking-wider">Live Visual Verification</p>
            </div>
            {file && (
              <label className="cursor-pointer bg-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600">Change</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
              </label>
            )}
          </div>

          {/* منطقة المعاينة */}
          <div className="h-[400px] lg:h-auto lg:flex-grow bg-white rounded-2xl shadow-inner border border-slate-200 overflow-hidden relative shadow-2xl shadow-slate-200/50 flex flex-col">
            
            {previewUrl ? (
              // هنا التغيير الجوهري: شرط العرض
              isPdf ? (
                // إذا كان PDF نعرضه في Iframe
                <iframe 
                  src={previewUrl} 
                  className="w-full h-full border-none" 
                  title="CV Preview"
                />
              ) : (
                // إذا كان Word نعرض واجهة بديلة
                <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-4xl">
                    📄
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Word Document Selected</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto break-all font-mono bg-slate-100 p-2 rounded border border-slate-200">
                    {file.name}
                  </p>
                  <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl text-sm border border-yellow-100 max-w-sm">
                    ⚠️ Browser cannot preview Word files natively. Click "Confirm & Extract" to process it.
                  </div>
                </div>
              )
            ) : (
              // شاشة الرفع الأولية
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 lg:p-12 text-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-4 lg:mb-6 rotate-3">
                  <svg className="w-8 h-8 lg:w-12 lg:h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-slate-800 mb-2">Upload your Resume</h3>
                <p className="text-xs lg:text-base text-slate-400 mb-6 lg:mb-8 max-w-xs">Supported formats: PDF and DOCX.</p>
                <input type="file" onChange={handleFileChange} className="hidden" id="initialUpload" accept=".pdf,.docx" />
                <label htmlFor="initialUpload" className="bg-slate-900 text-white px-6 py-3 lg:px-10 lg:py-4 rounded-2xl font-bold cursor-pointer hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 text-sm lg:text-base">
                  Select Document
                </label>
              </div>
            )}
          </div>

          {file && !analysis && (
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className={`mt-4 w-full py-4 lg:py-5 rounded-2xl font-bold text-base lg:text-lg transition-all flex items-center justify-center gap-3 ${
                uploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
              }`}
            >
              {uploading ? (
                 <span>Processing...</span>
              ) : (
                <span>Confirm & Extract Data</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DualPanelUploader;