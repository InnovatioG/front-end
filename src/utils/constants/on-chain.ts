export const protocolVersion = 1;
export const CampaignVersion = 1;
export const ScriptVersion = 1;

const PROTOCOL_BASE_VERSION = 1;
const CAMPAIGN_BASE_VERSION = 1;
const SCRIPT_BASE_VERSION = 1;

export function mkVersionWithDependency(xs: number[], ownVersion: number): number {
    return xs.reduceRight((acc, x) => acc * 100 + x, ownVersion);
}

export const PROTOCOL_VERSION = mkVersionWithDependency([], PROTOCOL_BASE_VERSION);
export const CAMPAIGN_VERSION = mkVersionWithDependency([PROTOCOL_BASE_VERSION], CAMPAIGN_BASE_VERSION);
export const SCRIPT_VERSION = mkVersionWithDependency([PROTOCOL_BASE_VERSION, CAMPAIGN_BASE_VERSION], SCRIPT_BASE_VERSION);

//----------------------------------------------------------------------

export const TRANSACTION_UNKNOWN = 'Unknown';

export const PROTOCOL_DEPLOY = 'Protocol - Deploy';
// export const PROTOCOL_UPDATE = 'Protocol - Update';
// export const PROTOCOL_UPDATE_MIN_ADA = 'Protocol - Update Min ADA';
// export const PROTOCOL_EMERGENCY = 'Protocol - Emergency';

// export const CAMPAIGN_DEPLOY = 'Fund - Deploy';
// export const CAMPAIGN_UPDATE = 'Fund - Update';
// export const CAMPAIGN_UPDATE_MIN_ADA = 'Fund - Update Min ADA';
// export const CAMPAIGN_ADD_FUNDHOLDING = 'Fund - Add Fund Holding';
// export const CAMPAIGN_DELETE_FUNDHOLDING = 'Fund - Delete Fund Holding';
// export const CAMPAIGN_EMERGENCY = 'Fund - Emergency';
// export const CAMPAIGN_FINISH = 'Fund - Finish';
// export const CAMPAIGN_DELETE = 'Fund - Delete';

// export const CAMPAIGN_FUNDS_DEPOSIT = 'Fund - Deposit';
// export const CAMPAIGN_FUNDS_WITHDRAW = 'Fund - Withdraw';

// export const CAMPAIGN_FUNDS_UPDATE_MIN_ADA = 'Fund Holding - Update Min ADA';
// export const CAMPAIGN_FUNDS_DELETE = 'Fund Holding - Delete';

export const SCRIPTS_ADD = 'Scripts - Add';

// //----------------------------------------------------------------------

// export const CAMPAIGN_STATUS_NOT_DEPLOYED = 'Not Deployed';
// export const CAMPAIGN_STATUS_NOT_STARTED = 'Not Started';
// export const CAMPAIGN_STATUS_NO_FUND_HOLDINGS = 'No Fund Holdings';
// export const CAMPAIGN_STATUS_READY = 'Ready';
// export const CAMPAIGN_STATUS_CLOSED = 'Closed';

//----------------------------------------------------------------------

export const EMERGENCY_ADMIN_TOKEN_POLICY_CS = process.env.NEXT_PUBLIC_EMERGENCY_ADMIN_TOKEN_POLICY_CS!;
export const ADMIN_TOKEN_POLICY_CS = process.env.NEXT_PUBLIC_ADMIN_TOKEN_POLICY_CS!;

export const PROTOCOL_ID_TN = 'ProtocolID';
export const CAMPAIGN_ID_TN = 'CampaignID';
export const CAMPAIGN__FUNDSID_TN_basename = 'CampaignFUndID';

//----------------------------------------------------------------------
