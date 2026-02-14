# EduPulse Deployment Guide (Vercel)

## 1. Prerequisites
Before deploying, ensure you have:
1.  **Vercel Account**: [vercel.com](https://vercel.com)
2.  **Supabase Project**: [supabase.com](https://supabase.com)
3.  **GitHub Repository**: Push this code to a new GitHub repo.

## 2. Environment Variables
You must configure the following environment variables in Vercel Project Settings.

| Variable Name | Description | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous public key | Supabase Dashboard > Settings > API |

> **Imortant**: Do **NOT** expose your `service_role` key here. Only use the `anon` key.

## 3. Database Setup
Ensure you have run the schema SQL in your Supabase SQL Editor.
(See `supabase/schema.sql` in the codebase).

## 4. Manual Deployment Steps
1.  Go to Vercel Dashboard -> **Add New...** -> **Project**.
2.  Import your GitHub repository.
3.  In "Configure Project":
    - **Framework Preset**: Next.js
    - **Root Directory**: `./` (default)
    - **Build Command**: `next build` (default)
    - **Install Command**: `npm install` (default)
4.  Expand **Environment Variables**.
5.  Add the two variables listed above.
6.  Click **Deploy**.

## 5. Verification
Once deployed:
1.  Visit the deployment URL (e.g., `edu-pulse.vercel.app`).
2.  Go to `/educator` and try starting a session.
3.  If it succeeds, your database connection is working.
