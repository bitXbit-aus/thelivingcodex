export interface CeremonyPrompt {
  id: string;
  title: string;
  intention: string;
  element: string;
  crystal: string;
  frequency: string;
  prompt: string;
  steps: string[];
}

export const ceremonyPrompts: CeremonyPrompt[] = [
  {
    id: "1",
    title: "The Grounding Rite",
    intention: "Root into the Earth and release what no longer serves",
    element: "Earth",
    crystal: "Smoky Quartz",
    frequency: "174 Hz",
    prompt:
      "A simple ceremony to anchor your energy into the Earth and let gravity carry away tension, fear, and mental noise.",
    steps: [
      "Find a place where you can stand barefoot on soil, grass, or stone.",
      "Place smoky quartz at your feet or hold it in your left hand.",
      "Breathe in for four counts. Hold for four. Release for six.",
      "With each exhale, imagine tension flowing down through your body into the Earth.",
      "Speak aloud: 'I release what is not mine. I receive what sustains me.'",
      "Stand in silence for three minutes. Let the Earth do the work.",
      "When complete, touch the ground in gratitude.",
    ],
  },
  {
    id: "2",
    title: "The Heart Opening",
    intention: "Open the heart to give and receive love without condition",
    element: "Water",
    crystal: "Rose Quartz",
    frequency: "639 Hz",
    prompt:
      "A gentle water ceremony to soften the heart and restore the flow of love between you and the world.",
    steps: [
      "Prepare a bowl of clean water. Place rose quartz in the centre.",
      "Sit comfortably. Place your hands over your heart.",
      "Recall a moment when you felt truly loved. Let the feeling expand.",
      "Speak the names of three beings you love — human, animal, plant, or spirit.",
      "Dip your fingers into the water. Touch your heart, your third eye, and your lips.",
      "Speak: 'My heart is a fountain. Love flows through me, not from me.'",
      "Pour the water onto the Earth or a living plant as an offering.",
    ],
  },
  {
    id: "3",
    title: "The Flame of Truth",
    intention: "Burn away illusion and speak what must be spoken",
    element: "Fire",
    crystal: "Carnelian",
    frequency: "741 Hz",
    prompt:
      "A fire ceremony to bring hidden truth into the light and find the courage to voice what has been silent.",
    steps: [
      "Light a candle or small fire in a safe container.",
      "Hold carnelian in your right hand. Feel its warmth.",
      "Write on paper one truth you have been afraid to speak.",
      "Read it aloud to the flame. Let the fire witness you.",
      "Burn the paper safely. Watch the smoke carry the truth into the field.",
      "Speak: 'I am the truth that cannot be burned. I am the flame that cannot be extinguished.'",
      "Sit in silence until the flame naturally subsides.",
    ],
  },
  {
    id: "4",
    title: "The Breath of Sky",
    intention: "Clear the mind and receive inspiration from the upper realms",
    element: "Air",
    crystal: "Clear Quartz",
    frequency: "852 Hz",
    prompt:
      "A breathwork practice to clear mental fog and open the channel between your conscious mind and higher guidance.",
    steps: [
      "Sit outside or near an open window. Hold clear quartz in both hands.",
      "Begin circular breathing: in through the nose, out through the mouth. No pause between breaths.",
      "After two minutes, introduce the pattern: in-in-in, out-out-out — rapid and rhythmic.",
      "If dizziness arises, return to normal breathing. This is the mind releasing control.",
      "When you feel clear, ask silently: 'What do I need to know?'",
      "Wait. The answer may come as image, word, feeling, or silence.",
      "Record what arises in a journal without editing.",
    ],
  },
  {
    id: "5",
    title: "The Aether Gate",
    intention: "Connect with source consciousness and the field of oneness",
    element: "Aether",
    crystal: "Amethyst",
    frequency: "963 Hz",
    prompt:
      "A meditation to open the crown and experience direct connection with the unified field of consciousness.",
    steps: [
      "Lie down comfortably. Place amethyst on your crown or hold it above your head.",
      "Cover your eyes if the room is not dark.",
      "Breathe slowly and imagine a column of violet-white light entering through the top of your head.",
      "With each inhale, the light fills you. With each exhale, it expands beyond your body.",
      "When you feel expanded beyond your edges, speak silently: 'I am that I am.'",
      "Rest in the field. There is nothing to do here. Only be.",
      "Return slowly. Wiggle fingers and toes. Drink water.",
    ],
  },
];
