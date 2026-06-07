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

## ✨ Core Features

| Feature | Description |
| --- | --- |
| **📄 AI Resume Analysis** | Upload your PDF resume and let our AI parse your experience, extract your skills, score your role-fit against industry standards, and identify the exact gaps holding you back. |
| **🎯 Intelligent Job Matching** | Paste a target Job Description. The AI will instantly compare it to your resume, provide a highly-tailored match score, and surface missing keywords to help you beat the ATS. |
| **🐙 GitHub & LinkedIn Scorer** | Drop in your profile links to receive specific, actionable feedback designed to boost your GitHub and LinkedIn profile scores and attract technical recruiters. |
| **🗺️ Personalized Roadmaps** | Generate a comprehensive, week-by-week interview prep plan tailored strictly to your skill gaps and target company. |
| **📋 Unified App Tracker** | A high-performance Kanban board built to track your entire pipeline from *Wishlist* to *Offer*. Store notes, dates, and statuses so you never lose track again. |
| **🎙️ Mock Interviews** | Dynamic, role-specific technical and behavioral questions evaluated with real-time feedback to drastically improve your interview performance. |
| **✍️ Cover Letter Engine** | Draft highly-tailored, professional cover letters automatically based on your parsed resume data and target job descriptions. |

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
