# ETHAN Learn v1.4 Cloud Setup

1. Create/use a Supabase project. Run `supabase/v1.4-cloud.sql` in SQL Editor.
2. In `config.js`, set the Supabase Project URL and browser-safe publishable/anon key. Never place a service-role key here.
3. In Supabase Authentication URL Configuration, set the production Site URL and allowed redirect URL for your ETHAN Learn domain.
4. In Vercel, add server environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENAI_API_KEY`; optional `OPENAI_MODEL` and `TUTOR_MAX_OUTPUT_TOKENS`.
5. Redeploy. Free/local course learning still works if cloud services are unavailable. Signed-in learners get cloud sync and the remote ETHAN Tutor AI when configured.

Security: learner state is protected by Supabase Row Level Security. OpenAI and other server secrets stay in Vercel only.
