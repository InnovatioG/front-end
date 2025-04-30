import { BaseTxRedeemer, Convertible } from 'smart-db';

export type ScriptPolicyRedeemer = ScriptPolicyRedeemerMintID | ScriptPolicyRedeemerBurnID;

export class ScriptPolicyRedeemerMintID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 1;
    protected static _plutusDataIsSubType = true;
}

export class ScriptPolicyRedeemerBurnID extends BaseTxRedeemer {
    protected static _plutusDataIndex = 2;
    protected static _plutusDataIsSubType = true;
}

export type ScriptValidatorRedeemer = ScriptValidatorRedeemerScriptDelete;

export class ScriptValidatorRedeemerScriptDelete extends BaseTxRedeemer {
    protected static _plutusDataIndex = 0;
    protected static _plutusDataIsSubType = true;
}
