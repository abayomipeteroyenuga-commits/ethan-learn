# ETHAN Learn v1.3 — Nigeria Curriculum Priority Build

Nigeria-first class-by-class curriculum from Primary 1 to SS3, while retaining the global curriculum and professional-skills catalog.


## v1.2 Global Curriculum expansion

This build adds comprehensive comparative core pathways for Mathematics, English Language & Communication, Physics, Chemistry, Biology, and Commerce/Business Studies. The pathways synthesize shared secondary-level concepts across major curriculum systems, with worked reasoning, guided practice, quizzes, and curriculum alignment notes. They are learning supports rather than official examination-board specifications.

# ETHAN Learn v1.1

**Learn. Practice. Grow.**  
Knowledge and Skills for Everyone.  
A Product of Ethan Digital Academy.

ETHAN Learn is an installable, responsive learning platform that works as a useful local-first application before cloud services are connected.

## Included in v1.1

- 26 global subject families
- 362 courses
- 10 learning paths
- Course and lesson search
- Subject and level filters
- Enrollment and Saved for Later
- Lesson progress and completion
- Quizzes, best scores and certificate gates
- Notes, bookmarks and flashcards
- Recent learning activity, XP, streaks and badges
- Local ETHAN Tutor practice engine
- Local teacher course drafts
- Learner profile and onboarding
- Low Data Mode
- Responsive desktop/tablet/mobile interface
- PWA manifest, service worker and browser-install support
- Offline app-shell fallback

## Run locally

Use a local HTTP server rather than opening `index.html` directly so the service worker/PWA behavior can be tested. For example:

`python -m http.server 8080`

Then open `http://localhost:8080/`.

## Vercel

Upload the extracted project root to GitHub and connect that repository to Vercel. The supplied `vercel.json` keeps SPA navigation working and prevents stale service-worker caching.

## External services

The current build does not require secrets. Supabase authentication, remote AI, payments, email and cloud sync are future integrations. Never put secret API keys or Supabase service-role credentials in browser JavaScript.

## Audit

See `AUDIT-v1.1.md` for the test and repair report.

## v1.5 ETHAN Voice
Optional user-activated voice control, lesson read-aloud, voice navigation/search, and spoken ETHAN Tutor interactions are implemented in `js/voice.js`. See `VOICE-SYSTEM-v1.5.md`.


## v1.6 Digital Courses Expansion
A dedicated Digital Courses library now contains 125 practical digital technology courses.
