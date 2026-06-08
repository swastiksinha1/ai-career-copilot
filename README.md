<div align="center">
  <img src="./public/logo.png" alt="Logo" width="80" height="80" />
  <h1 align="center">AI Career Copilot</h1>
  <p align="center">
    <strong>Your ultimate AI-powered placement OS.</strong><br/>
    Analyze, Optimize, Track & Dominate your job hunt.
  </p>
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-0ea5e9?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase" alt="Supabase" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=google-gemini&logoColor=white" alt="Gemini" /></a>
  </p>
</div>

---

## 🌟 Overview

**AI Career Copilot** is an end-to-end placement operating system designed to give engineers an unfair advantage in the modern job market. Effortlessly tailor resumes, simulate interviews, and track applications in real-time. Let our AI extract knowledge to automate your job hunt while you focus on crushing interviews.

## 🎯 Problem Statement

The modern tech job hunt is overwhelming. Candidates constantly struggle with:
- **Resume Blind Spots:** Not knowing why their resume isn't passing ATS filters.
- **Context Switching:** Managing spreadsheets, emails, and job boards across a dozen tabs.
- **Interview Anxiety:** Going into technical interviews without realistic, role-specific practice.
- **Time Constraints:** Spending hours drafting unique cover letters for every application.

**AI Career Copilot** solves this by unifying the entire pipeline into a single, AI-native platform that parses your experience, tracks your applications, and actively coaches you.

## ✨ Core Features Deep Dive

### <u>📄 1. AI Resume Analysis</u>

The cornerstone of your application prep.

- **PDF Parsing**: Securely upload your resume in PDF format. The system extracts raw text and structures it into distinct sections (experience, education, skills).
- **Role Alignment**: Input your target role. The AI evaluates how well your current resume positions you for that specific title.
- **Actionable Feedback**: Receive a quantifiable score (0-100) along with bullet-point critiques on action verbs, quantifiable metrics, and formatting.
- **Skill Gap Identification**: Discovers critical technical and soft skills missing from your profile based on industry standards for your target role.

<br/>

### <u>🎯 2. ATS Job Description Matcher</u>

Beat the Applicant Tracking Systems (ATS) before you even apply.

- **Direct Comparison**: Paste a target job description and select your uploaded resume.
- **Keyword Extraction**: The system identifies mandatory and preferred skills required by the employer.
- **Match Scoring**: Generates a percentage match indicating your likelihood of passing automated ATS filters.
- **Missing Keywords**: Highlights the exact words and phrases you need to inject into your resume to trigger a higher ATS ranking.

<br/>

### <u>✍️ 3. Intelligent Cover Letter Generator</u>

Stop writing cover letters from scratch.

- **Context-Aware Drafting**: Uses your parsed resume data and the specific target job description to write a highly tailored cover letter.
- **Professional Tone**: Generates compelling narratives that connect your past achievements directly to the employer's needs.
- **Instant Export**: Copy the generated letter with one click and drop it directly into your application.

<br/>

### <u>🎙️ 4. AI Mock Interviews</u>

Simulate the high-pressure environment of a real interview.

- **Role & JD Specific**: The AI generates technical, behavioral, and situational questions strictly based on your provided job description and target role.
- **Interactive Q&A**: Type your answers to the AI's questions in a chat-like interface.
- **Real-time Evaluation**: After the interview, receive a comprehensive breakdown of your performance, including areas of strength, red flags, and suggested perfect answers for each question.

<br/>

### <u>🐙 5. GitHub & LinkedIn Profile Scorer</u>

Your public profiles are your passive resume. Make them count.

- **URL Analysis**: Input your LinkedIn and GitHub URLs.
- **Recruiter Perspective**: The AI analyzes your profile from the perspective of a technical recruiter, looking for optimized headlines, detailed summaries, and project visibility.
- **Optimization Checklist**: Provides a step-by-step checklist to increase your search visibility and inbound recruiter reach-outs.

<br/>

### <u>📋 6. Application Tracker (Kanban Board)</u>

Never lose track of where you are in the pipeline.

- **Visual Pipeline**: A drag-and-drop Kanban board with columns for *Wishlist*, *Applied*, *Interviewing*, *Offer*, and *Rejected*.
- **Detail Storage**: Save the job title, company, salary range, and specific notes for every application.
- **Centralized Hub**: Acts as your single source of truth during the chaotic job hunting process.

