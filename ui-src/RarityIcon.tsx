import { CardRarity } from "./reducer";
import Common from "./svgs/rarities/common.svg?react";
import Uncommon from "./svgs/rarities/uncommon.svg?react";
import Rare from "./svgs/rarities/rare.svg?react";
import DoubleRare from "./svgs/rarities/double-rare.svg?react";
import UltraRare from "./svgs/rarities/ultra-rare.svg?react";
import IllustrationRare from "./svgs/rarities/illustration-rare.svg?react";
import SpecialIllustrationRare from "./svgs/rarities/special-illustration-rare.svg?react";
import HyperRare from "./svgs/rarities/hyper-rare.svg?react";

const RarityIcon = ({
  rarity 
}: {
  rarity: CardRarity;
}) => {
  switch(rarity) {
    case "COMMON":
      return <Common />;
    case "UNCOMMON":
      return <Uncommon />;
    case "RARE":
      return <Rare />;
    case "DOUBLE_RARE":
      return <DoubleRare />;
    case "ULTRA_RARE":
      return <UltraRare />;
    case "ILLUSTRATION_RARE":
      return <IllustrationRare />;
    case "SPECIAL_ILLUSTRATION_RARE":
      return <SpecialIllustrationRare />;
    case "HYPER_RARE":
      return <HyperRare />;
    default:
      return null;
  }
};

export default RarityIcon;