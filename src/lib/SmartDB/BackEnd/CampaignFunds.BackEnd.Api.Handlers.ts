import { NextApiResponse } from 'next';
import { User } from 'next-auth';
import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseEntity,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    NextApiRequestAuthenticated,
    console_error,
    console_log,
    toJson,
} from 'smart-db/backEnd';
import { CampaignFundsDatum, CampaignFundsEntity } from '../Entities/CampaignFunds.Entity';
import { CampaignEntity } from '../Entities/Campaign.Entity';
import { CAMPAIGN_FUNDS_VERSION } from '@/utils/constants/on-chain';
import { MilestoneDatumStatus_Code_Id_Enums } from '@/utils/constants/status/status';

@BackEndAppliedFor(CampaignFundsEntity)
export class CampaignFundsBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = CampaignFundsEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    // #region datum methods

    public static mkNew_CampaignFundsDatum(campaign: CampaignEntity, mindAda: bigint): CampaignFundsDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: CampaignFundsDatum = {
            cfdVersion: CAMPAIGN_FUNDS_VERSION,
            cfdIndex: campaign.cdFundsIndex,
            cfdCampaignPolicy_CS: campaign.getNET_id_CS(),
            cfdCampaignFundsPolicyID_CS: campaign.getNet_FundHoldingPolicyID_CS(),
            cfdSubtotal_Avalaible_CampaignToken: 0n,
            cfdSubtotal_Sold_CampaignToken: 0n,
            cfdSubtotal_Avalaible_ADA: 0n,
            cfdSubtotal_Collected_ADA: 0n,
            cfdMinADA: mindAda,
        };

        let datum: CampaignFundsDatum = CampaignFundsEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignFundsDatum;

        return datum;
    }

    public static mkUpdated_CampaignFundsDatum_With_Deposit(campaignFundsDatum_In: CampaignFundsDatum, amount: bigint): CampaignFundsDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: CampaignFundsDatum = {
            ...JSON.parse(toJson(campaignFundsDatum_In)),
            cfdSubtotal_Avalaible_CampaignToken: campaignFundsDatum_In.cfdSubtotal_Avalaible_CampaignToken + amount,
        };

        let datum: CampaignFundsDatum = CampaignFundsEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignFundsDatum;

        return datum;
    }

    public static mkUpdated_CampaignFundsDatum_Invest(campaignFundsDatum_In: CampaignFundsDatum, amountTokens: bigint, amountADA: bigint): CampaignFundsDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: CampaignFundsDatum = {
            ...JSON.parse(toJson(campaignFundsDatum_In)),
            cfdSubtotal_Sold_CampaignToken: campaignFundsDatum_In.cfdSubtotal_Sold_CampaignToken + amountTokens,
            cfdSubtotal_Avalaible_CampaignToken: campaignFundsDatum_In.cfdSubtotal_Avalaible_CampaignToken - amountTokens,
            cfdSubtotal_Avalaible_ADA: campaignFundsDatum_In.cfdSubtotal_Avalaible_ADA + amountADA,
        };

        let datum: CampaignFundsDatum = CampaignFundsEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignFundsDatum;

        return datum;
    }
    public static mkUpdated_CampaignFundsDatum_Collect(campaignFundsDatum_In: CampaignFundsDatum, amountADAToCollect: bigint): CampaignFundsDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: CampaignFundsDatum = {
            ...JSON.parse(toJson(campaignFundsDatum_In)),
            cfdSubtotal_Avalaible_ADA: campaignFundsDatum_In.cfdSubtotal_Avalaible_ADA - amountADAToCollect,
            cfdSubtotal_Collected_ADA: campaignFundsDatum_In.cfdSubtotal_Collected_ADA + amountADAToCollect,
        };

        let datum: CampaignFundsDatum = CampaignFundsEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignFundsDatum;

        return datum;
    }
    // TODO: checkea si esta funcion debe ir aca
    public static getAmountToCollect(campaign: CampaignEntity): bigint {
        const sucessMilestones = campaign.cdMilestones.filter((milestone) => milestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsSuccess);
        const accumPorcentaje = sucessMilestones.reduce((acc, milestone) => acc + milestone.cmPerncentage, 0n);

        const totalFundsToCollect = campaign.cdFundedADA * accumPorcentaje;
        const avalibleFundsToCollect = totalFundsToCollect - campaign.cdCollectedADA;

        return avalibleFundsToCollect;
    }

    // #endregion datum methods
}

@BackEndApiHandlersFor(CampaignFundsEntity)
export class CampaignFundsApiHandlers extends BaseSmartDBBackEndApiHandlers {
    protected static _Entity = CampaignFundsEntity;
    protected static _BackEndApplied = CampaignFundsBackEndApplied;

