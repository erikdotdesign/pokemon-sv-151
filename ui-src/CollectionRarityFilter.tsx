import { Action, CardRarity, State } from "./reducer";
import { capitalize } from "./helpers";
import RarityIcon from "./RarityIcon";

const CollectionRarityFilter = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const { filters } = state.overlay;
  const handleRarityChip = (rarity: CardRarity) => {
    let newFilters = [...filters.rarities];
    if (newFilters.includes("ALL")) newFilters = [];
    if (filters.rarities.includes(rarity)) {
      newFilters = [...filters.rarities].filter(r => r !== rarity);
    } else {
      newFilters = [...newFilters, rarity];
    }
    if (newFilters.length === 0) newFilters = ["ALL"];
    dispatch({
      type: "SET_COLLECTION_FILTER",
      filters: {
        ...filters,
        rarities: newFilters
      }
    });
  };
  return (
    <div className="c-collection-sidebar__section">
      <h5>
        Rarities
      </h5>
      <div className="c-collection-sidebar__chip-group">
        {
          (["COMMON", "UNCOMMON", "RARE", "DOUBLE_RARE", "ULTRA_RARE", "ILLUSTRATION_RARE", "SPECIAL_ILLUSTRATION_RARE", "HYPER_RARE"] as CardRarity[]).map((r, i) => (
            <button
              className={`c-collection-sidebar__chip ${filters.rarities.includes(r) ? `c-collection-sidebar__chip--active` : ''}`} 
              id={r}
              onClick={() => handleRarityChip(r)}>
              <RarityIcon rarity={r} />
              <span>{capitalize(r.split("_").join(" "))}</span>
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default CollectionRarityFilter;