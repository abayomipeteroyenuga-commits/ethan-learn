# ETHAN Learn v2.0 — Progression, Stability, Navigation & Interface Audit

## Critical bugs fixed
- Fixed the API mismatch between the lesson/settings UI (`VoiceService`) and the narration runtime (`ETHAN_VOICE`). Automatic narration and manual narration now expose a compatibility service used by the app.
- Automatic narration no longer falls back to reading the entire application `<main>` area. It targets course/lesson content.
- Course pages now expose a narration-specific overview container.
- Service worker moved to network-first for JS/CSS/data so stale code is less likely after a redeploy.
- Main render now has an error recovery view instead of leaving a blank app when a component fails.

## Progression audit
- Duplicate lesson-completion protection remains in place.
- XP/minutes are only added the first time a lesson is completed.
- Course progression calculation now reads completion state once per calculation, reducing repeated storage work.
- Course completion still requires all lessons plus passing required lesson quizzes.
- Start/Continue always resolves to a real first lesson.
- Previous/Next lesson controls retain direct progression links.
- Certificates remain locked until completion rules are met.

## Lag/freeze improvements
- Search no longer builds a full index from every long lesson body.
- Lesson search scans a bounded text sample and stops collecting after a useful result limit.
- Explore initially renders 48 courses instead of all 487 and includes Show More.
- Practice no longer renders 487 cards at once; it focuses on the learner's courses or 24 starter courses.
- Course modules use accordions, reducing huge page height and visual overload.
- Reduced-motion support added.

## Navigation/tabs
- New top navigation structure with a More menu.
- Structured mobile drawer with Learn / Workspace / Account groups.
- Course page tabs: Overview / Curriculum / Practical & Assessment.
- My Learning tabs: In Progress / Completed / Saved / Study Tools / Certificates.
- Practice tabs: Quizzes / Assignments / Projects / Mastery.
- Generic tab event handler makes all tab groups functional.
- Mobile drawer gets accessible open/close state and Escape-key support.

## Interface redesign
- New professional navy/blue ETHAN visual system.
- Strong hero/search area, improved cards, progress indicators, badges and course metadata.
- Course overview panel with visual progress ring.
- Structured module accordions and lesson rows.
- Sticky lesson controls on desktop/mobile.
- Responsive layouts for desktop, tablet and phone.

## Validation
- JavaScript syntax checked.
- Course data/runtime loaded and progression invariants tested.
- Route view functions and navigation targets checked.
- ZIP integrity checked.
