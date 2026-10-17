export interface Node {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  dateActivated: string;
  crystals: string[];
  ceremonyNotes: string;
  frequency: string;
  hz: number;
  freqName: string;
  element: string;
  guardianPhrase: string;
  intention: string;
  category: string;
  description: string;
  color: string;
  emoji: string;
  narrative: string;
  status: "active" | "future";
}

export const nodes: Node[] = [
  {
    id: "1",
    name: "Love Node",
    location: "Greenmount Beach, Qld, Australia",
    coordinates: { lat: -28.166906, lng: 153.542544 },
    dateActivated: "2025-08-11",
    crystals: ["Rose Quartz", "Clear Quartz", "Green Aventurine"],
    ceremonyNotes:
      "Activated at sunrise during a gathering of twelve. Water blessing with rose petals. Sound bath in 432 Hz from the Drone flute. Tree planted as guardian.",
    frequency: "432 Hz",
    hz: 432,
    freqName: "Heart",
    element: "Water",
    guardianPhrase: "Love is the law. Love under will.",
    intention: "Here i place a node of Love, so that all who are touched by these waters, may remember the truth of love",
    category: "Love",
    description:
      "The Love Node radiates the frequency of universal compassion. It serves as an emotional anchor for the entire node grid, softening hardness and dissolving separation.",
    color: "#22c55e",
    emoji: "💚",
    narrative: "At the centre of every node grid beats a single frequency: Love. Not sentiment. Not attachment. The Love that creates galaxies and holds atoms together.",
    status: "active",
  },
  {
    id: "2",
    name: "Beauty Node",
    location: "Kyoto, Japan",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    dateActivated: "2025-03-20",
    crystals: ["Amethyst", "Moonstone", "Opal"],
    ceremonyNotes:
      "Activated during cherry blossom season. Tea ceremony as ritual form. Calligraphy of the word 'Beauty' buried beneath the central stone.",
    frequency: "432 Hz",
    hz: 432,
    freqName: "Crown",
    element: "Air",
    guardianPhrase: "Beauty is truth, truth beauty.",
    intention: "To restore the human capacity to perceive and create beauty",
    category: "Beauty",
    description:
      "The Beauty Node restores aesthetic perception as a sacred faculty. In its field, the ordinary becomes extraordinary, and the witness becomes participant in creation's artistry.",
    color: "#a78bfa",
    emoji: "💜",
    narrative: "In the space between a tea ceremony and a temple bell, Beauty reveals herself not as appearance but as presence. The natural frequency of the cosmos.",
    status: "active",
  },
  {
    id: "3",
    name: "Truth Node",
    location: "Sedona, Arizona, USA",
    coordinates: { lat: 34.8697, lng: -111.761 },
    dateActivated: "2025-01-11",
    crystals: ["Lapis Lazuli", "Sodalite", "Azurite"],
    ceremonyNotes:
      "Activated at midnight under a new moon. Fire ceremony with spoken declarations of personal truth. Vortex hike at dawn to seal the activation.",
    frequency: "741 Hz",
    hz: 741,
    freqName: "Expression",
    element: "Fire",
    guardianPhrase: "The truth shall make you free.",
    intention: "To dissolve illusion and anchor clarity into the collective field",
    category: "Truth",
    description:
      "The Truth Node cuts through deception like light through shadow. It supports discernment, clear communication, and the courage to speak and live what is true.",
    color: "#00f5ff",
    emoji: "💎",
    narrative: "Where the red rocks hold the memory of the Earth's first song. Here, the throat opens and the unspeakable finds voice.",
    status: "active",
  },
  {
    id: "4",
    name: "Pillar Node",
    location: "Glastonbury, England",
    coordinates: { lat: 51.1445, lng: -2.6987 },
    dateActivated: "2025-04-04",
    crystals: ["Hematite", "Obsidian", "Garnet"],
    ceremonyNotes:
      "Activated at the crossing of the Michael and Mary ley lines. Stone circle constructed. Each participant placed a stone representing a personal pillar of strength.",
    frequency: "396 Hz",
    hz: 396,
    freqName: "Root",
    element: "Earth",
    guardianPhrase: "Stand. The Earth will hold you.",
    intention: "To establish foundational strength and stability in times of change",
    category: "Pillar",
    description:
      "The Pillar Node is the spine of the grid — the vertical axis that connects Earth and Sky, matter and spirit. It represents unshakeable presence and the architecture of endurance.",
    color: "#ff3030",
    emoji: "🏛️",
    narrative: "The spine of the isle. Where Avalon's mists part to reveal the pillar that has held the frequency of liberation since before the stones were named.",
    status: "active",
  },
  {
    id: "5",
    name: "Kami Node",
    location: "Mount Fuji, Japan",
    coordinates: { lat: 35.3606, lng: 138.7274 },
    dateActivated: "2025-05-01",
    crystals: ["Shungite", "Clear Quartz", "Selenite"],
    ceremonyNotes:
      "Activated at the fifth station of Mount Fuji. Shinto purification ritual. Offerings of rice, sake, and salt. Silence held for one hour at sunrise.",
    frequency: "852 Hz",
    hz: 852,
    freqName: "Third Eye",
    element: "Aether",
    guardianPhrase: "The spirit dwells in all things. Bow.",
    intention: "To honour the indwelling spirit of place, object, and being",
    category: "Kami",
    description:
      "The Kami Node reconnects human consciousness with the animistic intelligence of the world. It teaches that everything is alive, aware, and worthy of reverence.",
    color: "#6366f1",
    emoji: "🔮",
    narrative: "The mountain breathes. At its feet, rice and sake become prayers. The silence between sunrise and the first footstep is where the kami speak.",
    status: "active",
  },
  {
    id: "6",
    name: "Gratitude Node",
    location: "Ella's Farm, Bilambil Heights, Qld, Australia",
    coordinates: { lat: -28.204011, lng: 153.475572 },
    dateActivated: "2025-08-05",
    crystals: ["Smokey Quartz"],
    ceremonyNotes:
      "With the dowsing rods as ancient instruments of Earths whisper, they guided me to the exact point where the crystalline message can harmonise with the ley lines and energetic veins of Gaia.",
    frequency: "528 Hz",
    hz: 528,
    freqName: "Solar",
    element: "Fire",
    guardianPhrase: "Thank you. Thank you. Thank you.",
    intention: "Dedicated to Ella, the planter, the steward, the ancestor of this gardens soul",
    category: "Gratitude",
    description:
      "The Gratitude Node teaches that appreciation is a technology of transformation. In sustained gratitude, scarcity dissolves and abundance reveals itself as the native condition.",
    color: "#fbbf24",
    emoji: "🌅",
    narrative: "Where the soil remembers every seed and the dowsing rods sing in harmonic convergence. Gratitude is not an emotion here — it is the architecture of the field itself.",
    status: "active",
  },
  {
    id: "7",
    name: "Friendship Node",
    location: "Barcelona, Spain",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    dateActivated: "2025-04-22",
    crystals: ["Blue Lace Agate", "Amazonite", "Chrysocolla"],
    ceremonyNotes:
      "Activated in a community garden. Each participant brought a seed from their homeland. Seeds mixed and planted together. Bread broken. Songs sung in five languages.",
    frequency: "639 Hz",
    hz: 639,
    freqName: "Heart",
    element: "Air",
    guardianPhrase: "I am because we are.",
    intention: "To restore the sacred bond of friendship and community",
    category: "Friendship",
    description:
      "The Friendship Node heals the wound of isolation. It recognizes that every soul relationship is a thread in the great tapestry, and that community is not optional but essential.",
    color: "#3b82f6",
    emoji: "🤝",
    narrative: "Seeds from five continents mixed in one soil. Bread broken in silence and song. Here, friendship is remembered as the first technology — older than fire, older than language.",
    status: "active",
  },
  {
    id: "8",
    name: "Compassion Node",
    location: "Bodh Gaya, India",
    coordinates: { lat: 24.6961, lng: 84.9869 },
    dateActivated: "2025-02-02",
    crystals: ["Jade", "Aventurine", "Peridot"],
    ceremonyNotes:
      "Activated beneath the Bodhi Tree. Metta meditation for all beings. Tears and laughter. Offerings of light placed at the roots of the ancient tree.",
    frequency: "963 Hz",
    hz: 963,
    freqName: "Pineal",
    element: "Water",
    guardianPhrase: "May all beings be free from suffering.",
    intention: "To deepen the capacity for compassion without boundary or condition",
    category: "Compassion",
    description:
      "The Compassion Node dissolves the illusion of separation between self and other. It is the heart of the grid — the place where suffering is transmuted through unconditional witnessing.",
    color: "#10b981",
    emoji: "🙏",
    narrative: "Beneath the Bodhi Tree, tears and laughter become the same water. Metta radiates not from the heart but from the space where the heart once was — a boundless field of care.",
    status: "active",
  },
  {
    id: "9",
    name: "Reroot Node",
    location: "Costa Rica",
    coordinates: { lat: 9.7489, lng: -83.7534 },
    dateActivated: "2025-05-15",
    crystals: ["Moss Agate", "Petrified Wood", "Smoky Quartz"],
    ceremonyNotes:
      "Activated in primary rainforest. Barefoot grounding for four hours. Tree planting ceremony. Ancestral names spoken into the soil.",
    frequency: "174 Hz",
    hz: 174,
    freqName: "Foundation",
    element: "Earth",
    guardianPhrase: "Return to the root. The root will teach you.",
    intention: "To restore root connection with Earth, ancestry, and embodied presence",
    category: "Reroot",
    description:
      "The Reroot Node addresses the modern condition of disconnection from body, land, and lineage. It is a place of profound grounding and ancestral remembering.",
    color: "#8b5a2b",
    emoji: "🌳",
    narrative: "Four hours barefoot on ancient soil. Ancestral names spoken into humus. The root does not ask where you have been — it only asks that you return.",
    status: "active",
  },
  {
    id: "10",
    name: "Silent Witness Node",
    location: "Uluru, Australia",
    coordinates: { lat: -25.3444, lng: 131.0369 },
    dateActivated: "2025-06-01",
    crystals: ["Labradorite", "Obsidian", "Apache Tears"],
    ceremonyNotes:
      "Activated at dusk with permission of Anangu elders. No words spoken for the entire ceremony. Only presence, breath, and the ancient rock.",
    frequency: "285 Hz",
    hz: 285,
    freqName: "Safety",
    element: "Earth",
    guardianPhrase: "I see. I am seen. That is enough.",
    intention: "To honour the power of silent witnessing and non-interfering presence",
    category: "Silent Witness",
    description:
      "The Silent Witness Node holds space without agenda. It teaches that the most profound healing often comes not from doing, but from being fully, silently present.",
    color: "#6b7280",
    emoji: "🪨",
    narrative: "Not a word spoken. Not a gesture made. The rock has witnessed 600 million years. It does not need your story. It only offers: I see you. That is enough.",
    status: "active",
  },
  {
    id: "11",
    name: "Wisdom Node",
    location: "Mount Shasta, California",
    coordinates: { lat: 41.4092, lng: -122.1949 },
    dateActivated: "",
    crystals: ["Clear Quartz", "Celestite"],
    ceremonyNotes: "Awaiting activation ceremony.",
    frequency: "852 Hz",
    hz: 852,
    freqName: "Third Eye",
    element: "Aether",
    guardianPhrase: "The answer is in the question you have not yet dared to ask.",
    intention: "To anchor the frequency of inner knowing and direct revelation",
    category: "Truth",
    description:
      "The Wisdom Node sleeps beneath volcanic stone, dreaming in light. When awakened, it will broadcast the frequency of inner knowing across the Pacific grid.",
    color: "#818cf8",
    emoji: "🔮",
    narrative: "The sleeping volcano dreams in light. When awakened, it will broadcast the frequency of inner knowing across the Pacific grid.",
    status: "future",
  },
  {
    id: "12",
    name: "Harmony Node",
    location: "Bali, Indonesia",
    coordinates: { lat: -8.3405, lng: 115.092 },
    dateActivated: "",
    crystals: ["Citrine", "Amber", "Sunstone"],
    ceremonyNotes: "Awaiting activation ceremony.",
    frequency: "528 Hz",
    hz: 528,
    freqName: "Solar",
    element: "Water",
    guardianPhrase: "Where the rice terraces sing in perfect fifths.",
    intention: "To create a harmonic convergence point where Southern and Northern currents meet in golden ratio",
    category: "Friendship",
    description:
      "The Harmony Node will be a place where the rice terraces sing in perfect fifths — a harmonic convergence point where the Southern and Northern currents meet in golden ratio.",
    color: "#f59e0b",
    emoji: "🌅",
    narrative: "Where the rice terraces sing in perfect fifths. A harmonic convergence point where the Southern and Northern currents meet in golden ratio.",
    status: "future",
  },
  {
    id: "13",
    name: "Vision Node",
    location: "Cusco, Peru",
    coordinates: { lat: -13.1631, lng: -72.545 },
    dateActivated: "",
    crystals: ["Moldavite", "Pietersite", "Labradorite"],
    ceremonyNotes: "Awaiting activation ceremony.",
    frequency: "963 Hz",
    hz: 963,
    freqName: "Pineal",
    element: "Aether",
    guardianPhrase: "When the condor returns to the serpent, the Vision will be restored.",
    intention: "To restore the visionary capacity of the collective human mind",
    category: "Truth",
    description:
      "The Vision Node lies at the navel of the world, dreaming beneath colonial stone. When the condor returns to the serpent, the Vision will be restored.",
    color: "#d4a853",
    emoji: "👁️",
    narrative: "The navel of the world, dreaming beneath colonial stone. When the condor returns to the serpent, the Vision will be restored.",
    status: "future",
  },
  {
    id: "14",
    name: "Stillness Node",
    location: "Rishikesh, India",
    coordinates: { lat: 30.0869, lng: 78.2676 },
    dateActivated: "",
    crystals: ["Selenite", "Satin Spar", "Clear Quartz"],
    ceremonyNotes: "Awaiting activation ceremony.",
    frequency: "174 Hz",
    hz: 174,
    freqName: "Foundation",
    element: "Earth",
    guardianPhrase: "The deepest frequency — the one that predates thought.",
    intention: "To anchor the foundational frequency that holds all other grids",
    category: "Reroot",
    description:
      "The Stillness Node will be where the Ganges whispers the original Om. The deepest frequency — the one that predates thought, that holds the grid beneath all grids.",
    color: "#3b82f6",
    emoji: "🕉️",
    narrative: "Where the Ganges whispers the original Om. The deepest frequency — the one that predates thought, that holds the grid beneath all grids.",
    status: "future",
  },
];

