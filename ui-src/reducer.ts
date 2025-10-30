import { addCardsToCollection, mergeState } from "./reducerUtils";

export type CardFoilType = "SV_ULTRA" | "SUN_PILLAR" | "FLAT_SILVER" | "SV_HOLO";
export type CardFoilMask = "ETCHED" | "HOLO" | "REVERSE";

export type CardRarity = "COMMON" | "UNCOMMON" | "RARE" | "DOUBLE_RARE" | "ULTRA_RARE" | "ILLUSTRATION_RARE" | "SPECIAL_ILLUSTRATION_RARE" | "HYPER_RARE";

export type PokemonTypes = "COLORLESS" | "DARKNESS" | "DRAGON" | "FAIRY" | "FIGHTING" | "FIRE" | "GRASS" | "LIGHTNING" | "METAL" | "PSYCHIC" | "WATER";

export type CardText =
  | {
      kind: "ATTACK";
      name: string;
      text: string;
      cost: string[];
      damage?: {
        amount: number;
        suffix?: string;
      };
    }
  | {
      kind: "RULE_BOX" | "ABILITY" | "POKEMON_POWER" | string;
      name: string;
      text: string;
    };

export type Card = {
  name: string;
  card_type: string;
  lang: string;
  foil?: {
    type: CardFoilType;
    mask: CardFoilMask;
  },
  size: string;
  back: string;
  artists: {
    text: string;
    list: string[];
  };
  regulation_mark?: string;
  set_icon?: string;
  collector_number: {
    full: string;
    numerator: string;
    denominator: string;
    numeric: number;
  };
  rarity: {
    designation: CardRarity;
    icon?: string;
  };
  copyright: {
    text: string;
    year: number;
  };
  tags?: string[];
  stage?: string;
  stage_text?: string;
  hp?: number;
  types?: PokemonTypes[];
  weakness?: {
    types: string[];
    operator?: string;
    amount?: number;
  };
  retreat?: number;
  text?: CardText[];
  ext: {
    tcgl: {
      cardID: string;
      longFormID?: string;
      archetypeID?: string;
      reldate?: string;
      key?: string;
    };
    [key: string]: any;
  };
  images: {
    front: string;
    thumbnail: string;
    foil?: string;
    etch?: string;
    [key: string]: string | undefined;
  };
}

export type Pack = {
  id: string;
  cards: string[];
  opened: boolean;
  cardIndex: number;
}

export type Packs = {
  current: Pack;
  available: number;
  lastOpened: number | null;
}

export type View = "collection" | "packs";

export type Overlay = {
  collectionVisible: boolean;
  selectedCardId?: string | null;
  filters: {
    query?: string;
    rarity?: CardRarity | "ALL";
    type?: PokemonTypes | "ALL";
    sort?: "name" | "rarity" | "type" | "index";
  };
}

export type Collection = {
  cards: Record<string, number>;
}

export type State = {
  overlay: Overlay;
  collection: Collection;
  packs: Packs;
  cardsById: Record<string, Card>;
  hydrated: boolean;
};

export type Action = 
  | { type: "HYDRATE_STATE"; state: State | Partial<State> }
  | { type: "TOGGLE_COLLECTION_OVERLAY"; visible?: boolean }
  | { type: "SET_SELECTED_CARD"; cardId: string | null }
  | { type: "SET_COLLECTION_FILTER"; filters: Partial<Overlay["filters"]> }
  | { type: "CLEAR_COLLECTION_FILTERS" }
  | { type: "SET_NEW_CURRENT_PACK", cards: string[] }
  | { type: "SET_CURRENT_PACK_CARD_INDEX", cardIndex: number }
  | { type: "OPEN_CURRENT_PACK" }
  

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HYDRATE_STATE":
      return mergeState(state, action.state);
    case "TOGGLE_COLLECTION_OVERLAY": {
      const visible = typeof action.visible === "boolean"
        ? action.visible
        : !state.overlay.collectionVisible;
      return {
        ...state,
        overlay: {
          ...state.overlay,
          collectionVisible: visible,
          selectedCardId: !visible ? null : state.overlay.selectedCardId
        },
      };
    }
    case "SET_SELECTED_CARD": {
      return {
        ...state,
        overlay: {
          ...state.overlay,
          selectedCardId: action.cardId,
        },
      };
    }
    case "SET_COLLECTION_FILTER": {
      return {
        ...state,
        overlay: {
          ...state.overlay,
          filters: {
            ...state.overlay.filters,
            ...action.filters,
          },
        },
      };
    }
    case "CLEAR_COLLECTION_FILTERS": {
      return {
        ...state,
        overlay: {
          ...state.overlay,
          filters: {
            query: "",
            rarity: "ALL",
            type: "ALL",
            sort: "index",
          },
        },
      };
    }
    case "SET_CURRENT_PACK_CARD_INDEX": {
      return { 
        ...state, 
        packs: {
          ...state.packs,
          current: {
            ...state.packs.current,
            cardIndex: action.cardIndex
          }
        }
      };
    }
    case "SET_NEW_CURRENT_PACK": {
      return { 
        ...state, 
        packs: {
          ...state.packs,
          current: {
            id: `pack_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`,
            cards: action.cards,
            opened: false,
            cardIndex: 0
          }
        }
      };
    }
    case "OPEN_CURRENT_PACK": {
      if (state.packs.available <= 0) return state;
      const newCollection = addCardsToCollection(state.collection, state.packs.current.cards);
      return {
        ...state,
        collection: newCollection,
        packs: {
          ...state.packs,
          current: {
            ...state.packs.current,
            opened: true
          },
          lastOpened: Date.now(),
          available: state.packs.available - 1,
        },
      };
    }
    default: return state;
  }
};

export default reducer;