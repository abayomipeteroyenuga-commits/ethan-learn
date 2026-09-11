# ETHAN Learn v1.9 — Automatic Course Narration

Implemented automatic voice narration for course lessons.

Behavior:
- Auto narration is ON by default.
- When a learner opens a lesson, ETHAN Narrator automatically reads the visible lesson content.
- When the learner moves to another lesson, the previous narration stops and the new lesson is narrated.
- Narration controls are always visible: Narrate, Pause/Resume, Stop, Auto narration ON/OFF.
- Preference is saved in localStorage.
- Nigerian English is preferred when available, with UK/US English fallbacks.
- Narration works independently of microphone voice commands.
- Microphone access is not required for narration.
- Existing voice-command system is preserved.
- Service-worker cache bumped to v1.9.

Browser note:
Speech synthesis requires browser/device TTS support and audible device volume. Some mobile browsers require the first speech action to follow a user interaction; after that, automatic lesson-to-lesson narration continues during the session.
