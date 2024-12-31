// Campaign Funds Redeemers

import { BaseTxRedeemer, Convertible } from 'smart-db';

export type CampaignPolicyRedeemer = PolicyRedeemerMintID | PolicyRedeemerBurnID;

export class PolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class PolicyRedeemerBurnID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export type CampaignFundsValidatorRedeemer =
    | ValidatorRedeemerUpdateMinADA
    | ValidatorRedeemerDeposit
    | ValidatorRedeemerWithdraw
    | ValidatorRedeemerSell
    | ValidatorRedeemerGetBack
    | ValidatorRedeemerCollect
    | ValidatorRedeemerMerge
    | ValidatorRedeemerDelete
    | ValidatorRedeemerBalanceAssets
    | ValidatorRedeemerEmergency;

export class ValidatorRedeemerUpdateMinADA extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerDeposit extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class ValidatorRedeemerWithdraw extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class ValidatorRedeemerSell extends BaseTxRedeemer {
    protected static _plutusDataIndex = 3;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class ValidatorRedeemerGetBack extends BaseTxRedeemer {
    protected static _plutusDataIndex = 4;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class ValidatorRedeemerCollect extends BaseTxRedeemer {
    protected static _plutusDataIndex = 5;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class ValidatorRedeemerMerge extends BaseTxRedeemer {
    protected static _plutusDataIndex = 6;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerBalanceAssets extends BaseTxRedeemer {
    protected static _plutusDataIndex = 8;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerEmergency extends BaseTxRedeemer {
    protected static _plutusDataIndex = 9;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 7;
    protected static _plutusDataIsSubType = true;
}
