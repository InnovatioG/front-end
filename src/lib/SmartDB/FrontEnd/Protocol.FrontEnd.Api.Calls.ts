import { BaseSmartDBFrontEndTxApiCalls, getScriptFromJson, isNullOrBlank, IUseWalletStore, LucidLUCID_NETWORK_MAINNET_NAME, LucidLUCID_NETWORK_PREVIEW_NAME, pushSucessNotification, pushWarningNotification } from 'smart-db';
import { CampaignFactory, ProtocolEntity } from '../Entities/Protocol.Entity';
import { ProtocolCreateParams } from '../Commons/Params';
import { applyParamsToScript, Data, MintingPolicy, Validator } from 'lucid-cardano';
import { EMERGENCY_ADMIN_TOKEN_POLICY_CS } from '../Commons/Constants';
import { ScriptEntity } from '../Entities/Script.Entity';

export class ProtocolApi extends BaseSmartDBFrontEndTxApiCalls {
    protected static _Entity = ProtocolEntity;

    // #region front end methods

    public static async handleBtnCreate(walletStore: IUseWalletStore, params: ProtocolCreateParams): Promise<string | undefined> {
        try {
            //--------------------------------------
            if (isNullOrBlank(params.name)) {
                throw `Name is required`;
            }
            if (isNullOrBlank(params.configJson)) {
                throw `Config Json is required`;
            }
            //--------------------------------------
            let protocolFactory;
            try {
                const configJsonObject = JSON.parse(params.configJson);
                //--------------------------------------
                protocolFactory = {
                    ...configJsonObject,
                    fdpProtocolPolicyID_Pre_CborHex: getScriptFromJson(configJsonObject.fdpProtocolPolicyID_Pre_CborHex),
                    fdpProtocolValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpProtocolValidator_Pre_CborHex),
                    fdpScriptPolicyID_Pre_CborHex: getScriptFromJson(configJsonObject.fdpScriptPolicyID_Pre_CborHex),
                    fdpScriptValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpScriptValidator_Pre_CborHex),
                    fdpCampaignPolicy_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignPolicy_Pre_CborHex),
                    fdpCampaignValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignValidator_Pre_CborHex),
                    fdpCampaignFundsPolicyID_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignFundsPolicyID_Pre_CborHex),
                    fdpCampaignFundsValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignFundsValidator_Pre_CborHex),
                };
            } catch (error) {
                throw 'Invalid config json file ' + error;
            }
            //--------------------------------------
            const lucid = await walletStore.getLucid();
            if (lucid === undefined) {
                throw 'Please connect your wallet';
            }
            if (walletStore.isWalletDataLoaded !== true) {
                throw 'Wallet Data is not ready';
            }
            if (walletStore.getUTxOsAtWallet().length === 0) {
                throw 'You need at least one utxo to be used to mint Fund ID';
            }
            //--------------------------------------
            const walletUTxOs = walletStore.getUTxOsAtWallet();
            if (walletUTxOs.length === 0) {
                throw 'You need at least one utxo to be used to mint Fund ID';
            }
            const uTxO = walletUTxOs[0];
            console.log(`uTxO for creating Protocol ID: ${uTxO}`);
            //--------------------------------------
            const protocol_TxHash = uTxO.txHash;
            const protocol_TxOutputIndex = uTxO.outputIndex;
            //--------------------------------------
            // Protocol Policy
            const ParamsSchemaProtocolPolicyID = Data.Tuple([Data.Bytes(), Data.Integer()]);
            type ParamsProtocolPolicy = Data.Static<typeof ParamsSchemaProtocolPolicyID>;
            //--------------------------------------
            const fdpProtocolPolicyID_Params = {
                protocol_TxHash,
                protocol_TxOutputIndex: BigInt(protocol_TxOutputIndex),
            };
            //--------------------------------------
            const fdpProtocolPolicyID_Script: MintingPolicy = {
                type: 'PlutusV2',
                script: applyParamsToScript<ParamsProtocolPolicy>(
                    protocolFactory.fdpProtocolPolicyID_Pre_CborHex.script,
                    [fdpProtocolPolicyID_Params.protocol_TxHash, fdpProtocolPolicyID_Params.protocol_TxOutputIndex],
                    ParamsSchemaProtocolPolicyID as unknown as ParamsProtocolPolicy
                ),
            };
            //--------------------------------------
            const fdpProtocolPolicyID_CS = lucid.utils.mintingPolicyToId(fdpProtocolPolicyID_Script);
            console.log(`fdpProtocolPolicyID_CS ${fdpProtocolPolicyID_CS}`);
            //--------------------------------------
            // Protocol Validator
            const ParamsSchemaProtocolValidator = Data.Tuple([Data.Bytes(), Data.Bytes()]);
            type ParamsProtocolValidator = Data.Static<typeof ParamsSchemaProtocolValidator>;
            //--------------------------------------
            const fdpProtocolValidator_Params = {
                protocolPolicyID_CS: fdpProtocolPolicyID_CS,
                tokenEmergencyAdminPolicy_CS: EMERGENCY_ADMIN_TOKEN_POLICY_CS,
            };
            //--------------------------------------
            const fdpProtocolValidator_Script: Validator = {
                type: 'PlutusV2',
                script: applyParamsToScript<ParamsProtocolValidator>(
                    protocolFactory.fdpProtocolValidator_Pre_CborHex.script,
                    [fdpProtocolValidator_Params.protocolPolicyID_CS, fdpProtocolValidator_Params.tokenEmergencyAdminPolicy_CS],
                    ParamsSchemaProtocolValidator as unknown as ParamsProtocolValidator
                ),
            };
            //--------------------------------------
            const fdpProtocolValidator_Hash = lucid.utils.validatorToScriptHash(fdpProtocolValidator_Script);
            console.log(`fdpProtocolValidator_Hash ${fdpProtocolValidator_Hash}`);
            //--------------------------------------
            lucid.network = 'Preview';
            const fdpProtocolValidator_AddressTestnet = lucid.utils.validatorToAddress(fdpProtocolValidator_Script);
            console.log(`fdpProtocolValidator_AddressTestnet ${fdpProtocolValidator_AddressTestnet}`);
            lucid.network = 'Mainnet';
            const fdpProtocolValidator_AddressMainnet = lucid.utils.validatorToAddress(fdpProtocolValidator_Script);
            console.log(`fdpProtocolValidator_AddressMainnet ${fdpProtocolValidator_AddressMainnet}`);
            //--------------------------------------
            // Script Policy
            const ParamsSchemaScriptPolicyID = Data.Tuple([Data.Bytes()]);
            type ParamsScriptPolicy = Data.Static<typeof ParamsSchemaScriptPolicyID>;
            //--------------------------------------
            const fdpScriptPolicyID_Params = {
                protocolPolicyID_CS: fdpProtocolPolicyID_CS,
            };
            //--------------------------------------
            const fdpScriptPolicyID_Script: MintingPolicy = {
                type: 'PlutusV2',
                script: applyParamsToScript<ParamsScriptPolicy>(
                    protocolFactory.fdpScriptPolicyID_Pre_CborHex.script,
                    [fdpScriptPolicyID_Params.protocolPolicyID_CS],
                    ParamsSchemaScriptPolicyID as unknown as ParamsScriptPolicy
                ),
            };
            //--------------------------------------
            const fdpScriptPolicyID_CS = lucid.utils.mintingPolicyToId(fdpScriptPolicyID_Script);
            console.log(`fdpScriptPolicyID_CS ${fdpScriptPolicyID_CS}`);
            //--------------------------------------
            // Script Validator
            const ParamsSchemaScriptValidator = Data.Tuple([Data.Bytes(), Data.Bytes()]);
            type ParamsScriptValidator = Data.Static<typeof ParamsSchemaScriptValidator>;
            //--------------------------------------
            const fdpScriptValidator_Params = {
                protocolPolicyID_CS: fdpProtocolPolicyID_CS,
                scriptPolicyID_CS: fdpScriptPolicyID_CS,
            };
            //--------------------------------------
            const fdpScriptValidator_Script: Validator = {
                type: 'PlutusV2',
                script: applyParamsToScript<ParamsScriptValidator>(
                    protocolFactory.fdpScriptValidator_Pre_CborHex.script,
                    [fdpScriptValidator_Params.protocolPolicyID_CS, fdpScriptValidator_Params.scriptPolicyID_CS],
                    ParamsSchemaScriptValidator as unknown as ParamsScriptValidator
                ),
            };
            //--------------------------------------
            const fdpScriptValidator_Hash = lucid.utils.validatorToScriptHash(fdpScriptValidator_Script);
            console.log(`fdpScriptValidator_Hash ${fdpScriptValidator_Hash}`);
            //--------------------------------------
            lucid.network = 'Preview';
            const fdpScriptValidator_AddressTestnet = lucid.utils.validatorToAddress(fdpScriptValidator_Script);
            console.log(`fdpScriptValidator_AddressTestnet ${fdpScriptValidator_AddressTestnet}`);
            lucid.network = 'Mainnet';
            const fdpScriptValidator_AddressMainnet = lucid.utils.validatorToAddress(fdpScriptValidator_Script);
            console.log(`fdpScriptValidator_AddressMainnet ${fdpScriptValidator_AddressMainnet}`);
            //--------------------------------------
            const campaignFactory: CampaignFactory = {
                name: params.name,
                fdpCampaignVersion: protocolFactory.fdpCampaignVersion,
                fdpCampaignPolicy_Pre_CborHex: protocolFactory.fdpCampaignPolicy_Pre_CborHex,
                fdpCampaignValidator_Pre_CborHex: protocolFactory.fdpCampaignValidator_Pre_CborHex,
                fdpCampaignFundsPolicyID_Pre_CborHex: protocolFactory.fdpCampaignFundsPolicyID_Pre_CborHex,
                fdpCampaignFundsValidator_Pre_CborHex: protocolFactory.fdpCampaignFundsValidator_Pre_CborHex,
            };
            const protocol: ProtocolEntity = new ProtocolEntity({
                name: params.name,
                fdpProtocolVersion: protocolFactory.fdpProtocolVersion,
                fdpScriptVersion: protocolFactory.fdpScriptVersion,
                fdpProtocolPolicyID_CS,
                fdpProtocolPolicyID_Script,
                fdpProtocolPolicyID_Params,
                fdpProtocolValidator_AddressMainnet,
                fdpProtocolValidator_AddressTestnet,
                fdpProtocolValidator_Script,
                fdpProtocolValidator_Hash,
                fdpProtocolValidator_Params,
                fdpScriptPolicyID_CS,
                fdpScriptPolicyID_Script,
                fdpScriptPolicyID_Params,
                fdpScriptValidator_AddressMainnet,
                fdpScriptValidator_AddressTestnet,
                fdpScriptValidator_Script,
                fdpScriptValidator_Hash,
                fdpScriptValidator_Params,
                fdpCampaignFactories: [campaignFactory],
                _NET_address: 'use getNet_Address()',
                _NET_id_CS: 'use getNET_id_CS()',
                _isDeployed: false,
            });
            //--------------------------------------
            const protocol_ = await ProtocolApi.createApi(protocol);
            //--------------------------------------
            await ProtocolApi.createHookApi(ProtocolEntity, protocol.getNet_Address(), protocol_.fdpProtocolPolicyID_CS);
            await ProtocolApi.createHookApi(ScriptEntity, protocol.getNet_Script_Validator_Address(), protocol_.fdpScriptPolicyID_CS);
            //--------------------------------------
            pushSucessNotification(`${this._Entity.className()}`, `${this._Entity.className()} created: ${protocol_.show()}`, false);
            return protocol_._DB_id;
        } catch (error) {
            console.log(`[${this._Entity.className()}] - handleBtnCreate - Error: ${error}`);
            pushWarningNotification(`${this._Entity.className()}`, `Error creasting ${this._Entity.className()}: ${error}`);
            return undefined;
        }
    }

    // #endregion front end handlers

    // #region api

    public static async populateApi(): Promise<boolean> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/populate`, {
                method: 'POST',
            });
            if (response.status === 200) {
                const data = await response.json();
                console.log(`[${this._Entity.className()}] - populateApi - response OK`);
                return data.result;
            } else {
                const errorData = await response.json();
                //throw `Received status code ${response.status} with message: ${errorData.error.message ? errorData.error.message : errorData.error}`;
                throw `${errorData.error.message ? errorData.error.message : errorData.error}`;
            }
        } catch (error) {
            console.log(`[${this._Entity.className()}] - populateApi - Error: ${error}`);
            throw `${error}`;
        }
    }

    // #endregion api
}
