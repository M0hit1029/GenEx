# ⚙️ GenEx — AI-Powered Requirement Extraction Tool

> 🚀 Built during the **Barclays Hackathon – Hack-O-Hire**

**GenEx** is a full-stack web application that automates the extraction and generation of software requirements from various document types such as **PDF, DOCX, Excel, audio, and video** files. It combines **Natural Language Processing (NLP)**, **Whisper (for transcription)**, and custom rule-based logic to first **extract and categorize** functional and non-functional requirements, and then **assign MoSCoW priorities** to them.

---

## 🔑 Key Features

1. Upload documents (PDF, DOCX, XLSX) or media (audio/video).
2. AI-powered extraction of clear and structured requirements.
3. Categorization into functional and non-functional requirements with MoSCoW prioritization.
4. Role-based access and user management.
5. Visualization of extracted requirements.

---

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express
- **Python Engine**: PyPDF2, Whisper, pandas, and other NLP libraries
- **Database**: MongoDB Atlas

---

## 🧪 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/GenEx.git
   ```

2. **Add environment variables**  
   Fill in the `.env` files inside both `backend2/` and `project/` folders with appropriate config values.

3. **Install dependencies**
   ```bash
   # For frontend and project folder
   cd project
   npm install
   cd ../backend2
   npm install
   pip install -r requirements.txt
   ```

4. **Install Whisper (Local) and FFmpeg**
   - Install OpenAI Whisper locally.
   - Make sure `ffmpeg` is installed and added to your system path.

5. **Start the servers**
   - Run backend and frontend servers.
   - Login using:
     ```
     Email: sample1234@gmail.com
     Password: 12345678
     ```

6. **Create a new project**  
   Use the sidebar to create a new project, scroll down to upload your documents, and click run.

7. **Troubleshooting**  
   If a Python file is missing or not found, install it manually.

---

## 🎥 Demo Video

[![Watch the Demo](https://img.youtube.com/vi/-HBrsUHaIdY/0.jpg)](https://youtu.be/-HBrsUHaIdY)

---

