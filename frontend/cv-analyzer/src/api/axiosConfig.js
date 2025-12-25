import axios from 'axios';

// تأكد أن الاسم يطابق تماماً ما كتبته في ملف .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ai-interview-project.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;