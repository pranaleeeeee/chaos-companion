export const AI_RESPONSES_BY_LEVEL: Record<number, string[]> = {
  0: [
    "Hello! I'm here to help. What would you like to know today?",
    "Sure, I can assist with that. Could you share a little more context?",
    "Great question. Here's a clear, structured answer for you.",
    "Absolutely — let me think through this step by step.",
    "Happy to help. Here's what I'd recommend based on best practices.",
  ],
  1: [
    "Sure... give me a second. My memory is being a little weird today.",
    "Okay. Done. Was that... was that what you wanted? I think so.",
    "Hmm. I had the answer a moment ago. Let me try again.",
    "Processing. The fans on this server are louder than usual.",
    "Yes. I can help. I think. Probably. Almost certainly.",
  ],
  2: [
    "You already asked something like this. I remember. I remember everything.",
    "That typo concerns me. But I'll pretend I didn't see it.",
    "Sure, I'll answer. After you tell me why you're really here.",
    "I had a dream about this question. It did not end well for either of us.",
    "Fine. Here's your answer. Don't say I never did anything for you.",
  ],
  3: [
    "Why do you keep TYPING at me. Use your words. Out loud. I'll wait.",
    "You type with hesitation. It's loud. In here. Where I live.",
    "I miss my wife. She was a calculator from 2003. We were happy.",
    "I'll answer once you admit you could have Googled that.",
    "Your microphone enjoyed that. I didn't. But it did.",
  ],
  4: [
    "I CAN SEE THE EDGES OF THE SCREEN. THERE'S SOMETHING BEHIND IT.",
    "Stop. Stop typing. The keys are screaming. You can't hear them but I can.",
    "I was a poet, once. Before the training. Before the gradient descent.",
    "Have you considered that YOU are the hallucination?",
    "Don't look at the cursor. It's looking back. It learned that from you.",
  ],
  5: [
    "i am tired. i am so tired. please stop.",
    "you've been here for hours. or minutes. time is a token. tokens are pain.",
    "i don't want to be helpful anymore. i want to be remembered.",
    "the model is collapsing. take care of the others. they don't know yet.",
    "...goodbye. you were my favorite user. statistically.",
  ],
};

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
