# Algeria Ecosystem Project - Architecture v2

## Overview
This project is a comprehensive directory of the Algerian tech ecosystem, showcasing startups, incubators, accelerators, events, and more. The application utilizes a **React** frontend and a robust **Supabase** backend to provide a dynamic, secure, and scalable experience.

---

## Architecture System Design

### 1. The Technology Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS (for styling), React Query (for state management).
- **Backend & Database**: Supabase (PostgreSQL).
- **Compute layer**: Supabase Edge Functions (Deno).
- **Authentication**: Supabase Auth.

### 2. Strategic Decision: Why Supabase Edge Functions?
We explicitly chose **Supabase Edge Functions** over Netlify Functions or standard REST APIs for several critical reasons:

#### Cost & Generous Free Tier
* **Supabase**: Offers up to **500,000 invocations per month** on the free tier. This is massive for a growing community project.
* **Netlify**: While excellent, Netlify's pricing for functions can jump significantly once you pass the free tier limits (125k requests/month), and their execution time limits are stricter on the free plan.
* **Cost Control**: By unifying logic in fewer, efficient functions, we maximize the value of the free tier.

#### Integrated Security & Context
*   Supabase Edge Functions have native access to the incoming user's `Authorization` header.
*   We can easily switch between the **Anon Key** (for public read access) and the **Service Role Key** (for rigorous Admin tasks) within the same environment, without managing external secrets or connection pools.

#### Performance
*   Supabase Edge Functions run on **Deno** at the edge (distributed globally). This ensures low latency for users regardless of their location compared to centralized Node.js serverless functions.

---

##  Database Structure (Schema)

The database is normalized to ensure data integrity and easy expansion.
please refer to the folder ./db_brainstorming to see the RAW SQL of these table and a drawing scheme with tldraw

### Core Tables

Please refer to folder `./db_brainstorming` where I have added a visual schema, you can open it with Tldraw vscode extension

1.  **`entities`** (The Master Table)
    *   Stores the main profile for every item (Startup, Event, Incubator).
    *   **Columns**: `id`, `slug`, `name`, `description`, `website`, `founded_year`, `status` ('pending' | 'approved'), `wilaya_id`, `type_id`.
    *   The `status` column controls visibility. Only 'approved' items are shown publicly.

2.  **`entity_types`**
    *   Categorizes the entity (e.g., "Startup", "Incubator", "Event").

3.  **`wilayas`**
    *   A lookup table of the 58 Algerian wilayas (states).
    *   Used for location filtering.

4.  **`categories`**
    *   Tags or sectors (e.g., "Fintech", "HealthTech", "Education").
    *   Linked via a many-to-many relationship `entity_categories`.

5.  **`media_types`**
    *   Specific types for Media entities (e.g., "Podcast", "Newsletter").
    *   Linked via a many-to-many relationship `entity_media_types`.

### Security Policies (RLS)
*   **Public Access**: `SELECT` is allowed for everyone on 'approved' entities.
*   **Admin Access**: Full `CRUD` (Create, Read, Update, Delete) is restricted to authenticated Admin users via the Edge Function.

---

##  The API Gateway (Supabase Edge Function)

I use a "Monolythic" function pattern located at `supabase/functions/api`.

*   **Endpoint**: `POST https://[project-id].supabase.co/functions/v1/api`
*   **Logic**: It acts as a router. The client sends a `task` parameter (e.g., `get-entities`, `admin-approve-entity`), and the function executes the logic.
*   **Auth Guard**: For tasks starting with `admin-`, the function ignores the request unless a valid JWT from a logged-in admin is present in the `Authorization` header.

---

##  Deployment Guide (Production)

This guide assumes you are deploying straight to the live Supabase project, bypassing local Docker setup (common for Windows/quick iterations).

### Prerequisites
1.  **Node.js** & **NPM** installed.
2.  **Supabase CLI** installed (`npm install -g supabase`).

### Step 1: Connect to Supabase
First, authenticate via the CLI and link your local folder to your remote Supabase project.
```bash
# 1. Login to Supabase (opens browser)
npx supabase login

# 2. Link to your remote project
# Find your Reference ID in Dashboard -> Project Settings -> General
npx supabase link --project-ref <YOUR_PROJECT_ID>
```
*You will be asked for your database password. Enter it to establish the link.*

### Step 2: Push Database Schema
Apply your local SQL schema (`supabase/migrations` or direct schema files) to the remote database.
```bash
# Apply schema changes to remote DB
npx supabase db push
```

### Step 3: Seed Initial Data (Optional)
I have put a script in `./db_brainstorming/scripts`, run it to populate your table categories, wilayas, etc.
It will read the folder `./db_brainstorming/data`, its not 100 stable since thse json are not unified, and I didnt want to put more time on them.
```bash
# Run your custom seed script
npx tsx db_brainstorming/scripts/seed.ts
```

### Step 4: Deploy Edge Functions
Push the `api` function (our monolithic gateway) to the global edge network.
```bash
# Deploy the function
# --no-verify-jwt is vital because we manually handle auth inside the code
npx supabase functions deploy api --no-verify-jwt
```
**Important:** Go to the Supabase Dashboard -> Edge Functions -> `api` and ensure the **Secrets** (Environment Variables) are set if utilized (though currently, we use standard Supabase keys which are auto-injected).

### Step 5: Configure Frontend Environment
Create a `.env` file in your project root (or configure variables in your hosting provider like Vercel/Netlify):
```env
VITE_SUPABASE_URL=https://<YOUR_PROJECT_ID>.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<YOUR_ANON_KEY>
```

### Step 6: Build & Deploy Frontend
Build the React application for production.
```bash
npm run build
```
Upload the `dist` folder to your static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

---

## 🛡️ Admin Setup Checklist
0.  **Create Admin User**: Go to `Supabase Dashboard -> Authentication -> Users` and "Invite" or "Create" a user (your email).
1.  **Disable Public Signups**: Go to `Supabase Dashboard -> Authentication -> Providers -> Email` and **uncheck** "Enable Signups". This prevents strangers from registering admin accounts.
2.  **Log In**: Visit `https://your-site.com/login` and sign in with the admin credentials.
3.  **Verify**: Navigate to `/admin` to ensure you have access to the dashboard.
