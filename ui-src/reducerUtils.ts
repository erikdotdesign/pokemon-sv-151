import { Collection, State } from "./reducer";

export const addCardsToCollection = (collection: Collection, cards: string[]): Collection => {
  const updated = { ...collection.cards };
  for (const id of cards) {
    updated[id] = (updated[id] || 0) + 1;
  }
  return { cards: updated };
};

export const mergeState = (oldState: State, newState?: Partial<State>): State => {
  if (!newState) return oldState;
  
  return {
    ...oldState,
    collection: {
      ...oldState.collection,
      ...(newState.collection ?? {}),
    },
    packs: {
      ...oldState.packs,
      ...(newState.packs ?? {}),
    },
    view: newState.view ?? oldState.view,
    cardsById: {
      ...oldState.cardsById,
      ...(newState.cardsById ?? {}),
    }
  };
};