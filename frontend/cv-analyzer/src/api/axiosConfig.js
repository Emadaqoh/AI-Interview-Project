import axios from 'axios';

// استبدل الرابط أدناه بالرابط الذي أعطاك إياه موقع Render
const API_BASE_URL = "https://ai-interview-project.onrender.com"; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;