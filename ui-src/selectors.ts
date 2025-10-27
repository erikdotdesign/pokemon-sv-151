import { State, CardRarity, Card } from "./reducer";

// --- Basic helpers ---

export const getView = (state: State) => state.view;

export const getAvailablePacks = (state: State) => state.packs.available;

export const getCurrentPackIds = (state: State) =>
  state.packs.current.cards;

export const getCollectionIds = (state: State) =>
  Object.keys(state.collection.cards);

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

export const getGodPack = (state: State): string[] => {
  const allCards = Object.values(state.cardsById);
  const result: string[] = [];

  // Pick a random card from a given filter
  const pickRandom = (filterFn: (c: Card) => boolean): Card => {
    const candidates = allCards.filter(filterFn);
    if (!candidates.length) throw new Error("No candidates found for pickRandom filter");
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // Number of cards in a standard pack
  const PACK_SIZE = 10;

  for (let i = 0; i < PACK_SIZE; i++) {
    const specialCard = pickRandom(c =>
      ["ILLUSTRATION_RARE", "SPECIAL_ILLUSTRATION_RARE", "DOUBLE_RARE", "ULTRA_RARE", "HYPER_RARE"].includes(
        c.rarity?.designation || ""
      )
    );
    result.push(specialCard.ext.tcgl.cardID);
  }

  return result;
};

export const getPackCards = (state: State): string[] => {
  const allCards = Object.values(state.cardsById);
  const result: string[] = [];

  const pickRandom = (filterFn: (c: Card) => boolean): Card => {
    const candidates = allCards.filter(filterFn);
    if (!candidates.length) throw new Error("No candidates found for pickRandom filter");
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // 1–4: Commons (non-foil)
  for (let i = 0; i < 4; i++) {
    result.push(pickRandom(c => c.rarity?.designation === "COMMON" && !c.foil).ext.tcgl.cardID);
  }

  // 5–7: Uncommons (non-foil)
  for (let i = 0; i < 3; i++) {
    result.push(pickRandom(c => c.rarity?.designation === "UNCOMMON" && !c.foil).ext.tcgl.cardID);
  }

  // 8: First reverse holo (common/uncommon, FLAT_SILVER)
  const reverseCandidates = allCards.filter(
    c => (c.rarity?.designation === "COMMON" || c.rarity?.designation === "UNCOMMON") &&
         c.foil?.type === "FLAT_SILVER"
  );
  if (!reverseCandidates.length) throw new Error("No reverse holo candidates available");
  result.push(reverseCandidates[Math.floor(Math.random() * reverseCandidates.length)].ext.tcgl.cardID);

  // Weighted pick helper using card counts
  type SpecialRarity =
    | "ILLUSTRATION_RARE"
    | "SPECIAL_ILLUSTRATION_RARE"
    | "DOUBLE_RARE"
    | "ULTRA_RARE"
    | "HYPER_RARE";

  // Weighted pick helper that supports a weighted fallback
  const pickWeightedCard = (
    allCards: Card[],
    odds: Record<SpecialRarity, number>,
    fallbackFilter: (c: Card) => boolean,
    fallbackWeight: number
  ): Card => {
    const weightedPool: { card: Card; weight: number }[] = [];

    // Add all special rarities
    for (const [rarity, prob] of Object.entries(odds) as [SpecialRarity, number][]) {
      const candidates = allCards.filter(c => c.rarity?.designation === rarity);
      for (const c of candidates) {
        weightedPool.push({ card: c, weight: prob });
      }
    }

    // Add fallback cards (e.g., NORMAL_REVERSE or RARE) with its weight
    const fallbackCards = allCards.filter(fallbackFilter);
    for (const c of fallbackCards) {
      weightedPool.push({ card: c, weight: fallbackWeight });
    }

    if (!weightedPool.length) {
      throw new Error("No candidates found for weighted pick");
    }

    // Weighted pick
    const totalWeight = weightedPool.reduce((sum, w) => sum + w.weight, 0);
    let rnd = Math.random() * totalWeight;

    for (const entry of weightedPool) {
      if (rnd < entry.weight) return entry.card;
      rnd -= entry.weight;
    }

    // Fallback safety
    return fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
  };

  const specialSlotOdds: Record<SpecialRarity, number> = {
    HYPER_RARE: 0.0196,
    SPECIAL_ILLUSTRATION_RARE: 0.03125,
    ILLUSTRATION_RARE: 0.0833,
    ULTRA_RARE: 0.0625,
    DOUBLE_RARE: 0.125,
  };

  // Slot 9: second reverse holo
  const reverseHolo2 = pickWeightedCard(
    allCards,
    specialSlotOdds, // HYPER_RARE, ULTRA_RARE, etc.
    c => (c.rarity?.designation === "COMMON" || c.rarity?.designation === "UNCOMMON") &&
        c.foil?.type === "FLAT_SILVER", // fallback pool
    0.69 // weight bias toward reverse holo
  );
  result.push(reverseHolo2.ext.tcgl.cardID);

  // Slot 10: guaranteed rare holo
  const rareHolo = pickWeightedCard(
    allCards,
    specialSlotOdds,
    c => c.rarity?.designation === "RARE", // fallback pool
    0.69 // weight bias toward normal rare
  );
  result.push(rareHolo.ext.tcgl.cardID);

  return result;
};