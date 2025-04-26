import { PaymentKeyHash, ScriptHash, UTxO } from '@lucid-evolution/lucid';

export interface ProtocolCreateParams {
    creator: PaymentKeyHash;
    name: string;
    configJson: string;
    uTxO: UTxO;
}

export interface ProtocolDeployTxParams {
    protocol_id: string;
    pdAdmins: string[];
    pdTokenAdminPolicy_CS: string;
}

export interface ProtocolAddScriptsTxParams {
    protocol_id: string;
}

export interface CampaignAddScriptsTxParams {
    protocol_id: string;
    campaign_id: string;
}


export interface AddScriptTxParams {
    script_Hash: ScriptHash;
}


export interface CampaignDeployTxParams {
    protocol_id: string;
    campaign_id: string;
    cdTokenAdminPolicy_CS: string;
}

export interface CampaignFundsAddTxParams {
    protocol_id: string;
    campaign_id: string;
}

export interface CampaignFundsMintDepositTxParams {
    protocol_id: string;
    campaign_id: string;
    campaign_funds_id: string;
}

export interface CampaignFundsInvestTxParams {
    protocol_id: string;
    campaign_id: string;
    campaign_funds_id: string;
    amount: string;
}

export interface CampaignFundsCollectTxParams {
    protocol_id: string;
    campaign_id: string;
    campaign_funds_id: string;
}

export interface CampaignLaunchTxParams {
    protocol_id: string;
    campaign_id: string;
}

export interface CampaignMilestoneAprobeTxParams {
    protocol_id: string;
    campaign_id: string;
}

export interface CampaignCampaingReachedTxParams {
    protocol_id: string;
    campaign_id: string;
}
export interface CampaignCampaingNotReachedTxParams {
    protocol_id: string;
    campaign_id: string;
}

