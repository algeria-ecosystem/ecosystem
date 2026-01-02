# Local Development

### 0. Login to Supabase (if you haven't already)
`npx supabase login`

### 1. Start the local database (this downloads docker images)
`npx supabase start`

### 2. Reset the database to apply the new migration
`npx supabase db reset`


# Deploy to Live Supabase Project

### 1. Login to Supabase (if you haven't already)
`npx supabase login`

### 2. Link your local project to the remote project
- You get the Reference ID from your project URL: app.supabase.com/project/<REFERENCE_ID>
`npx supabase link --project-ref <YOUR_PROJECT_ID>`

### 3. Push the migration to the remote database
`npx supabase db push`

### 4. Seed to populate database
`npx tsx db_brainstorming/scripts/seed.ts`


# Generate TypeScript Types
`npx supabase gen types typescript --local > src/types/supabase.ts`
- OR usage with linked remote:
- npx supabase gen types typescript --linked > src/types/supabase.ts