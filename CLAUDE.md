# EHL Exam Prep Platform

## Project Overview
Build a web application for EHL (École hôtelière de Lausanne) students to prepare 
for exams using past papers and course content. The platform organises content by 
subject, generates practice tests, and tracks student progress.

## Target Users
EHL students preparing for exams across all years and subjects.

## Core Features (MVP)

### 1. Content Library
- Upload and store past exam papers and course notes (PDF/text)
- Organise by subject, year, and exam type
- Support bilingual content (French + English); auto-translate French material

### 2. Subject Pages
- One page per subject with all associated past papers and notes
- Display key topics and themes extracted from content

### 3. Practice Tests
- Auto-generate multiple choice and short answer questions from uploaded content
- Timed exam mode that simulates real exam conditions
- Instant feedback with correct answers and explanations

### 4. Progress Tracking
- Track scores per subject over time
- Show weak areas and recommend what to review
- Simple dashboard with study streaks and completion stats

## Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js / Express or Next.js API routes
- Database: Supabase (Postgres + file storage for PDFs)
- AI: Anthropic API (claude-sonnet-4-20250514) for question generation and translation
- Auth: Supabase Auth (email login)

## Content Ingestion Flow
1. Admin uploads PDF past paper or course notes
2. App extracts text and chunks it
3. Claude generates questions, summaries, and key topics from the content
4. Content is tagged by subject and stored

## Design Principles
- Clean, minimal UI — students are stressed enough
- Mobile-friendly
- Fast load times
- English-first, French content auto-translated on ingestion

## Out of Scope (V1)
- Social/community features
- Live tutoring
- Native mobile app

## First Task
Scaffold the project with Next.js and Tailwind. Set up Supabase for auth and 
storage. Create the basic routing: home, subject list, subject detail, practice 
test, and dashboard pages.