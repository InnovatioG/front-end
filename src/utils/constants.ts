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

export const initialTextEditorOptions = [
  {
    id: 1,
    title: "What's the product?",
    tooltip:
      "In this section, you should provide a clear and concise description of your product, service, or project. Answer questions like what it is, what it does, If it's a physical product, describe its key features and how it benefits the user. If it's a service, explain what it entails and how it satisfies a need or solves a specific problem.",
  },
  {
    id: 2,
    title: "What's your value?",
    tooltip:
      "In this section, highlight the unique and valuable aspects of your digital product, service, or project. Explore how it stands out from other available options in the market and why it's a superior choice. This may include distinctive features, additional benefits, competitive advantages, or core values that support your proposal.",
  },
  {
    id: 3,
    title: "How it works?",
    tooltip:
      "In this section, explain how your product, service, or project operates in practice. Detail the steps or processes involved, from acquisition to use or implementation. If it's a product, describe how it's used and what benefits it offers to users. If it's a service, explain how it's delivered and how customers can access it. If it's a project, describe how it will be carried out and what stages or milestones it will involve.",
  },
  {
    id: 4,
    title: "Marketing Strategy",
    tooltip:
      "In this section, describe your general strategy to promote and market your digital product, service, or project. Explore the marketing channels you will utilize, such as social media, email marketing, digital advertising, etc. Detail your specific tactics, like content creation, participation in events, collaboration with influencers, etc. It's also helpful to explain how you will measure and evaluate the success of your marketing efforts.",
  },
];

export const inputFieldsToken = (project: any) => [
  {
    id: "cdCampaignToken_TN",
    label: "Token Tick Name",
    type: "text",
    placeholder: "$ADA",
    value: project.cdCampaignToken_TN,
    transform: (value: string) => value,
  },
  {
    id: "cdRequestedMaxADA",
    label: "Quantity",
    type: "number",
    placeholder: "Quantity",
    value: project.cdRequestedMaxADA ?? "",
    transform: (value: string) => (value ? Number(value) : null),
  },
  {
    id: "cdCampaignToken_PriceADA",
    label: "Value per token",
    type: "text",
    placeholder: "$ADA",
    value: project.cdCampaignToken_PriceADA ?? "",
    transform: (value: string) => (value ? Number(value) : null),
  },
];