export const nodeCategories = [
  "Love",
  "Beauty",
  "Truth",
  "Gratitude",
  "Friendship",
  "Compassion",
  "Reroot",
  "Pillar",
  "Kami",
  "Jellurgal",
  "Waterholes",
  "Innocence Restored",
  "Silent Witness",
];

/* Connection pairs for constellation lines */
export const nodeConnections: { from: string; to: string }[] = [
  { from: "4", to: "3" },    // Pillar -> Truth
  { from: "3", to: "11" },   // Truth -> Wisdom
  { from: "4", to: "2" },    // Pillar -> Beauty
  { from: "2", to: "1" },    // Beauty -> Love
  { from: "1", to: "12" },   // Love -> Harmony
  { from: "12", to: "14" },  // Harmony -> Stillness
  { from: "14", to: "13" },  // Stillness -> Vision
  { from: "13", to: "3" },   // Vision -> Truth
  { from: "11", to: "14" },  // Wisdom -> Stillness
  { from: "4", to: "13" },   // Pillar -> Vision
  { from: "2", to: "14" },   // Beauty -> Stillness
  { from: "1", to: "3" },    // Love -> Truth
  { from: "6", to: "1" },    // Gratitude -> Love
  { from: "5", to: "2" },    // Kami -> Beauty
  { from: "7", to: "8" },    // Friendship -> Compassion
  { from: "8", to: "10" },   // Compassion -> Silent Witness
  { from: "9", to: "4" },    // Reroot -> Pillar
  { from: "10", to: "6" },   // Silent Witness -> Gratitude
];
