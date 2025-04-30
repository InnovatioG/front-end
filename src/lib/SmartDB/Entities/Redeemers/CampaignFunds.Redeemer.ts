// Campaign Funds Redeemers

import { BaseTxRedeemer, Convertible } from 'smart-db';

export type CampaignFundsPolicyRedeemer = CampaignFundsPolicyRedeemerMintID | CampaignFundsPolicyRedeemerBurnID;

export class CampaignFundsPolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class CampaignFundsPolicyRedeemerBurnID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export type CampaignFundsValidatorRedeemer =
    | CampaignFundsValidatorRedeemerUpdateMinADA
    | CampaignFundsValidatorRedeemerDeposit
    | CampaignFundsValidatorRedeemerWithdraw
    | CampaignFundsValidatorRedeemerSell
    | CampaignFundsValidatorRedeemerGetBack
    | CampaignFundsValidatorRedeemerCollect
    | CampaignFundsValidatorRedeemerMerge
    | CampaignFundsValidatorRedeemerDelete
    | CampaignFundsValidatorRedeemerBalanceAssets
    | CampaignFundsValidatorRedeemerEmergency;

export class CampaignFundsValidatorRedeemerUpdateMinADA extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class CampaignFundsValidatorRedeemerDeposit extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class CampaignFundsValidatorRedeemerWithdraw extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class CampaignFundsValidatorRedeemerSell extends BaseTxRedeemer {
    protected static _plutusDataIndex = 3;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class CampaignFundsValidatorRedeemerGetBack extends BaseTxRedeemer {
    protected static _plutusDataIndex = 4;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class CampaignFundsValidatorRedeemerCollect extends BaseTxRedeemer {
    protected static _plutusDataIndex = 5;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class CampaignFundsValidatorRedeemerMerge extends BaseTxRedeemer {
    protected static _plutusDataIndex = 6;
    protected static _plutusDataIsSubType = true;
}

export class CampaignFundsValidatorRedeemerBalanceAssets extends BaseTxRedeemer {
    protected static _plutusDataIndex = 8;
    protected static _plutusDataIsSubType = true;
}

export class CampaignFundsValidatorRedeemerEmergency extends BaseTxRedeemer {
    protected static _plutusDataIndex = 9;
    protected static _plutusDataIsSubType = true;
}

export class CampaignFundsValidatorRedeemerDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 7;
    protected static _plutusDataIsSubType = true;
}
