import {
    BaseSmartDBFrontEndTxApiCalls,
    isNullOrBlank,
    IUseWalletStore,
    LucidToolsFrontEnd,
    pushSucessNotification,
    pushWarningNotification,
    toJson,
    WalletTxParams,
} from 'smart-db';
import { ProtocolCreateParams } from '../Commons/Params';
import { ProtocolEntity } from '../Entities/Protocol.Entity';
import { ScriptEntity } from '../Entities/Script.Entity';

export class ProtocolApi extends BaseSmartDBFrontEndTxApiCalls {
    protected static _Entity = ProtocolEntity;
    // #region front end methods

    public static async handleBtnCreate(walletStore: IUseWalletStore, name: string, configJson: string): Promise<string | undefined> {
        try {
            //--------------------------------------
            if (isNullOrBlank(name)) {
                throw `Name is required`;
            }
            if (isNullOrBlank(configJson)) {
                throw `Config Json is required`;
            }
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            if (lucid === undefined) {
                throw 'Please connect your wallet';
            }
            if (walletStore.isWalletDataLoaded !== true) {
                throw 'Wallet Data is not ready';
            }
            const uTxOsAtWalleet = walletStore.getUTxOsAtWallet();
            if (uTxOsAtWalleet.length === 0) {
                throw 'You need at least one utxo to be used to mint Fund ID';
            }
            //--------------------------------------
            const protocol_id = await ProtocolApi.createWithScriptsApi(walletTxParams, { name, configJson, uTxO: uTxOsAtWalleet[0], creator: walletStore.info!.pkh});
            const protocol: ProtocolEntity | undefined = await ProtocolApi.getByIdApi_(protocol_id);
            if (protocol === undefined) {
                throw `Protocol not found with id: ${protocol_id}`;
            }
            //--------------------------------------
            await ProtocolApi.createHookApi(ProtocolEntity, protocol.getNet_Address(), protocol.fdpProtocolPolicyID_CS);
            await ProtocolApi.createHookApi(ScriptEntity, protocol.getNet_Script_Validator_Address(), protocol.fdpScriptPolicyID_CS);
            //--------------------------------------
            pushSucessNotification(`${this._Entity.className()}`, `${this._Entity.className()} created: ${protocol.show()}`, false);
            return protocol._DB_id;
        } catch (error) {
            console.log(`[${this._Entity.className()}] - handleBtnCreate - Error: ${error}`);
            pushWarningNotification(`${this._Entity.className()}`, `Error creasting ${this._Entity.className()}: ${error}`);
            return undefined;
        }
    }

    // #endregion front end handlers

    // #region api

    public static async populateApi(walletTxParams: WalletTxParams): Promise<boolean> {
        try {
            const body = toJson({ walletTxParams });
            const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/populate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
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

    public static async createWithScriptsApi(walletTxParams: WalletTxParams, params: ProtocolCreateParams): Promise<string> {
        try {
            if (params === undefined) {
                throw `ProtocolCreateParams not defined`;
            }
            const body = toJson({ walletTxParams, params });
            const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/tx/createWithScriptsApi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (response.status === 200) {
                const data = await response.json();
                console.log(`[${this._Entity.className()}] - createWithScriptsApi - response OK`);
                return data.id;
            } else {
                const errorData = await response.json();
                //throw `Received status code ${response.status} with message: ${errorData.error.message ? errorData.error.message : errorData.error}`;
                throw `${errorData.error.message ? errorData.error.message : errorData.error}`;
            }
        } catch (error) {
            console.log(`[${this._Entity.className()}] - createWithScriptsApi - Error: ${error}`);
            throw `${error}`;
        }
    }

    // #endregion api
}
