import { BaseTxRedeemer, Convertible } from 'smart-db';

// Campaign Redeemers

export type CampaignPolicyRedeemer = PolicyRedeemerMintID | PolicyRedeemerBurnID | PolicyRedeemerMintCampaignToken | PolicyRedeemerBurnCampaignToken;

export class PolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class PolicyRedeemerBurnID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class PolicyRedeemerMintCampaignToken extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}

export class PolicyRedeemerBurnCampaignToken extends BaseTxRedeemer {
    protected static _plutusDataIndex = 3;
    protected static _plutusDataIsSubType = true;
}

export type CampaignValidatorRedeemer =
    | ValidatorRedeemerDatumUpdate
    | ValidatorRedeemerUpdateMinADA
    | ValidatorRedeemerFundsAdd
    | ValidatorRedeemerFundsMerge
    | ValidatorRedeemerFundsDelete
    | ValidatorRedeemerFundsCollect
    | ValidatorRedeemerInitializeCampaign
    | ValidatorRedeemerReachedCampaign
    | ValidatorRedeemerNotReachedCampaign
    | ValidatorRedeemerMilestoneAprobe
    | ValidatorRedeemerMilestoneReprobe
    | ValidatorRedeemerEmergency
    | ValidatorRedeemerDelete;

export class ValidatorRedeemerDatumUpdate extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerUpdateMinADA extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerFundsAdd extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerFundsMerge extends BaseTxRedeemer {
    protected static _plutusDataIndex = 4;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    quantity!: number;
}

export class ValidatorRedeemerFundsDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 3;
    protected static _plutusDataIsSubType = true;
    quantity!: number;
}

export class ValidatorRedeemerFundsCollect extends BaseTxRedeemer {
    protected static _plutusDataIndex = 12;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class ValidatorRedeemerInitializeCampaign extends BaseTxRedeemer {
    protected static _plutusDataIndex = 9;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerReachedCampaign extends BaseTxRedeemer {
    protected static _plutusDataIndex = 10;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerNotReachedCampaign extends BaseTxRedeemer {
    protected static _plutusDataIndex = 11;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerMilestoneAprobe extends BaseTxRedeemer {
    protected static _plutusDataIndex = 5;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    milestoneIndex!: number;
}

export class ValidatorRedeemerMilestoneReprobe extends BaseTxRedeemer {
    protected static _plutusDataIndex = 6;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    milestoneIndex!: number;
}

export class ValidatorRedeemerEmergency extends BaseTxRedeemer {
    protected static _plutusDataIndex = 7;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 8;
    protected static _plutusDataIsSubType = true;
}