    // #region restrict api handlers

    public static async restricFilter(user: User | undefined) {
        //----------------------------
        console_log(1, this._Entity.className(), `restricFilter - Init`);
        //----------------------------
        // let restricFilter: any = await super.restricFilter(user);
        // //-------------------
        // if (user === undefined || user.iswallet_validated_with_signed_token === false) {
        //     restricFilter = { showInSite: true };
        // } else {
        //     if (user.isCoreTeam === false) {
        //         restricFilter.$or.push({ fdAdmins: { $in: [user.pkh] } });
        //         //const ProtocolBackEnd_ = (await import('./protocolBackEnd')).ProtocolBackEnd;
        //         const isProtocolAdmin = await ProtocolBackEndApplied.isAdmin(user.pkh);
        //         if (isProtocolAdmin === true) {
        //             const protocols = await ProtocolBackEndApplied.getByAdmin(user.pkh, { fieldsForSelect: { _id: true }, loadRelations: {} });
        //             const protocol_ids = protocols.map((protocol) => protocol._DB_id);
        //             restricFilter.$or.push({ protocol_id: { $in: protocol_ids } });
        //         }
        //     } else {
        //         restricFilter = {};
        //     }
        // }
        let restricFilter = {};
        //----------------------------
        console_log(-1, this._Entity.className(), `restricFilter - OK`);
        //----------------------------
        return restricFilter;
        //-------------------
    }

    public static async restricCreate(user: User | undefined) {
        //-------------------
        // if (user === undefined) {
        //     throw `Can't create ${this._Entity.className()} if not logged`;
        // }
        // //-------------------
        // if (user.iswallet_validated_with_signed_token === false) {
        //     throw `Can't create ${this._Entity.className()} if not logged in Admin Mode`;
        // }
        // //-------------------
        // if (!(user.isCoreTeam || user.isMAYZHolder)) {
        //     throw `Can't create ${this._Entity.className()} if not core team or MAYZ Holder`;
        // }
        //-------------------
    }

    public static async restricUpdate<T extends BaseEntity>(instance: T, user: User | undefined) {
        //-------------------
        // if (user === undefined) {
        //     throw `Can't update ${this._Entity.className()} if not logged`;
        // }
        // //-------------------
        // if (user.iswallet_validated_with_signed_token === false) {
        //     throw `Can't update ${this._Entity.className()} if not logged in Admin Mode`;
        // }
        // //-------------------
        // const fundInstance = instance as unknown as FundEntity;
        // //-------------------
        // if (!(user.isCoreTeam || fundInstance.isAdmin(user.pkh) || fundInstance.isCreator(user.pkh))) {
        //     throw `Can't update ${this._Entity.className()} if not core team, creator or admin`;
        // }
        //-------------------
    }

    public static async restricDelete<T extends BaseEntity>(instance: T, user: User | undefined) {
        //-------------------
        // if (user === undefined) {
        //     throw `Can't delete ${this._Entity.className()} if not logged`;
        // }
        // //-------------------
        // if (user.iswallet_validated_with_signed_token === false) {
        //     throw `Can't delete ${this._Entity.className()} if not logged in Admin Mode`;
        // }
        // //-------------------
        // const fundInstance = instance as unknown as FundEntity;
        // //-------------------
        // if (fundInstance._isDeployed === true) {
        //     throw `Can't delete deployed ${this._Entity.className()}`;
        // }
        // //-------------------
        // if (!(user.isCoreTeam || fundInstance.isAdmin(user.pkh) || fundInstance.isCreator(user.pkh))) {
        //     throw `Can't delete ${this._Entity.className()} if not core team, creator or admin`;
        // }
        //-------------------
    }

    // public static async validateCreateData(data: any) {
    //     //-------------------
    //     let validatedData = await super.validateCreateData(data);
    //     //-------------------
    //     let formSchema = yup.object().shape({
    //         fdpFundVersion: yup.number().required(),
    //         protocol_id: yup.string().required().label(`Protocol ID`),
    //     });
    //     //-------------------
    //     validatedData = await formSchema.validate(validatedData, { stripUnknown: false });
    //     //-------------------
    //     return validatedData;
    // }

    // #endregion restrict api handlers

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
                return res.status(405).json({ error: 'Wrong Api route' });
            } else {
                console_error(0, this._Entity.className(), `executeApiHandlers - Error: Api Handler function not found`);
                return res.status(500).json({ error: 'Api Handler function not found ' });
            }
        } else {
            console_error(0, this._Entity.className(), `executeApiHandlers - Error: Wrong Custom Api route`);
            return res.status(405).json({ error: 'Wrong Custom Api route ' });
        }
    }

    // #endregion custom api handlers
}
