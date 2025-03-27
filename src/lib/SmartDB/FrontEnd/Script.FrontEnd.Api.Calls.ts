import { BaseSmartDBFrontEndTxApiCalls, isEqual, isNullOrBlank, OptionsGetOne, optionsGetOneDefault, toJson, WalletTxParams } from 'smart-db';
import { ScriptEntity } from '../Entities/Script.Entity';
import { ProtocolAddScriptsTxParams, AddScriptTxParams, CampaignAddScriptsTxParams } from '../Commons/Params';

export class ScriptApi extends BaseSmartDBFrontEndTxApiCalls {
    protected static _Entity = ScriptEntity;

    // #region front end Btn handlers

    // #endregion front end Btn handlers

    // #region api

    
    public static async getByHashApi<T extends ScriptEntity>(hash: string, optionsGet?: OptionsGetOne): Promise<T | undefined> {
        try {
            if (isNullOrBlank(hash)) {
                throw `Script Hash not defined`;
            }
            //-------------------------
            let response;
            if (isEqual(optionsGet, optionsGetOneDefault)) {
                response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/by-hash/${hash}`);
            } else {
                const body = toJson(optionsGet);
                //-------------------------
                response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/by-hash/${hash}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body,
                });
            }
            //-------------------------
            if (response.status === 200) {
                const data = await response.json();
                console.log(`[${this._Entity.className()}] - getByHashApi - response OK`);
                const instance = this._Entity.fromPlainObject<T>(data)
                console.log(`[${this._Entity.className()}] - getByHashApi - hash: ${hash} - Instance: ${instance.show()}`);
                return instance;
            } else if (response.status === 404) {
                console.log(`[${this._Entity.className()}] - getByHashApi - hash: ${hash} - Instance not found`);
                return undefined;
            } else {
                const errorData = await response.json();
                //throw `Received status code ${response.status} with message: ${errorData.error.message ? errorData.error.message : errorData.error}`;
                throw `${errorData.error.message ? errorData.error.message : errorData.error}`;
            }
            //-------------------------
        } catch (error) {
            console.log(`[${this._Entity.className()}] - getByHashApi - Error: ${error}`);
            throw error
        }
    }

    public static async addProtocolScriptTxApi(walletTxParams: WalletTxParams, txParams: ProtocolAddScriptsTxParams & AddScriptTxParams): Promise<any> {
        try {
            if (txParams === undefined) {
                throw `ProtocolAddScriptsTxParams not defined`;
            }
            const body = toJson({ walletTxParams, txParams });
            const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/tx/addProtocolScript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (response.status === 200) {
                const data = await response.json();
                console.log(`[${this._Entity.apiRoute()}] - addProtocolScriptTxApi - OK`);
                return data;
            } else {
                const errorData = await response.json();
                //throw `Received status code ${response.status} with message: ${errorData.error.message ? errorData.error.message : errorData.error}`;
                throw `${errorData.error.message ? errorData.error.message : errorData.error}`;
            }
        } catch (error) {
            console.log(`[${this._Entity.apiRoute()}] - addProtocolScriptTxApi - Error: ${error}`);
            throw error
        }
    }

    public static async addCampaignScriptTxApi(walletTxParams: WalletTxParams, txParams: CampaignAddScriptsTxParams & AddScriptTxParams): Promise<any> {
        try {
            if (txParams === undefined) {
                throw `CampaignAddScriptsTxParams not defined`;
            }
            const body = toJson({ walletTxParams, txParams });
            const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_SERVER_API_URL}/${this._Entity.apiRoute()}/tx/addFundScript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (response.status === 200) {
                const data = await response.json();
                console.log(`[${this._Entity.apiRoute()}] - addCampaignScriptTxApi - OK`);
                return data;
            } else {
                const errorData = await response.json();
                //throw `Received status code ${response.status} with message: ${errorData.error.message ? errorData.error.message : errorData.error}`;
                throw `${errorData.error.message ? errorData.error.message : errorData.error}`;
            }
        } catch (error) {
            console.log(`[${this._Entity.apiRoute()}] - addCampaignScriptTxApi - Error: ${error}`);
            throw error
        }
    }

    // #endregion api
}
