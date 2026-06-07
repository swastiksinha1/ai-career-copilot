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

## 🌟 Overview

**AI Career Copilot** is an end-to-end placement operating system designed to give engineers an unfair advantage in the modern job market. Effortlessly tailor resumes, simulate interviews, and track applications in real-time. Let our AI extract knowledge to automate your job hunt while you focus on crushing interviews.

## ✨ Core Features

- **📄 AI Resume Analysis:** Upload your PDF resume and let our AI extract your skills, score your role-fit, and identify exact gaps.
- **🎯 Intelligent Job Matching:** Paste a target Job Description. The AI will compare it to your resume and provide a tailored match score.
- **🗺️ Personalized Roadmaps:** Generate a week-by-week interview prep plan tailored strictly to your skill gaps.
- **📋 Unified Application Tracker:** A high-performance Kanban board from *Wishlist* to *Offer*. Never lose track again.
- **🎙️ Mock Interviews:** Dynamic, role-specific technical questions evaluated with real-time feedback.
- **✍️ Cover Letter Engine:** Draft highly-tailored cover letters automatically based on your resume and target jobs.

## 🛠️ Technology Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Frontend** | [Next.js 15](https://nextjs.org) (App Router) | React framework for lightning-fast Server Components. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) & Shadcn | Utility-first CSS and premium UI components. |
| **Database** | [PostgreSQL (Supabase)](https://supabase.com) | Highly scalable relational database. |
| **ORM** | [Prisma](https://prisma.io) | Typescript-first database toolkit. |
| **Auth** | [Clerk](https://clerk.dev) | Secure, drop-in authentication and user management. |
| **AI** | Google Gemini | Gemini 2.5 Flash powering the resume analysis and mock interviews. |

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

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  Built with precision by <a href="https://github.com/swastiksinha1">Swastik Sinha</a>.
</div>
