import { State, CardRarity, Card } from "./reducer";

// --- Basic helpers ---

export const getView = (state: State) => state.view;

export const getAvailablePacks = (state: State) => state.packs.available;

export const getCurrentPackIds = (state: State) =>
  state.packs.current.cards;

export const getCollectionIds = (state: State) =>
  state.collection.cards;

// --- Data accessors ---

export const getCardById = (state: State, cardId: string) =>
  state.cardsById[cardId];

export const getCardsByIds = (state: State, cardIds: string[]) =>
  cardIds.map(id => state.cardsById[id]);

// --- Derived selectors ---

export const getCurrentPackCards = (state: State) => 
  getCardsByIds(state, getCurrentPackIds(state));

export const getCollectionCards = (state: State) => 
  getCardsByIds(state, getCollectionIds(state));

export const getActivePackCard = (state: State) => {
  const { cards, cardIndex } = state.packs.current;
  return cards.length > 0
    ? state.cardsById[cards[cardIndex]]
    : null;
};

const cardRarities: CardRarity[] = [
  "HYPER_RARE",
  "SPECIAL_ILLUSTRATION_RARE",
  "ILLUSTRATION_RARE",
  "ULTRA_RARE",
  "DOUBLE_RARE",
  "RARE",
  "UNCOMMON",
  "COMMON",
];

// approximate per-card probabilities
const perCardProbabilities: Record<CardRarity, number> = {
  HYPER_RARE: 0.00196,
  SPECIAL_ILLUSTRATION_RARE: 0.003125,
  ILLUSTRATION_RARE: 0.00833,
  ULTRA_RARE: 0.00625,
  DOUBLE_RARE: 0.0125,
  RARE: 0.1,
  UNCOMMON: 0.3,
  COMMON: 0.567795,
};

export const getRandomCardIds = (state: State, count = 10) => {
  const allCards = Object.values(state.cardsById);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    let picked: Card | undefined;

    while (!picked) {
      const rnd = Math.random();
      let cumulative = 0;
      for (const rarity of cardRarities) {
        cumulative += perCardProbabilities[rarity] || 0;
        if (rnd < cumulative) {
          const candidates = allCards.filter(c => c.rarity.designation === rarity);
          if (candidates.length > 0) {
            picked = candidates[Math.floor(Math.random() * candidates.length)];
            break;
          }
        }
      }
    }

    result.push(picked.ext.tcgl.cardID);
  }

  return result;
};

export const getRandomRareCards = (state: State): string[] => {
  const allCards = Object.values(state.cardsById);
  const rareCards = allCards.filter((c) => {
    return c.rarity.designation === "ILLUSTRATION_RARE" ||
    c.rarity.designation === "SPECIAL_ILLUSTRATION_RARE" ||
    c.rarity.designation === "DOUBLE_RARE" ||
    c.rarity.designation === "ULTRA_RARE" ||
    c.rarity.designation === "HYPER_RARE";
  });
  const shuffled = [...rareCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10).map((c) => c.ext.tcgl.cardID);
};

export const getPackCards = (state: State): string[] => {
  const allCards = Object.values(state.cardsById);
  const result: string[] = [];

  // Helper to pick a random card matching a filter
  const pickRandom = (filterFn: (c: Card) => boolean) => {
    const candidates = allCards.filter(filterFn);
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // 1–4: Commons
  for (let i = 0; i < 4; i++) {
    const card = pickRandom(c => c.rarity.designation === "COMMON" && !("foil" in c));
    result.push(card.ext.tcgl.cardID);
  }

  // 5–7: Uncommons
  for (let i = 0; i < 3; i++) {
    const card = pickRandom(c => c.rarity.designation === "UNCOMMON" && !("foil" in c));
    result.push(card.ext.tcgl.cardID);
  }

  // 8: First reverse holo
  const reverseCandidates = allCards.filter(
    c =>
      (c.rarity.designation === "COMMON" || c.rarity.designation === "UNCOMMON") &&
      c.foil?.type === "FLAT_SILVER"
  );
  const reverseHolo1 =
    reverseCandidates[Math.floor(Math.random() * reverseCandidates.length)];
  result.push(reverseHolo1.ext.tcgl.cardID);

  // 9: Weighted second reverse holo slot
  type SpecialRarity =
    | "ILLUSTRATION_RARE"
    | "SPECIAL_ILLUSTRATION_RARE"
    | "DOUBLE_RARE"
    | "ULTRA_RARE"
    | "HYPER_RARE";

  const specialSlotOdds: Record<SpecialRarity, number> = {
    HYPER_RARE: 0.0196,
    SPECIAL_ILLUSTRATION_RARE: 0.03125,
    ILLUSTRATION_RARE: 0.0833,
    ULTRA_RARE: 0.0625,
    DOUBLE_RARE: 0.125,
  };

  // Calculate total probability to normalize fallback to normal reverse holo
  const totalSpecialProb = Object.values(specialSlotOdds).reduce((a, b) => a + b, 0);
  const normalReverseProb = 1 - totalSpecialProb;

  // Pick weighted rarity
  const rnd = Math.random();
  let cumulative = 0;
  let pickedRarity: SpecialRarity | "NORMAL_REVERSE" = "NORMAL_REVERSE";

  for (const [rarity, prob] of Object.entries(specialSlotOdds) as [SpecialRarity, number][]) {
    cumulative += prob;
    if (rnd < cumulative) {
      pickedRarity = rarity;
      break;
    }
  }

  let reverseHolo2: Card;
  if (pickedRarity === "NORMAL_REVERSE") {
    reverseHolo2 =
      reverseCandidates[Math.floor(Math.random() * reverseCandidates.length)];
  } else {
    const specialCandidates = allCards.filter(c => c.rarity.designation === pickedRarity);
    reverseHolo2 =
      specialCandidates[Math.floor(Math.random() * specialCandidates.length)];
  }
  result.push(reverseHolo2.ext.tcgl.cardID);

  // 10: Guaranteed rare (treated as holo)
  const rareCandidates = allCards.filter(c => c.rarity.designation === "RARE");
  const holo = rareCandidates[Math.floor(Math.random() * rareCandidates.length)];
  result.push(holo.ext.tcgl.cardID);

  return result;
};