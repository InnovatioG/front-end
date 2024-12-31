import { BaseTxRedeemer } from 'smart-db';

// Protocol Redeemers

export class ProtocolPolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIsSubType = false;
}

export type ProtocolValidatorRedeemer = ValidatorRedeemerDatumUpdate | ValidatorRedeemerUpdateMinADA | ValidatorRedeemerEmergency;

export class ValidatorRedeemerDatumUpdate extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerUpdateMinADA extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class ValidatorRedeemerEmergency extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}
