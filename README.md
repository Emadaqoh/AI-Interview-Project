# AI-Interview-Project 🚀

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vue](https://img.shields.io/badge/Frontend-Vue.js-4FC08D?style=flat&logo=vuedotjs)](https://vuejs.org/)
[![AI-Powered](https://img.shields.io/badge/AI-Powered-FF6F00?style=flat&logo=openai)](https://openai.com/)

🚀 AI Interview Project - Full Stack CV Analyzer
An intelligent CV analysis system built with FastAPI on the backend and React + Vite on the frontend, featuring AI-driven insights powered by the Groq Cloud SDK.

---

## 🌟 Features
- **Interactive AI Interviews:** Real-time questions generated based on candidate's profile.
- **Voice-to-Text Integration:** Seamless interaction using Whisper or Google Speech-to-Text.
- **Dual-Framework UI:** Hybrid frontend architecture using React and Vue components.
- **Instant Feedback:** Detailed analysis of answers and performance scores.

---

## 🛠️ Tech Stack
- **Backend:** FastAPI (Python), Pydantic, Uvicorn.
- **Frontend:** React.js & Vue.js (Hybrid/Monorepo).
- **AI Models:** Phi3 Model / llama3-8b-8192.
- **Database:** PostgreSQL / MongoDB (Optional).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **API Key** (OpenAI)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/AI-Interview-Project.git](https://github.com/your-username/AI-Interview-Project.git)
cd AI-Interview-Project

1. Backend Setup (FastAPI)
Navigate to directory: cd BackEnd

Create Virtual Environment: python -m venv venv

Activate Environment: * Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Install Dependencies: pip install -r requirements.txt

Environment Variables: Create a .env file in the BackEnd folder:

GROQ_API_KEY=your_actual_groq_api_key_here
Run Server: uvicorn app.main:app --reload

----

2. Frontend Setup (React + Vite)
Navigate to directory: cd frontend/cv-analyzer

Install Packages: npm install

Environment Variables: Create a .env file in the frontend/cv-analyzer folder:

VITE_API_BASE_URL=http://localhost:8000
Start Development Server: npm run dev

_____

📂 Project Architecture
/frontend/cv-analyzer: React application using Vite, Tailwind CSS, and Axios.

/BackEnd: FastAPI server handling file processing and AI integration.
----

🌐 Deployment Links
Frontend (Vercel): [Insert your Vercel URL here]

Backend API (Render): [Insert your Render URL here]

-----

🤝 How to Contribute
Fork the repository.

Create a Branch for your feature: git checkout -b feature/AmazingFeature

Commit your changes: git commit -m 'Add some AmazingFeature'

Push to the branch: git push origin feature/AmazingFeature

Open a Pull Request for review.

📄 License
Distributed under the MIT License.


