# AI Career Copilot

![AI Career Copilot](https://via.placeholder.com/1200x600/080c14/4f8ef7?text=AI+Career+Copilot)

> Your end-to-end AI-powered placement OS. Upload your resume, get tailored job descriptions, track your applications, and prep for interviews.

**Live Demo:** [Deploying Soon...]

---

## 🌟 Features

- **📄 Resume Analysis:** Upload your PDF resume and let Gemini AI extract your skills, score your role-fit (0–100), and identify exact gaps.
- **🎯 Job Description Matcher:** Paste a target Job Description. The AI will compare it to your resume and provide a tailored match score, identifying missing keywords.
- **🗺️ Personalized Roadmap:** Get a week-by-week prep plan tailored strictly to your skill gaps and target role.
- **📋 Application Tracker:** A unified Kanban board from Wishlist → Offer. Never lose track again.
- **🐙 GitHub Scorer:** Specific, actionable feedback to boost your GitHub profile score.
- **🎙️ Mock Interviews (New):** AI generates role-specific questions and evaluates your responses with real-time feedback.
- **✍️ Cover Letter Generator (New):** Draft tailored cover letters automatically based on your resume and target job descriptions.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Auth:** [Clerk](https://clerk.dev/)
- **Database:** [Supabase (PostgreSQL)](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **AI Integration:** [Google Gemini API (v2.5 Flash)](https://ai.google.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A Supabase project (PostgreSQL)
- Clerk account for Authentication
- Google Gemini API key

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

3. **Set up your environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (Supabase)
   DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://user:pass@host:5432/postgres"

   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Sync the database schema:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

*Built by [Swastik Sinha](https://github.com/swastiksinha1)*
