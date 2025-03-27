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
