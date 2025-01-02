import { BaseSmartDBFrontEndTxApiCalls, getScriptFromJson, IUseWalletStore, LucidLUCID_NETWORK_MAINNET_NAME, LucidLUCID_NETWORK_PREVIEW_NAME, pushSucessNotification, pushWarningNotification } from 'smart-db';
import { ScriptEntity } from '../Entities/Script.Entity';
import { applyParamsToScript, Data, MintingPolicy, Validator } from 'lucid-cardano';
import { EMERGENCY_ADMIN_TOKEN_POLICY_CS } from '../Commons/Constants';

export class ScriptApi extends BaseSmartDBFrontEndTxApiCalls {
    protected static _Entity = ScriptEntity;

    // #region front end Btn handlers


    // #endregion front end Btn handlers

    // #region api


    // #endregion api
}
