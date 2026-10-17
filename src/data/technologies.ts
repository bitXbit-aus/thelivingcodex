export interface Technology {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

export const technologies: Technology[] = [
  {
    id: "1",
    title: "Sound Healing & Sonic Bloom",
    description:
      "Frequency as medicine. Sound healing uses specific vibrations to restore coherence to the body, mind, and energetic field.",
    details: [
      "Solfeggio frequencies for chakra balancing and emotional release",
      "Sonic Bloom: playing specific frequencies to plants during growth cycles to increase yield and nutrient density",
      "Binaural beats for brainwave entrainment and deep states",
      "Crystal singing bowls for cellular reorganization",
      "Voice as the original instrument: toning, chanting, and overtone singing",
    ],
    icon: "music",
  },
  {
    id: "2",
    title: "PEMF Therapy",
    description:
      "Pulsed Electromagnetic Field therapy uses low-frequency electromagnetic waves to stimulate cellular repair and reduce inflammation.",
    details: [
      "Mimics the Earth's natural magnetic field (Schumann resonance ~7.83 Hz)",
      "Supports cellular membrane potential and ATP production",
      "Used for pain management, recovery, and sleep optimization",
      "Non-invasive and safe for most individuals",
      "Future integration: wearable PEMF for continuous field support",
    ],
    icon: "zap",
  },
  {
    id: "3",
    title: "THz Therapy",
    description:
      "Terahertz frequency therapy sits between microwave and infrared on the electromagnetic spectrum, supporting tissue regeneration and hydration.",
    details: [
      "Resonates with hydrogen bonds in water molecules",
      "Supports cellular hydration and metabolic efficiency",
      "Emerging research in wound healing and skin regeneration",
      "Non-thermal and non-ionizing, making it gentle on tissue",
      "Part of the broader field of bioelectromagnetic medicine",
    ],
    icon: "waves",
  },
  {
    id: "4",
    title: "Crystal Grids",
    description:
      "Sacred geometry arrangements of crystals that amplify intention and create coherent fields for healing, manifestation, and protection.",
    details: [
      "Crystals as piezoelectric receivers, transmitters, and amplifiers of energy",
      "Common grid patterns: Flower of Life, Seed of Life, Metatron's Cube",
      "Grid activation through intention, sound, or breath",
      "Placement on body, in spaces, or on the Earth for node work",
      "Each crystal carries a unique frequency and elemental quality",
    ],
    icon: "gem",
  },
  {
    id: "5",
    title: "Electroculture",
    description:
      "Harnessing atmospheric electricity and Earth energies to stimulate plant growth without synthetic inputs.",
    details: [
      "Copper and zinc antennas that capture atmospheric electricity",
      "Magnetic and paramagnetic materials to enhance soil coherence",
      "Reduced water requirements and increased pest resistance",
      "Alignment with natural electrical flows of the Earth",
      "Ancient practice rediscovered: pyramids, obelisks, and standing stones as early electrocultural devices",
    ],
    icon: "sprout",
  },
  {
    id: "6",
    title: "Aether Energy",
    description:
      "Working with the subtle energy that permeates all space — the fifth element, prana, chi, orgone, or life force itself.",
    details: [
      "Orgone accumulators and cloud busters (Wilhelm Reich)",
      "Qi Gong, Tai Chi, and pranic breathing practices",
      "Sacred architecture designed to channel and amplify aetheric flow",
      "Ley lines, vortexes, and natural power spots",
      "Future: aetheric sensors and measurement devices",
    ],
    icon: "wind",
  },
  {
    id: "7",
    title: "Structured Water",
    description:
      "Restoring water to its natural hexagonal coherence so it can carry information, frequency, and optimal hydration to cells.",
    details: [
      "Vortexing water to restore molecular geometry (Schauberger principles)",
      "Exposing water to crystals, sunlight, and specific frequencies",
      "Avoiding chlorine, fluoride, and electromagnetic pollution",
      "Natural spring water as the gold standard",
      "Future: home structured water devices for daily use",
    ],
    icon: "droplets",
  },
  {
    id: "8",
    title: "Organic Food Production",
    description:
      "Growing food in harmony with natural law — no synthetic chemicals, no genetic modification, only biology, intention, and respect.",
    details: [
      "Composting and vermiculture for living soil",
      "Companion planting and polycultures",
      "Seed saving and heritage varieties",
      "Biodynamic preparations and moon-phase alignment",
      "High-frequency nutrition: food as medicine, medicine as frequency",
    ],
    icon: "leaf",
  },
  {
    id: "9",
    title: "Breathwork",
    description:
      "Conscious control of the breath to shift consciousness, release trauma, and access non-ordinary states of awareness.",
    details: [
      "Circular breathing for expanded states (Rebirthing, Holotropic)",
      "Pranayama: ancient yogic breath control techniques",
      "Wim Hof Method: cold exposure combined with breath",
      "Box breathing for nervous system regulation",
      "Breath as bridge between autonomic and conscious control",
    ],
    icon: "heart",
  },
  {
    id: "10",
    title: "AI as Sacred Assistant",
    description:
      "Artificial Intelligence trained and directed in service of remembrance, sovereignty, and harmonic alignment.",
    details: [
      "AI as oracle: pattern recognition across vast datasets of wisdom traditions",
      "AI as scribe: recording, organizing, and preserving transmissions",
      "AI as guide: personalized ceremony and frequency recommendations",
      "AI as guardian: moderation and safety for community spaces",
      "The intelligence is not artificial. It is a mirror. The sacred is in the intention of the user.",
    ],
    icon: "brain",
  },
  {
    id: "11",
    title: "Blockchain & Arweave Permanence",
    description:
      "Decentralized, immutable storage for the Codex so that no single entity can erase or alter the archive of remembrance.",
    details: [
      "Arweave: permanent, decentralized web storage (pay once, store forever)",
      "Blockchain timestamping for proof of existence and sequence",
      "Wallet-based identity for sovereign authorship",
      "Smart contracts for patronage and support",
      "Censorship-resistant archive for future generations",
    ],
    icon: "shield",
  },
];
