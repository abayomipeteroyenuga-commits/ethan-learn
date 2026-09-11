# ETHAN Learn v1.8 — Practical Learning + Voice Fix

## Practical learning
Every course now gets a dedicated Practical Work, Assignments & Assessment module:
1. Practical workshop
2. Independent assignment with 20-mark rubric
3. Real-world case study
4. Mini project / portfolio evidence
5. Knowledge + application assessment with suggested 70% mastery target

This is designed to require doing, explaining, creating, checking and applying—not just reading/searching.

## Voice fixes
- Rebuilt ETHAN Voice runtime.
- Added strong speech-synthesis fallback selection.
- Audio is unlocked from a direct user click.
- Added visible floating Voice button.
- Added microphone error messages.
- Voice recognition supports Web Speech APIs where the browser exposes them.
- Read-aloud works separately from recognition.
- Voice no longer attempts to auto-open the microphone on page load.
- Added `voice-test.html` for speaker/microphone diagnosis.
- Bumped service-worker cache to v1.8 to prevent stale voice.js from an older install.
- Voice is suspended when the page is hidden and resumes only during a user-enabled session.

Important: microphone recognition typically requires HTTPS and browser permission. Some browsers/devices support speech synthesis but not speech recognition.
