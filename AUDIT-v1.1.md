# ETHAN Learn v1.1 — Comprehensive Audit & Expansion

## Audit findings fixed
- Upgraded storage schema from v1 to v2 with recovery/migration from existing local data.
- Added a true Saved Courses list instead of treating Save as course enrollment.
- Made lesson completion idempotent so repeated clicks cannot repeatedly add learning minutes or XP.
- Fixed final course completion so a passing final quiz can finalize the course and certificate eligibility.
- Fixed current-week learning goal calculation.
- Improved search from strict all-word matching to ranked partial/alias matching.
- Made Explore filters respect the current search query.
- Fixed My Learning so completed courses do not remain mixed into In Progress.
- Added saved courses, notes, bookmarked lessons and flashcards to My Learning.
- Added local teacher-draft deletion so every visible teacher action has a working result.
- Added profile level/goal controls and a local profile reset control.
- Added configurable weekly learning goal.
- Added recent lesson/quiz activity.
- Added best quiz score display on lesson pages.
- Added completed-state handling for the Mark Complete control.
- Added mobile drawer auto-close on navigation.
- Strengthened responsive CSS and overflow handling.

## Global curriculum expansion
The original build had 26 subject families but only 10 courses, leaving many subjects empty. v1.1 now contains:
- 26 subject families
- 362 courses
- 10 structured learning paths
- At least 8 courses in every subject family
- Detailed original flagship courses retained
- Structured starter lessons, practice and quizzes added across the expanded catalog

Coverage includes mathematics, English, sciences, digital literacy, Microsoft Office, AI, programming, web development, data, cybersecurity, cloud/IT, digital marketing, business, accounting/finance, design, media, teaching, research, careers, languages, humanities, practical life skills, sustainability, engineering, logistics/hospitality and personal development.

## PWA / browser install
- Manifest upgraded with root app ID, root start URL and root scope.
- Standalone display mode retained.
- 192×192 and 512×512 icons retained.
- Added shortcuts for Explore Courses and My Learning.
- Added mobile web-app and Apple web-app metadata.
- Install prompt handling retained and improved.
- Added appinstalled handling.
- Service worker cache bumped to v1.1.0.
- Navigation now uses network-first with offline app-shell fallback.
- Static same-origin assets use cache fallback.
- Vercel sends no-cache headers for sw.js and proper manifest content type.

## Tests completed
- JavaScript syntax validation for every JS/data/service-worker file.
- 26/26 subject families verified to contain courses.
- 362 course IDs verified unique.
- Exact duplicate course titles removed.
- Every course verified to contain at least one module and lesson.
- Every quiz answer index verified valid.
- All learning-path course references verified to exist.
- Search verified for Excel, Python, Artificial Intelligence, Digital Marketing, Mathematics, Accounting, Cybersecurity, English, Power BI, French and Robotics.
- Excel end-to-end progress logic tested: enroll → complete each lesson → quiz → 100% progress → certificate eligibility.
- Re-marking a completed lesson verified not to duplicate minutes/XP.
- Save/unsave course logic verified.
- Local ETHAN Tutor response verified.
- Manifest parsed and required PWA fields verified.
- Core production assets verified present and served by a local HTTP server.

## External-service boundary
This version deliberately remains useful without external services. Supabase accounts, remote AI, payments, email and cloud sync are not falsely marked as active. The built-in local tutor, local course progress, notes, quizzes, bookmarks, flashcards, teacher drafts and search work without those services.
