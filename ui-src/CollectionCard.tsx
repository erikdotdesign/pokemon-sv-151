import { Action, State } from "./reducer";
import './CollectionCard.css';

const CollectionCard = ({
  id,
  index,
  state,
  dispatch
}: {
  id: string;
  index: number;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const card = state.cardsById[id];
  const collected = Object.keys(state.collection.cards).includes(id);
  const count = state.collection.cards[id];
  return (
    <button 
      className="c-collection-card"
      onClick={() => dispatch({
        type: "SET_SELECTED_CARD",
        cardId: id
      })}>
      <div className="c-collection-card__index">
        {String(index + 1).padStart(3, '0')}
      </div>
      {
        collected &&
        <img className="c-collection-card__img" src={card.images.thumbnail} />
      }
      {
        collected && count > 1 &&
        <div className="c-collection-card__count">
          { count }
        </div>
      }
    </button>
  );
};

export default CollectionCard;