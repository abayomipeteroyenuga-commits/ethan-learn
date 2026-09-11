# ETHAN Learn v1.5 — ETHAN Voice

ETHAN Voice adds optional hands-free learning controls inspired by the voice-guidance experience in ETHAN GPS.

## What works
- User-activated microphone mode. The browser asks for microphone permission only when Voice is activated.
- Continuous command listening while the web app stays open and visible, where browser speech recognition supports it.
- Optional "Hey Ethan" prefix; commands also work without the prefix after Voice is active.
- Voice search across ETHAN Learn.
- Voice navigation to Home, Explore, Subjects, Nigeria Curriculum, Global Curriculum, My Learning, Dashboard, Practice, Library, Settings and Profile.
- Lesson commands: Read Lesson, Next Lesson, Previous Lesson, Mark Complete, Take Quiz.
- Spoken ETHAN Tutor questions such as "Hey Ethan, explain this more simply".
- Tutor answers can be spoken aloud automatically.
- Repeat last tutor answer.
- Read-aloud uses browser speech synthesis and safely chunks long lesson text.
- Voice pauses when the app/browser is hidden and resumes only while the app remains open and active.
- Settings include auto-speak and English locale selection (US, UK, Nigeria).
- Floating Voice button on desktop and mobile.

## Browser reality
Speech synthesis is widely available in modern browsers. Speech recognition support varies by browser/device and can depend on browser services and microphone permissions. The app therefore degrades safely: typed Tutor and all learning controls remain available even when speech recognition is unavailable.

This build does not attempt unrestricted background microphone listening after the browser/app is closed. Web/PWA security rules generally do not permit a website to behave like a native always-listening wake-word service without a dedicated native layer.
