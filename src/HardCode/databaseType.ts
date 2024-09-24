export interface User {
  id: number;
  email: string;
  wallet_address: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface State {
  id: number;
  name: string;
}

export interface Contracts {
  id: number;
  name: string;
}

export interface Vizualization {
  id: number;
  name: string;
}

export interface Milestone {
  order: number;
  goal: number;
}

export interface BaseCampaign {
  id: number;
  user_id: number;
  state_id: number;
  category_id: number;
  contract_id: number;
  vizualization: number;
  investors: number;
  title: string;
  description: string;
  milestones: Milestone[];
  raise_amount: number;
  start_date: string;
  end_date: string;
  logo_url: string;
  banner_url: string;
  created_at: string;
  updated_at: string;
}

export interface MilestoneCampaign extends BaseCampaign {
  campaign_type: 'Milestone';
}

export interface TargetCampaign extends BaseCampaign {
  campaign_type: 'Target';
  goal: number;
}

export type Campaign = MilestoneCampaign | TargetCampaign;

export interface DatabaseStructure {
  users: User[];
  categories: Category[];
  states: State[];
  campaigns: Campaign[];
}