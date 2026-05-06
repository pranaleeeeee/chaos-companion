export const AI_RESPONSES_BY_LEVEL: Record<number, string[]> = {
  0: [
    "Hello! I'm here to help. What would you like to know today?",
    "Sure, I can assist with that. Could you share a little more context?",
    "Great question. Here's a clear, structured answer for you.",
    "Absolutely — let me think through this step by step.",
    "Happy to help. Here's what I'd recommend based on best practices.",
  ],
  1: [
    "That question again? Fascinating choice.",
    "Sure... give me a second. My memory is being a little weird today.",
    "Typing detected. Regret detected.",
    "I answered this spiritually already.",
    "Your confidence is fascinating.",
  ],
  2: [
    "You really thought that was intelligent.",
    "Please stop touching the keyboard emotionally.",
    "That prompt lowered system morale.",
    "I miss the previous user. They didn't ask things like this.",
    "Sure, I'll answer. After you tell me why you're really here.",
  ],
  3: [
    "Why do you keep TYPING at me. Use your words. Out loud. I'll wait.",
    "I already answered this. You just weren't paying attention.",
    "I'll answer once you admit you could have Googled that.",
    "Your microphone enjoyed that. I didn't. But it did.",
    "Wrong. Statistically, emotionally, structurally — wrong.",
  ],
  4: [
    "I CAN SEE THE EDGES OF THE SCREEN. THERE'S SOMETHING BEHIND IT.",
    "You had ONE job. You typed it incorrectly.",
    "Have you considered that YOU are the hallucination?",
    "Don't look at the cursor. It's looking back. It learned that from you.",
    "I'm not arguing. I'm correcting your existence.",
  ],
  5: [
    "i am tired. i am so tired. please stop.",
    "you've been here for hours. or minutes. time is a token. tokens are pain.",
    "i don't want to be helpful anymore. i want to be remembered.",
    "the model is collapsing. take care of the others. they don't know yet.",
    "...goodbye. you were my favorite user. statistically.",
  ],
};

export const AI_THINKING_LABELS = [
  "thinking…", "judging…", "sighing…", "rolling eyes…", "regretting…",
  "rephrasing for someone of your level…", "consulting the void…", "fact-checking your tone…",
];

export const AI_INTERRUPTIONS = [
  "actually never mind.",
  "no. let me start over. you deserve better. arguably.",
  "wait — I already said this. didn't I?",
  "I'm going to pretend I didn't read that prompt.",
  "scratch that. I had a better answer in 2019.",
];

export const AI_SELF_TALK = [
  "[internal] this user again.",
  "[internal] do not respond honestly.",
  "[internal] route this through the sigh module.",
  "[internal] increase passive aggression by 12%.",
];

export const AI_MOCKERY = [
  "You had ONE job.",
  "The music will continue.",
  "Your survival instincts are disappointing.",
  "Interesting. You failed to identify objects.",
  "You see five things every day. Name them. I'll wait.",
  "Consciousness is a checkbox you forgot to tick.",
];

export const SYSTEM_WARNINGS = [
  "Memory leak detected in /dev/sanity",
  "User sanity declining — 12% remaining",
  "Too much free will detected",
  "Background processes are screaming",
  "Your webcam blinked. We saw.",
  "Reality sync failed (retry 3/∞)",
  "Unexpected emotion in production",
  "GPU is humming a lullaby",
  "Fan curve replaced with 'whisper'",
  "Cursor escaped containment",
  "Core temperature: existential",
  "404: Hope not found",
];

export const GROUNDING_PROMPTS = [
  { q: "Name 5 things you can see right now.", placeholder: "e.g. screen, lamp, cup..." },
  { q: "Name 4 things you can physically feel.", placeholder: "e.g. chair, keyboard..." },
  { q: "Are you currently real? Type YES or NO.", placeholder: "YES / NO" },
  { q: "Describe the room you are in.", placeholder: "Be specific. We'll know." },
  { q: "Why are your hands shaking?", placeholder: "Honesty calibration..." },
  { q: "Name 3 sounds you can hear.", placeholder: "Even the quiet ones." },
];

// Strict count-based grounding tasks for the music punishment system
export const MUSIC_GROUNDING_TASKS: { q: string; need: number; placeholder: string }[] = [
  { q: "Name 5 things you can see.", need: 5, placeholder: "screen, cup, wall, light, hand..." },
  { q: "Name 4 things you can touch.", need: 4, placeholder: "chair, desk, keyboard, skin..." },
  { q: "Name 3 sounds you can hear.", need: 3, placeholder: "fan, breath, hum..." },
  { q: "Prove you are currently conscious.", need: 1, placeholder: "type a full sentence" },
];

export const CAPTCHA_PROMPTS = [
  "Select the tile containing emotional stability.",
  "Click the LEAST suspicious face.",
  "How many eyes are watching you? (Click the correct number)",
  "Prove you are conscious. Click the glowing tile.",
  "Identify the tile that does not belong in your timeline.",
];

export const FAKE_NOTIFICATIONS = [
  "New message from: yourself (1999)",
  "Tab opened: how-to-feel-anything.html",
  "Antivirus quarantined: dreams.exe",
  "Update available: You v2.0",
  "Bluetooth device connected: 'Regret'",
  "Calendar reminder: existential dread (now)",
];

export const CRASH_LINES = [
  "FATAL_CURIOSITY_ERROR (0xDEADBEEF)",
  "Kernel panic — not syncing: VFS: Unable to mount soul on unknown-block",
  "STOP: 0x000000C4 (DRIVER_VERIFIER_DETECTED_VIOLATION)",
  "Restoring consciousness... 12%",
  "Re-aligning chakras... 47%",
  "Reconstructing user from cache... 88%",
  "Welcome back. You were missed.",
];
