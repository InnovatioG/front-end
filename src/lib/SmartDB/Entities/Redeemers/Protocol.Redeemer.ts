import { BaseTxRedeemer } from 'smart-db';

// Protocol Redeemers

export class ProtocolPolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIsSubType = false;
}

export type ProtocolValidatorRedeemer = ProtocolValidatorRedeemerDatumUpdate | ProtocolValidatorRedeemerUpdateMinADA | ProtocolValidatorRedeemerEmergency;

export class ProtocolValidatorRedeemerDatumUpdate extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}

export class ProtocolValidatorRedeemerUpdateMinADA extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class ProtocolValidatorRedeemerEmergency extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}
