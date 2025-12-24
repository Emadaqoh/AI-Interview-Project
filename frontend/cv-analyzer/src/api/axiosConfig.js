import axios from 'axios';

// هذا السطر يقرأ الرابط من ملف .env إذا وجده، وإذا لم يجده يستخدم localhost تلقائياً
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;