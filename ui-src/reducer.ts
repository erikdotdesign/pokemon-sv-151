export type CardFoilType = "SV_ULTRA" | "SUN_PILLAR" | "FLAT_SILVER" | "SV_HOLO";
export type CardFoilMask = "ETCHED" | "HOLO" | "REVERSE";

export type CardRarity = "COMMON" | "UNCOMMON" | "RARE" | "DOUBLE_RARE" | "ULTRA_RARE" | "ILLUSTRATION_RARE" | "SPECIAL_ILLUSTRATION_RARE" | "HYPER_RARE";

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
  types?: string[];
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
    foil?: string;
    etch?: string;
    [key: string]: string | undefined;
  };
}

export type Pack = {
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

export type Collection = {
  cards: string[];
}

export type State = {
  view: View;
  collection: Collection;
  packs: Packs;
  cardsById: Record<string, Card>;
  hydrated: boolean;
};

export type Action = 
  | { type: "HYDRATE_STATE"; state: State }
  | { type: "SET_VIEW"; view: View }
  | { type: "SET_NEW_CURRENT_PACK", cards: string[] }
  | { type: "SET_CURRENT_PACK_CARD_INDEX", cardIndex: number }
  | { type: "OPEN_CURRENT_PACK" }
  

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HYDRATE_STATE": return { ...state, ...action.state, hydrated: true };
    case "SET_VIEW": return { 
      ...state, 
      view: action.view
    };
    case "SET_CURRENT_PACK_CARD_INDEX": return { 
      ...state, 
      packs: {
        ...state.packs,
        current: {
          ...state.packs.current,
          cardIndex: action.cardIndex
        }
      }
    };
    case "SET_NEW_CURRENT_PACK": return { 
      ...state, 
      packs: {
        ...state.packs,
        current: {
          cards: action.cards,
          opened: false,
          cardIndex: 0
        }
      }
    };
    case "OPEN_CURRENT_PACK": {
      if (state.packs.available <= 0) return state;
      return {
        ...state,
        collection: {
          ...state.collection,
          cards: Array.from(new Set([...state.collection.cards, ...state.packs.current.cards])),
        },
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