import { NextApiResponse } from 'next';
import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    NextApiRequestAuthenticated,
    console_error,
} from 'smart-db/backEnd';
import { CampaignEntity } from '../Entities/Campaign.Entity';

@BackEndAppliedFor(CampaignEntity)
export class CampaignBackEndApplied extends  BaseSmartDBBackEndApplied  {
    protected static _Entity = CampaignEntity;
    protected static _BackEndMethods =  BaseSmartDBBackEndMethods;
}

@BackEndApiHandlersFor(CampaignEntity)
export class CampaignApiHandlers extends  BaseSmartDBBackEndApiHandlers   {
    protected static _Entity = CampaignEntity;
    protected static _BackEndApplied = CampaignBackEndApplied;
    // #region custom api handlers

    protected static _ApiHandlers: string[] = ['tx'];

    protected static async executeApiHandlers(command: string, req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        const { query } = req.query;
        //--------------------
        if (this._ApiHandlers.includes(command) && query !== undefined) {
            if (query[0] === 'tx') {
                if (query.length === 2) {
                    // if (query[1] === 'create-tx') {
                    //     return await this.createTxApiHandler(req, res);
                    // } else if (query[1] === 'claim-tx') {
                    //     return await this.claimTxApiHandler(req, res);
                    // } else if (query[1] === 'update-tx') {
                    //     return await this.updateTxApiHandler(req, res);
                    // }
                }
                return res.status(405).json({ error: "Wrong Api route"});
            } else {
                console_error(0, this._Entity.className(), `executeApiHandlers - Error: Api Handler function not found`);
                return res.status(500).json({ error: "Api Handler function not found "});
            }
        } else {
            console_error(0, this._Entity.className(), `executeApiHandlers - Error: Wrong Custom Api route`);
            return res.status(405).json({ error:"Wrong Custom Api route "});
        }
    }

    // #endregion custom api handlers
}

