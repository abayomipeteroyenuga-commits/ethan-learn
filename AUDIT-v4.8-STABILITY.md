# ETHAN Learn v4.8 Stability Audit

Fixes in this build:

- Converted Deep Teaching, Reasoning Teaching and Practice Intensive blocks to lazy lesson rendering. They are generated only for the lesson the learner opens instead of generating large HTML strings for thousands of lessons at startup.
- Continue Course now resumes the next incomplete lesson. If all lessons are marked complete but a required quiz is not passed, Continue Course returns to the first quiz still below the pass requirement instead of falsely treating progression as finished.
- Dashboard Continue Learning keeps courses visible until certificate requirements are actually satisfied.
- Hardened progression writes against invalid course/lesson IDs and clamps quiz scores to 0–100.
- Added catalog-reference cleanup for stale saved progress after catalog upgrades, preventing deleted/renamed course references from breaking My Learning, notes, bookmarks or recent activity.
- Fixed Explore filter pagination so changing filters rebuilds the Show More control correctly.
- Removed unnecessary double URI decoding from auth return routes.
- Rebuilt the service-worker cache list to include all current curriculum/teaching/practice scripts and bumped the cache version.
- Kept Follow Instructor narration and auto-scroll intact.

Validation covers JavaScript syntax, course/lesson ID uniqueness, quiz schema, progression logic, lazy practice generation, search, service-worker asset references and ZIP integrity.
