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
import { MilestoneEntity } from '../Entities/Milestone.Entity';

@BackEndAppliedFor(MilestoneEntity)
export class MilestoneBackEndApplied extends  BaseSmartDBBackEndApplied  {
    protected static _Entity = MilestoneEntity;
    protected static _BackEndMethods =  BaseSmartDBBackEndMethods;
}

@BackEndApiHandlersFor(MilestoneEntity)
export class MilestoneApiHandlers extends  BaseSmartDBBackEndApiHandlers   {
    protected static _Entity = MilestoneEntity;
    protected static _BackEndApplied = MilestoneBackEndApplied;
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

