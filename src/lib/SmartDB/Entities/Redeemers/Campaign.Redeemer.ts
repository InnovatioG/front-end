import { BaseTxRedeemer, Convertible } from 'smart-db';

// Campaign Redeemers

export type CampaignPolicyRedeemer = CampaignPolicyRedeemerMintID | CampaignPolicyRedeemerBurnID | CampaignPolicyRedeemerMintCampaignToken | CampaignPolicyRedeemerBurnCampaignToken;

export class CampaignPolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class CampaignPolicyRedeemerBurnID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class CampaignPolicyRedeemerMintCampaignToken extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}

export class CampaignPolicyRedeemerBurnCampaignToken extends BaseTxRedeemer {
    protected static _plutusDataIndex = 3;
    protected static _plutusDataIsSubType = true;
}

export type CampaignValidatorRedeemer =
    | CampaignValidatorRedeemerDatumUpdate
    | CampaignValidatorRedeemerUpdateMinADA
    | CampaignValidatorRedeemerFundsAdd
    | CampaignValidatorRedeemerFundsMerge
    | CampaignValidatorRedeemerFundsDelete
    | CampaignValidatorRedeemerFundsCollect
    | CampaignValidatorRedeemerInitializeCampaign
    | CampaignValidatorRedeemerReachedCampaign
    | CampaignValidatorRedeemerNotReachedCampaign
    | CampaignValidatorRedeemerMilestoneAprobe
    | CampaignValidatorRedeemerMilestoneReprobe
    | CampaignValidatorRedeemerEmergency
    | CampaignValidatorRedeemerDelete;

export class CampaignValidatorRedeemerDatumUpdate extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerUpdateMinADA extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerFundsAdd extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerFundsMerge extends BaseTxRedeemer {
    protected static _plutusDataIndex = 4;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    quantity!: number;
}

export class CampaignValidatorRedeemerFundsDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 3;
    protected static _plutusDataIsSubType = true;
    quantity!: number;
}

export class CampaignValidatorRedeemerFundsCollect extends BaseTxRedeemer {
    protected static _plutusDataIndex = 12;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    amount!: number;
}

export class CampaignValidatorRedeemerInitializeCampaign extends BaseTxRedeemer {
    protected static _plutusDataIndex = 9;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerReachedCampaign extends BaseTxRedeemer {
    protected static _plutusDataIndex = 10;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerNotReachedCampaign extends BaseTxRedeemer {
    protected static _plutusDataIndex = 11;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerMilestoneAprobe extends BaseTxRedeemer {
    protected static _plutusDataIndex = 5;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    milestoneIndex!: number;
}

export class CampaignValidatorRedeemerMilestoneReprobe extends BaseTxRedeemer {
    protected static _plutusDataIndex = 6;
    protected static _plutusDataIsSubType = true;
    @Convertible({ isForRedeemer: true })
    milestoneIndex!: number;
}

export class CampaignValidatorRedeemerEmergency extends BaseTxRedeemer {
    protected static _plutusDataIndex = 7;
    protected static _plutusDataIsSubType = true;
}

export class CampaignValidatorRedeemerDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 8;
    protected static _plutusDataIsSubType = true;
}