<br/>

### <u>🗺️ 7. Personalized Career Roadmaps</u>

Don't know what to study? Let the AI build your syllabus.

- **Custom Curriculums**: Based on your identified skill gaps and target role, the AI generates a structured, week-by-week study plan.
- **Resource Recommendations**: Suggests specific topics, projects, and algorithms to master before your big interview.

<br/>

### <u>🧭 8. Target Role Quiz</u>

Not sure what role you're best suited for? Take our interactive assessment.

- **Skill Evaluation**: A dynamic quiz that assesses your current technical stack, soft skills, and interests.
- **Role Recommendations**: Based on your answers, the AI suggests the most optimal tech roles (e.g., Frontend Developer, Data Engineer, DevOps) that match your profile.
- **Career Trajectory**: Provides a brief overview of what each recommended role entails and the typical expectations.

## 🛠️ Technology Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Frontend** | [Next.js 15](https://nextjs.org) (App Router) | React framework for lightning-fast Server Components. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) & Shadcn | Utility-first CSS and premium UI components. |
| **Database** | [PostgreSQL (Supabase)](https://supabase.com) | Highly scalable relational database. |
| **ORM** | [Prisma](https://prisma.io) | Typescript-first database toolkit. |
| **Auth** | [Clerk](https://clerk.dev) | Secure, drop-in authentication and user management. |
| **AI** | Google Gemini | Gemini 2.5 Flash powering the resume analysis and mock interviews. |

## 📂 Project Structure

```text
ai-career-copilot/
├── 📁 prisma/             # Database schema and migrations
├── 📁 public/             # Static assets (images, fonts)
├── 📁 src/
│   ├── 📁 app/            # Next.js App Router pages (Home, Dashboard, API routes)
│   ├── 📁 components/     # Reusable React UI components (Tailwind, Shadcn)
│   ├── 📁 lib/            # Utility functions and API wrappers (Prisma, Gemini)
│   └── 📄 middleware.ts   # Clerk authentication middleware
├── 📄 .env                # Environment variables (Ignored in Git)
├── 📄 tailwind.config.ts  # Tailwind CSS theme configuration
└── 📄 next.config.ts      # Next.js build configuration
```

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed and set up:
- **Node.js** (v20 or newer)
- **Supabase** account (for your PostgreSQL instance)
- **Clerk** account (for authentication keys)
- **Google Gemini** API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/swastiksinha1/ai-career-copilot.git
   cd ai-career-copilot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Database
   DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://user:pass@host:5432/postgres"

   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view your new Placement OS.

## 🌟 Future Improvements

| Feature | Status |
| --- | --- |
| **🎙️ Voice-to-Text Mock Interviews** | 🚧 Planned |
| **🌐 Chrome Extension for Job Boards** | 🚧 Planned |
| **🤖 Automated Email Follow-ups** | 🚧 Planned |
| **📊 Advanced Application Analytics** | 🚧 Planned |

## 📈 Learning Outcomes

| Category | Skills Acquired |
| --- | --- |
| **Full Stack Next.js** | Mastered App Router, Server Actions, and Server Components |
| **AI Integration** | Engineered complex LLM prompts and parsed structured JSON outputs via Gemini API |
| **Database Architecture** | Designed relational schemas in Prisma and integrated with PostgreSQL |
| **Authentication Flow** | Implemented secure route protection and user management via Clerk |

## 👨‍💻 Developer & Credits

| Role | Details |
| --- | --- |
| **Developer** | Swastik Sinha |
| **Title** | Full Stack Developer |
| **GitHub** | [@swastiksinha1](https://github.com/swastiksinha1) |

## ⭐ Support & Contribution

| Action | Description |
| --- | --- |
| **⭐ Star** | Star the repository to show support |
| **🍴 Fork** | Fork the project to experiment or build upon it |
| **🛠️ Contribute** | Submit pull requests to contribute new features |

## 📄 License & Repository Details

| Category | Details |
| --- | --- |
| **License** | This project is licensed under the MIT License. |
| **GitHub Topics** | `nextjs` `ai` `gemini` `career` `resume-builder` `typescript` `prisma` `tailwind` |
