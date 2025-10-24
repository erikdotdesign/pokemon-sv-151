import { State } from "./reducer";

// --- Basic helpers ---

export const getView = (state: State) => state.view;

export const getAvailablePacks = (state: State) => state.packs.available;

export const getCurrentPackIds = (state: State) =>
  state.packs.current.cards;

export const getCollectionIds = (state: State) =>
  state.collection.cards;

export const getRandomCardIds = (state: State, count = 10) => {
  const allCardIds = Object.keys(state.cardsById);
  return allCardIds
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

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
  const { cards, activeIndex } = state.packs.current;
  return cards.length > 0
    ? state.cardsById[cards[activeIndex]]
    : null;
};