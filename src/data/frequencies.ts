export interface Frequency {
  id: string;
  hz: string;
  name: string;
  description: string;
  color: string;
  element: string;
  benefit: string;
}

export const frequencies: Frequency[] = [
  {
    id: "1",
    hz: "174 Hz",
    name: "The Foundation",
    description:
      "The lowest tone in the Solfeggio scale. It resonates with the Earth and the physical body, creating a sense of security and groundedness.",
    color: "#8B4513",
    element: "Earth",
    benefit: "Pain relief, grounding, security, root chakra support",
  },
  {
    id: "2",
    hz: "285 Hz",
    name: "The Restorer",
    description:
      "Supports the restoration of tissue and the remembrance of the body's original blueprint. A frequency of renewal and return.",
    color: "#D2691E",
    element: "Earth",
    benefit: "Cellular healing, tissue repair, energetic restoration",
  },
  {
    id: "3",
    hz: "396 Hz",
    name: "Liberation",
    description:
      "Liberates energy from guilt, fear, and limiting beliefs. The frequency of turning grief into liberation.",
    color: "#DC143C",
    element: "Fire",
    benefit: "Releasing guilt and fear, root chakra, liberation",
  },
  {
    id: "4",
    hz: "417 Hz",
    name: "The Undoing",
    description:
      "Facilitates change and the clearing of traumatic imprints. Undoing what no longer serves with gentleness and power.",
    color: "#FF4500",
    element: "Fire",
    benefit: "Trauma release, facilitating change, clearing negativity",
  },
  {
    id: "5",
    hz: "432 Hz",
    name: "Natural Harmony",
    description:
      "The tuning of nature itself. Resonates with the Earth's frequency and promotes deep calm, clarity, and coherence.",
    color: "#FFD700",
    element: "Air",
    benefit: "Deep relaxation, natural alignment, mental clarity",
  },
  {
    id: "6",
    hz: "528 Hz",
    name: "Miracle",
    description:
      "The frequency of transformation and DNA repair. Known as the Love frequency. It brings the miraculous into the mundane.",
    color: "#32CD32",
    element: "Water",
    benefit: "DNA repair, transformation, love, heart opening",
  },
  {
    id: "7",
    hz: "639 Hz",
    name: "Connection",
    description:
      "Enhances communication, understanding, and heart-centred connection. The bridge frequency for relationships.",
    color: "#1E90FF",
    element: "Water",
    benefit: "Heart chakra, relationships, communication, empathy",
  },
  {
    id: "8",
    hz: "741 Hz",
    name: "Awakening",
    description:
      "Awakens intuition, cleanses cells of toxins, and supports the expression of authentic self. The truth-teller's tone.",
    color: "#4B0082",
    element: "Air",
    benefit: "Intuition, detoxification, self-expression, truth",
  },
  {
    id: "9",
    hz: "852 Hz",
    name: "Return",
    description:
      "Supports the return to spiritual order and the awakening of inner sight. The frequency of the third eye.",
    color: "#7B68EE",
    element: "Aether",
    benefit: "Third eye, intuition, spiritual order, inner sight",
  },
  {
    id: "10",
    hz: "963 Hz",
    name: "Crown",
    description:
      "The frequency of divine connection and the return to oneness. It opens the crown and invites the light of source.",
    color: "#E6E6FA",
    element: "Aether",
    benefit: "Crown chakra, oneness, divine connection, enlightenment",
  },
];
