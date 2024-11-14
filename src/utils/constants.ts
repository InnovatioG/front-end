import { CardanoWallet, Category } from "@/types/ConstantTypes";
import {
  DISCORD,
  FACEBOOK,
  INSTAGRAM,
  LOGO_FULL_LIGHT,
  XS,
  WEBSITE,
} from "@/utils/images";
export const CARDANO_WALLETS: CardanoWallet[] = [
  {
    wallet: "eternl",
    name: "Eternl",
    icon: "/img/wallet/eternl.png",
    link: "https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka",
  },
  {
    wallet: "nami",
    name: "Nami",
    icon: "/img/wallet/nami.png",
    link: "https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo",
  },
  {
    wallet: "flint",
    name: "Flint",
    icon: "/img/wallet/flint.png",
    link: "https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj",
  },
  {
    wallet: "yoroi",
    name: "Yoroi",
    icon: "/img/wallet/yoroi.png",
    link: "https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb",
  },
  {
    wallet: "typhon",
    name: "Typhon",
    icon: "/img/wallet/typhon.png",
    link: "https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh",
  },
  {
    wallet: "nufi",
    name: "Nufi",
    icon: "/img/wallet/nufi.png",
    link: "https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca",
  },
];

export const categories: Category[] = [
  "Technology",
  "Event",
  "Education",
  "Gaming",
  "Social",
  "Food",
];

export const socialIcons = [
  { icon: FACEBOOK, name: "facebook" },
  { icon: INSTAGRAM, name: "instagram" },
  { icon: XS, name: "xs" },
  { icon: DISCORD, name: "discord" },
];

export const memberFields = [
  { key: "member_name", placeholder: "Name" },
  { key: "member_last_name", placeholder: "Last name" },
  { key: "member_role", placeholder: "Role" },
];
export const titleForCampaignCreation = (step: number): string => {
  if (step !== 4) {
    return "Let's start with the initial description";
  } else {
    return "Present your team members :)";
  }
};
