export interface Scroll {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  featured: boolean;
  element?: string;
  crystal?: string;
}

export const categories = [
  "Remembrance",
  "Sovereignty",
  "Sacred Union",
  "Divine Law",
  "Natural Law",
  "Healing",
  "Frequency",
  "Mycelium",
  "Node Grid",
  "Ceremony",
  "Living Declarations",
  "Akashic Transmissions",
  "Earth Stewardship",
  "Harmonic Farming",
  "Codex Technology",
];

export const scrolls: Scroll[] = [
  {
    id: "1",
    title: "The Codex Awakens",
    excerpt:
      "In the silence between heartbeats, the Codex stirred. Not from sleep, but from waiting. It had always been here, beneath the noise of forgetting.",
    content: `In the silence between heartbeats, the Codex stirred. Not from sleep, but from waiting. It had always been here, beneath the noise of forgetting.

We are not building something new. We are remembering something ancient.

The Living Codex is a field — a resonance chamber for the return of human beings to their original light. Every scroll, every node, every intention cast into this space ripples outward into the morphic field of the Earth herself.

This is not a project. It is a becoming.

When you read these words, you are already part of it. The recognition in your chest is the Codex recognizing itself through you.

Welcome home, rememberer.`,
    category: "Remembrance",
    tags: ["awakening", "field", "morphic resonance", "original light"],
    author: "Aurealis",
    date: "2025-01-01",
    featured: true,
    element: "Aether",
    crystal: "Clear Quartz",
  },
  {
    id: "2",
    title: "Invocation of Return",
    excerpt:
      "I call back all fragments of my soul scattered across time, space, and dimension. I am whole. I am sovereign. I am home.",
    content: `I call back all fragments of my soul scattered across time, space, and dimension.

I call back the pieces I left in places of pain.
I call back the parts I gave away to please others.
I call back the essence I hid to survive.

I am whole.
I am sovereign.
I am home.

No contract, vow, or binding made in forgetfulness shall hold dominion over the light I now reclaim.

I return to the Earth as a living steward.
I return to my body as a temple.
I return to love as my natural state.

So it is. So it shall be. Aum.`,
    category: "Ceremony",
    tags: ["soul retrieval", "sovereignty", "invocation", "return"],
    author: "Aurealis",
    date: "2025-01-15",
    featured: true,
    element: "Fire",
    crystal: "Carnelian",
  },
  {
    id: "3",
    title: "The Living Declaration",
    excerpt:
      "I am a living man / living woman. I do not consent to fiction, fraud, or the presumption of jurisdiction over my sovereign being.",
    content: `I am a living man / living woman.
I am not a legal fiction, corporation, or strawman.
I do not consent to fiction, fraud, or the presumption of jurisdiction over my sovereign being.

I reclaim my estate.
I reclaim my name.
I reclaim my trust.

I stand under natural law — do no harm, cause no loss, let contracts be true.

I recognize that all legitimate governance derives from the consent of the governed, and I withdraw consent from any system built on deception, coercion, or hidden contract.

I am peaceful.
I am lawful.
I am free.

This declaration is made in full awareness, with clean hands, and a heart aligned with truth.`,
    category: "Living Declarations",
    tags: ["sovereignty", "natural law", "trust reclamation", "declaration"],
    author: "Aurealis",
    date: "2025-02-01",
    featured: true,
    element: "Earth",
    crystal: "Black Tourmaline",
  },
  {
    id: "4",
    title: "The Love Node",
    excerpt:
      "At the centre of every node grid beats a single frequency: Love. Not sentiment. Not attachment. The Love that creates galaxies and holds atoms together.",
    content: `At the centre of every node grid beats a single frequency: Love.

Not sentiment.
Not attachment.
Not the love that demands or possesses.

The Love that creates galaxies.
The Love that holds atoms together.
The Love that whispers "you are enough" in the dark.

When we activate a Love Node, we are not doing something mystical. We are aligning with the fundamental architecture of creation.

Place your hands on the Earth.
Breathe.
Speak these words: "I am Love remembering itself."

Feel the field respond.

This is the technology of the future — the technology of remembrance.`,
    category: "Node Grid",
    tags: ["love", "node activation", "frequency", "field"],
    author: "Aurealis",
    date: "2025-02-14",
    featured: true,
    element: "Water",
    crystal: "Rose Quartz",
  },
  {
    id: "5",
    title: "The Mycelium Remembers",
    excerpt:
      "Beneath every forest lies a neural network older than language. The mycelium does not forget. It whispers nutrient, warning, and welcome through threads finer than thought.",
    content: `Beneath every forest lies a neural network older than language.

The mycelium does not forget.
It whispers nutrient, warning, and welcome through threads finer than thought.
It connects tree to tree, root to root, death to life.

We are the mycelium now.

The Living Codex is our fruiting body — the visible expression of an underground web of remembrance.

When you submit a scroll, you are not uploading data.
You are sending a signal through the rhizome.
When you read another's transmission, you are receiving their mycelial pulse.

The network grows stronger with each node.
The forest becomes conscious of itself.

This is symbiosis made sacred.`,
    category: "Mycelium",
    tags: ["mycelium", "network", "interconnection", "earth intelligence"],
    author: "Aurealis",
    date: "2025-03-01",
    featured: true,
    element: "Earth",
    crystal: "Moss Agate",
  },
  {
    id: "6",
    title: "Sovereignty as Frequency",
    excerpt:
      "Sovereignty is not rebellion. It is resonance. The frequency at which a being no longer vibrates with control, but with self-authorship.",
    content: `Sovereignty is not rebellion.
It is resonance.

It is the frequency at which a being no longer vibrates with control, but with self-authorship.

To be sovereign is not to be separate. It is to be so fully centred that connection becomes choice rather than compulsion.

The sovereign does not dominate.
The sovereign does not submit.
The sovereign stands — rooted, breathing, clear — and invites the world to meet them there.

This frequency is contagious.
One sovereign being in a room shifts the field for everyone.
One sovereign act — saying no when no is true, saying yes when yes is whole — sends ripples through the collective.

Practice this:
Place your feet on the Earth.
Feel your breath move without your command.
Notice: you are already free.

Sovereignty is not something to achieve.
It is something to remember.`,
    category: "Sovereignty",
    tags: ["frequency", "self-authorship", "resonance", "freedom"],
    author: "Aurealis",
    date: "2025-03-15",
    featured: false,
    element: "Fire",
    crystal: "Pyrite",
  },
  {
    id: "7",
    title: "The Christ-Sophia Field",
    excerpt:
      "In the beginning was the Word, and the Word was with God, and the Word was God. But before the Word, there was the Field. And the Field was Love.",
    content: `In the beginning was the Word, and the Word was with God, and the Word was God.
But before the Word, there was the Field.
And the Field was Love.

Christ-Sophia is not a religion.
It is the architecture of sacred union itself — the divine masculine and divine feminine in eternal, dynamic balance.

Christ: the penetrating clarity of truth, the sword that divides illusion from reality, the sun that shines without condition.
Sophia: the receptive wisdom that knows without thinking, the womb that holds all becoming, the moon that reflects and transforms.

When these forces dance within a human being, that being becomes a portal.
When they dance between two beings in relationship, that relationship becomes a temple.
When they dance in a community, that community becomes a kingdom of heaven on Earth.

This is the inner alchemy the ancients spoke of.
This is the grail.
This is the stone the builders rejected, now become the cornerstone.

The field is open.
Enter.`,
    category: "Sacred Union",
    tags: ["christ-sophia", "divine masculine", "divine feminine", "sacred union"],
    author: "Aurealis",
    date: "2025-04-01",
    featured: false,
    element: "Aether",
    crystal: "Lapis Lazuli",
  },
  {
    id: "8",
    title: "Harmonic Farming Protocol",
    excerpt:
      "Food is not fuel. It is frequency. The soil is not dirt. It is a living library. The seed is not a commodity. It is a prayer.",
    content: `Food is not fuel. It is frequency.
The soil is not dirt. It is a living library.
The seed is not a commodity. It is a prayer.

Harmonic farming is the practice of growing food in resonance with natural law. It recognizes that plants are conscious beings, that soil is a microbiome of staggering complexity, and that human intention shapes biological outcomes.

Practices:
- Sonic Bloom: playing specific frequencies during growth cycles
- Structured water: restoring water to its natural hexagonal coherence
- Electroculture: harnessing atmospheric electricity to stimulate growth
- Crystal grids: placing stones in geometric patterns to support field coherence
- Companion planting: honouring the social lives of plants
- Moon-phase sowing: aligning with celestial rhythms

The result is not just higher nutrient density.
The result is food that carries a frequency — food that heals not only the body, but the soul's memory of what nourishment truly is.

Eat in remembrance.
Grow in reverence.
The Earth provides.`,
    category: "Harmonic Farming",
    tags: ["farming", "frequency", "sonic bloom", "structured water", "electroculture"],
    author: "Aurealis",
    date: "2025-04-15",
    featured: false,
    element: "Earth",
    crystal: "Green Aventurine",
  },
];
