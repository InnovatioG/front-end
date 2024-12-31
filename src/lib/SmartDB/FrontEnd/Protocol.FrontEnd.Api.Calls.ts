import { BaseSmartDBFrontEndTxApiCalls } from 'smart-db';
import { ProtocolEntity } from '../Entities/Protocol.Entity';

export class ProtocolApi extends BaseSmartDBFrontEndTxApiCalls {
    protected static _Entity = ProtocolEntity;

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
