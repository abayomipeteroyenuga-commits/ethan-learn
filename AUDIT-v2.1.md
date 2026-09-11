# ETHAN Learn v2.1 — Emergency Stability Fix

Root-cause hardening applied after v2.0 could appear completely non-functional on some deployments.

- Removed parser-blocking Supabase CDN script from application startup. Cloud SDK is now optional/non-blocking.
- Rebuilt narration so it does not use a body-wide MutationObserver. The old observer could repeatedly react to its own narration-bar updates and create heavy CPU activity.
- Narration is triggered by an explicit `ethan:rendered` application event instead.
- Hardened voice preferences against browsers that block localStorage.
- Preserved automatic course/lesson narration, pause/resume/stop and voice commands.
- Service-worker installation no longer fails completely if one shell file cannot be cached.
- JS/CSS/data remain network-first to prevent stale-code mismatches after deployment.
- Added boot recovery message instead of a permanently blank screen.
- Preserved progression, practicals, assessments and redesigned tabs/menus.
