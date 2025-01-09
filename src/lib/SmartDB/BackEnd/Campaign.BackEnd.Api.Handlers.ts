import { NextApiResponse } from 'next';
import { User } from 'next-auth';
import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseEntity,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    CascadeUpdate,
    NextApiRequestAuthenticated,
    console_error,
    console_log,
} from 'smart-db/backEnd';
import { CampaignEntity } from '../Entities/Campaign.Entity';

@BackEndAppliedFor(CampaignEntity)
export class CampaignBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = CampaignEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    // #region callbacks

    public static async callbackOnAfterLoad<T extends BaseEntity>(instance: T, cascadeUpdate: CascadeUpdate): Promise<CascadeUpdate> {
        //--------------------------------------
        console_log(1, this._Entity.className(), `callbackOnAfterLoad - Init`);
        //--------------------------------------
        cascadeUpdate = await super.callbackOnAfterLoad(instance, cascadeUpdate);
        //--------------------------------------
        // if (cascadeUpdate.swUpdate) {
        //     console_log(0, instance.className(), `callbackOnAfterLoad - updating because super.callbackOnAfterLoad...`);
        // }
        // //--------------------------------------
        // const fundInstance = instance as unknown as FundWithDetailsEntity;
        // //-------------------
        // if (fundInstance._isDeployed === true) {
        //     //-------------------
        //     const total_FT_Minted = await this.getTotal_FT_Minted(fundInstance);
        //     //--------------------------------------
        //     let priceADAx1e6 = fundInstance.priceADAx1e6;
        //     //--------------------------------------
        //     let TVLx1e6 = fundInstance.TVLx1e6;
        //     //--------------------------------------
        //     const delegatedMAYZ = await this.getTotal_MAYZ_Delegated(fundInstance);
        //     //--------------------------------------
        //     const feeEarned = await this.getTotal_FT_Commissions_Earned(fundInstance);
        //     //--------------------------------------
        //     let tokenFTWithPrice: Token_With_Price_And_Date_And_Signature | undefined = undefined;
        //     //--------------------------------------
        //     if (fundInstance.investUnit?.investUnitWithADAPrices.iuValuesWithDetailsAndAmount !== undefined) {
        //         tokenFTWithPrice = await this.get_TokenFT_PriceADAx1e6_From_TokensWithDetails(fundInstance, false, MAX_PRICE_AGE_FOR_APROXIMATED_USE_MS);
        //     } else {
        //         tokenFTWithPrice = await this.get_TokenFT_PriceADAx1e6(fundInstance, false, MAX_PRICE_AGE_FOR_APROXIMATED_USE_MS);
        //     }
        //     //--------------------------------------
        //     if (tokenFTWithPrice !== undefined && tokenFTWithPrice.priceADAx1e6 !== undefined) {
        //         priceADAx1e6 = tokenFTWithPrice.priceADAx1e6;
        //         TVLx1e6 = tokenFTWithPrice.priceADAx1e6 * total_FT_Minted;
        //     }
        //     //------------------------------
        //     const change24 = await this.get_FT_Change_24(fundInstance);
        //     //------------------------------
        //     const prev = {
        //         total_FT_Minted: fundInstance.total_FT_Minted,
        //         priceADAx1e6: fundInstance.priceADAx1e6,
        //         TVLx1e6: fundInstance.TVLx1e6,
        //         change24: fundInstance.change24,
        //         feeEarned: fundInstance.feeEarned,
        //         delegatedMAYZ: fundInstance.delegatedMAYZ,
        //     };
        //     //------------------------------
        //     fundInstance.total_FT_Minted = total_FT_Minted;
        //     fundInstance.priceADAx1e6 = priceADAx1e6;
        //     fundInstance.TVLx1e6 = TVLx1e6;
        //     fundInstance.change24 = change24;
        //     fundInstance.feeEarned = feeEarned;
        //     fundInstance.delegatedMAYZ = delegatedMAYZ;
        //     //------------------------------
        //     const current = {
        //         total_FT_Minted: fundInstance.total_FT_Minted,
        //         priceADAx1e6: fundInstance.priceADAx1e6,
        //         TVLx1e6: fundInstance.TVLx1e6,
        //         change24: fundInstance.change24,
        //         feeEarned: fundInstance.feeEarned,
        //         delegatedMAYZ: fundInstance.delegatedMAYZ,
        //     };
        //     //------------------------------
        //     let updatedFields = {};
        //     let swUpdateValues = false;
        //     //------------------------------
        //     Object.entries(prev).forEach(([key, value]) => {
        //         if ((current as any)[key] !== value) {
        //             (updatedFields as any)[key] = {
        //                 from: value,
        //                 to: (current as any)[key],
        //             };
        //             swUpdateValues = true;
        //         }
        //     });
        //     //------------------------------
        //     if (swUpdateValues) {
        //         console_log(0, instance.className(), `callbackOnAfterLoad - updating because updatedValues - which fields: ${toJson({ updatedFields })}`);
        //         cascadeUpdate = { swUpdate: true, updatedFields };
        //     }
        //     //------------------------------
        //     const CS = fundInstance.getNET_id_CS();
        //     const TN_Hex = fundInstance.fdFundFT_TN;
        //     //--------------------------------------
        //     const TokenMetadataBackEndApplied = (await import('../index.exports')).TokenMetadataBackEndApplied;
        //     //--------------------------------------
        //     const tokenMetadata: Record<string, any> | undefined = await TokenMetadataBackEndApplied.get_Token_Metadata(
        //         CS,
        //         TN_Hex,
        //         undefined,
        //         TokenMetadataEntity.optionsGetForTokenStore
        //     );
        //     //--------------------------------------
        //     const tokenFTWithPriceAndMetadataAndAmount: Partial<Token_With_Price_And_Date_And_Signature_And_Amount_And_Metadata> = {
        //         ...tokenFTWithPrice,
        //         CS,
        //         TN_Hex,
        //         amount: total_FT_Minted,
        //         decimals: tokenMetadata?.decimals,
        //         image: tokenMetadata?.image,
        //         colorHex: tokenMetadata?.colorHex,
        //         metadata_raw: tokenMetadata?.metadata,
        //     };
        //     //--------------------------------------
        //     fundInstance.tokenFT = tokenFTWithPriceAndMetadataAndAmount as unknown as Token_With_Price_And_Date_And_Signature_And_Amount_And_Metadata;
        //     //--------------------------------------
        // } else {
        //     //--------------------------------------
        //     fundInstance.tokenFT = undefined;
        //     //--------------------------------------
        // }
        //--------------------------------------
        console_log(-1, this._Entity.className(), `callbackOnAfterLoad  - OK`);
        //-------------------------------------
        return cascadeUpdate;
    }

    // #endregion callbacks
}

@BackEndApiHandlersFor(CampaignEntity)
export class CampaignApiHandlers extends BaseSmartDBBackEndApiHandlers {
    protected static _Entity = CampaignEntity;
    protected static _BackEndApplied = CampaignBackEndApplied;

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
