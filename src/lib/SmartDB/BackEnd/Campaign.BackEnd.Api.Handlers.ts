import { CAMPAIGN_FUNDSID_TN_Str_basename, CAMPAIGN_VERSION, TxEnums } from '@/utils/constants/on-chain';
import { CampaignDatumStatus_Code_Id_Enums, CampaignStatus_Code_Id_Enums, MilestoneDatumStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import { addAssets, Address, Assets, PaymentKeyHash, TxBuilder } from '@lucid-evolution/lucid';
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
    LucidToolsBackEnd,
    NextApiRequestAuthenticated,
    TRANSACTION_STATUS_CREATED,
    TimeBackEnd,
    TransactionBackEndApplied,
    TransactionDatum,
    TransactionEntity,
    TransactionRedeemer,
    TxOutRef,
    WalletTxParams,
    addAssetsList,
    addressToPubKeyHash,
    calculateMinAdaOfUTxO,
    console_error,
    console_log,
    convertMillisToTime,
    find_TxOutRef_In_UTxOs,
    fixUTxOList,
    formatUTxO,
    getTxRedeemersDetailsAndResources,
    isNullOrBlank,
    objToCborHex,
    optionsGetMinimalWithSmartUTxOCompleteFields,
    sanitizeForDatabase,
    showData,
    strToHex,
    subsAssets,
    subsAssetsList,
    toJson,
} from 'smart-db/backEnd';
import {
    CampaignCampaingNotReachedTxParams,
    CampaignCampaingReachedTxParams,
    CampaignDeployTxParams,
    CampaignFundsAddTxParams,
    CampaignFundsInvestTxParams,
    CampaignFundsMintDepositTxParams,
    CampaignLaunchTxParams,
} from '../Commons/Params';
import { CampaignFundsDatum, CampaignFundsEntity, CampaignMemberEntity, CampaignStatusEntity, MilestoneEntity, ProtocolEntity } from '../Entities';
import { CampaignDatum, CampaignEntity, CampaignMilestoneDatum } from '../Entities/Campaign.Entity';
import {
    CampaignPolicyRedeemerMintCampaignToken,
    CampaignPolicyRedeemerMintID,
    CampaignValidatorRedeemerFundsAdd,
    CampaignValidatorRedeemerInitializeCampaign,
} from '../Entities/Redeemers/Campaign.Redeemer';
import { CampaignMemberBackEndApplied } from './CampaignMember.BackEnd.Api.Handlers';
import { CampaignStatusBackEndApplied } from './CampaignStatus.BackEnd.Api.Handlers';
import { MilestoneBackEndApplied } from './Milestone.BackEnd.Api.Handlers';
import { ScriptBackEndApplied } from './Script.BackEnd.Api.Handlers';
import { CampaignFundsBackEndApplied } from './CampaignFunds.BackEnd.Api.Handlers';
import { CampaignFundsPolicyRedeemerMintID, CampaignFundsValidatorRedeemerDeposit, CampaignFundsValidatorRedeemerSell } from '../Entities/Redeemers/CampaignFunds.Redeemer';

@BackEndAppliedFor(CampaignEntity)
export class CampaignBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = CampaignEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;
    // #region class methods

    private static sortDatum(datum: CampaignDatum) {
        datum.cdAdmins = datum.cdAdmins.sort((a: PaymentKeyHash, b: PaymentKeyHash) => {
            if (a < b) return -1;
            return 1;
        });
    }

    public static mkNew_CampaignDatum(
        campaign: CampaignEntity,
        milestones: MilestoneEntity[],
        members: CampaignMemberEntity[],
        txParams: CampaignDeployTxParams,
        serverTime: number,
        mindAda: bigint
    ): CampaignDatum {
        //-----------------------------------
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos
        //-----------------------------------
        const begin_at = serverTime + campaign.begin_at_days * 24 * 60 * 60 * 1000;
        const deadline = serverTime + campaign.deadline_days * 24 * 60 * 60 * 1000;
        //-----------------------------------
        const milestoneDatum: CampaignMilestoneDatum[] = milestones.map((milestone) => {
            return {
                cmPerncentage: BigInt(milestone.percentage),
                cmStatus: MilestoneDatumStatus_Code_Id_Enums.MsCreated,
            };
        });
        //-----------------------------------
        const admins: string[] = members
            .map((member) => {
                return member.wallet_address !== undefined ? addressToPubKeyHash(member.wallet_address) : undefined;
            })
            .filter((admin) => admin !== undefined) as string[];
        //-----------------------------------
        const datumPlainObject: CampaignDatum = {
            cdCampaignVersion: CAMPAIGN_VERSION,
            cdCampaignPolicy_CS: campaign.getNET_id_CS(),
            cdCampaignFundsPolicyID_CS: campaign.getNet_FundHoldingPolicyID_CS(),
            cdAdmins: admins,
            cdTokenAdminPolicy_CS: txParams.cdTokenAdminPolicy_CS,
            cdMint_CampaignToken: campaign.mint_CampaignToken,
            cdCampaignToken_CS: campaign.campaignToken_CS,
            cdCampaignToken_TN: campaign.campaignToken_TN,
            cdCampaignToken_PriceADA: campaign.campaignToken_PriceADA,
            cdRequestedMaxADA: campaign.requestedMaxADA * 1000000n,
            cdRequestedMinADA: campaign.requestedMinADA * 1000000n,
            cdFundedADA: 0n,
            cdCollectedADA: 0n,
            cdBegin_at: BigInt(begin_at),
            cdDeadline: BigInt(deadline),
            cdStatus: CampaignDatumStatus_Code_Id_Enums.CsCreated,
            cdMilestones: milestoneDatum,
            cdFundsCount: 0,
            cdFundsIndex: 0,
            cdMinADA: mindAda,
        };
        let datum: CampaignDatum = CampaignEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignDatum;
        this.sortDatum(datum);
        return datum;
    }

    public static mkUpdated_CampaignDatum_With_Status(capaignDatum_In: CampaignDatum, status: CampaignDatumStatus_Code_Id_Enums): CampaignDatum {
        const datumPlainObject: CampaignDatum = {
            ...JSON.parse(toJson(capaignDatum_In)),
            cdStatus: status,
        };
        let datum: CampaignDatum = CampaignEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignDatum;
        this.sortDatum(datum);
        return datum;
    }

    public static mkUpdated_CampaignDatum_With_FundAdded(campaignDatum_In: CampaignDatum): CampaignDatum {
        const datumPlainObject: CampaignDatum = {
            ...JSON.parse(toJson(campaignDatum_In)),
            cdFundsCount: campaignDatum_In.cdFundsCount + 1,
            cdFundsIndex: campaignDatum_In.cdFundsIndex + 1,
        };
        let datum: any = CampaignEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignDatum;
        this.sortDatum(datum);
        return datum;
    }

    // #endregion class methods

    // #region callbacks

    public static async callbackOnAfterLoad<T extends BaseEntity>(instance: T, cascadeUpdate: CascadeUpdate): Promise<CascadeUpdate> {
        //--------------------------------------
        console_log(1, this._Entity.className(), `callbackOnAfterLoad - Init`);
        //--------------------------------------
        cascadeUpdate = await super.callbackOnAfterLoad(instance, cascadeUpdate);
        if (cascadeUpdate.swUpdate) {
            console_log(0, instance.className(), `callbackOnAfterLoad - updating because super.callbackOnAfterLoad...`);
        }
        //--------------------------------------
        const campaignInstance = instance as unknown as CampaignEntity;
        //--------------------------------------
        // INICIALIZACIÓN DE CAMPOS PARA DETECCIÓN DE CAMBIOS
        const prev = {
            begin_at: campaignInstance.begin_at,
            deadline: campaignInstance.deadline,
            campaign_status_id: campaignInstance.campaign_status_id,
            campaignToken_CS: campaignInstance.campaignToken_CS,
            campaignToken_PriceADA: campaignInstance.campaignToken_PriceADA,
        };
        //--------------------------------------
        // 🔹 AUTO-FILL DE TOKEN_CS SI APLICA
        if (campaignInstance.mint_CampaignToken === true && isNullOrBlank(campaignInstance.campaignToken_CS) && !isNullOrBlank(campaignInstance.getNET_id_CS())) {
            campaignInstance.campaignToken_CS = campaignInstance.getNET_id_CS();
        }
        //--------------------------------------
        if (
            campaignInstance.requestedMaxADA > 0n &&
            campaignInstance.tokenomics_for_campaign > 0n &&
            (campaignInstance.campaignToken_PriceADA === undefined || campaignInstance.campaignToken_PriceADA <= 0n)
        ) {
            const newPrice = Number(campaignInstance.requestedMaxADA * 1000000n) / Number(campaignInstance.tokenomics_for_campaign);
            const validPrice = Number(campaignInstance.requestedMaxADA * 1000000n) % Number(campaignInstance.tokenomics_for_campaign) === 0;
            if (validPrice) {
                campaignInstance.campaignToken_PriceADA = BigInt(newPrice);
            } else {
                campaignInstance.campaignToken_PriceADA = 0n;
            }
        }
        //--------------------------------------
        // 🔹 ACTUALIZACIÓN INFERIDA POR FECHAS
        if (campaignInstance._isDeployed === true) {
            const serverTime = await TimeBackEnd.getServerTime();
            const begin_at = campaignInstance.cdBegin_at;
            const deadline = campaignInstance.cdDeadline;
            const statusDatum = campaignInstance.cdStatus;
            let status_id = campaignInstance.campaign_status_id;
            if (statusDatum === CampaignDatumStatus_Code_Id_Enums.CsInitialized) {
                if (serverTime > BigInt(begin_at) && serverTime < BigInt(deadline)) {
                    const statusInstance = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.FUNDRAISING });
                    if (statusInstance) status_id = statusInstance._DB_id;
                } else if (serverTime > BigInt(deadline)) {
                    const statusInstance = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.FINISHING });
                    if (statusInstance) status_id = statusInstance._DB_id;
                } else {
                    const statusInstance = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.COUNTDOWN });
                    if (statusInstance) status_id = statusInstance._DB_id;
                }
            }
            campaignInstance.begin_at = new Date(Number(begin_at.toString()));
            campaignInstance.deadline = new Date(Number(deadline.toString()));
            campaignInstance.campaignToken_PriceADA = BigInt(campaignInstance.cdCampaignToken_PriceADA.toString());
            campaignInstance.campaign_status_id = status_id;
        }

        //--------------------------------------
        // CAMPOS POSTERIORES A TODAS LAS ACTUALIZACIONES
        const current = {
            begin_at: campaignInstance.begin_at,
            deadline: campaignInstance.deadline,
            campaign_status_id: campaignInstance.campaign_status_id,
            campaignToken_CS: campaignInstance.campaignToken_CS,
            campaignToken_PriceADA: campaignInstance.campaignToken_PriceADA,
        };

        //--------------------------------------
        // DIFERENCIAS DETECTADAS
        let updatedFields = {};
        let swUpdateValues = false;
        Object.entries(prev).forEach(([key, value]) => {
            const newValue = (current as any)[key];
            if (newValue !== value) {
                (updatedFields as any)[key] = { from: value, to: newValue };
                swUpdateValues = true;
            }
        });
        if (swUpdateValues) {
            console_log(0, instance.className(), `callbackOnAfterLoad - updating because updatedValues - which fields: ${toJson({ updatedFields })}`);
            cascadeUpdate = { swUpdate: true, updatedFields };
        }
        //--------------------------------------
        console_log(-1, this._Entity.className(), `callbackOnAfterLoad  - OK`);
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
                    if (query[1] === 'deploy-tx') {
                        return await this.campaignDeployTxApiHandler(req, res);
                    } else if (query[1] === 'launch-tx') {
                        return await this.campaignLaunchTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-fund-add-tx') {
                        return await this.campaignFundsAddTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-fund-mint-deposit-tx') {
                        return await this.campaignFundsMintDepositTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-invest-tx') {
                        return await this.campaignFundsInvestTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-reached-tx') {
                        return await this.campaignReachedTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-not-reached-tx') {
                        return await this.campaignNotReachedTxApiHandler(req, res);
                    }
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
    // #region transactions

    public static async campaignDeployTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Deploy Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignDeployTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Deploy Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, { fieldsForSelect: {} });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const milestones = await MilestoneBackEndApplied.getByParams_<MilestoneEntity>({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
                //--------------------------------------
                const members = await CampaignMemberBackEndApplied.getByParams_<CampaignMemberEntity>({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
                //--------------------------------------
                const serverTime = await TimeBackEnd.getServerTime();
                //--------------------------------------
                const campaignPolicy_Script = campaign.fdpCampaignPolicy_Script;
                //--------------------------------------
                const campaignPolicy_AC_Lucid = campaign.getNet_id_AC_Lucid();
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignID_TxOutRef = new TxOutRef(
                    (campaign.fdpCampaignPolicy_Params as any).campaign_TxHash,
                    Number((campaign.fdpCampaignPolicy_Params as any).campaign_TxOutputIndex)
                );
                //--------------------------------------
                const uTxOsAtWallet = walletTxParams.utxos; // await lucid.utxosAt(params.address);
                const campaignID_UTxO = find_TxOutRef_In_UTxOs(campaignID_TxOutRef, uTxOsAtWallet);
                if (campaignID_UTxO === undefined) {
                    throw "Can't find UTxO (" + toJson(campaignID_TxOutRef) + ') for Mint CampaignID';
                }
                //--------------------------------------
                const valueFor_Mint_CampaignID: Assets = { [campaignPolicy_AC_Lucid]: 1n };
                console_log(0, this._Entity.className(), `Deploy Tx - valueFor_Mint_CampaignID: ${showData(valueFor_Mint_CampaignID)}`);
                //--------------------------------------
                const campaignDatum_Out_ForCalcMinADA = this._BackEndApplied.mkNew_CampaignDatum(campaign, milestones, members, txParams, serverTime, 0n);
                const campaignDatum_Out_Hex_ForCalcMinADA = CampaignEntity.datumToCborHex(campaignDatum_Out_ForCalcMinADA);
                //--------------------------------------
                let valueFor_CampaignDatum_Out: Assets = valueFor_Mint_CampaignID;
                const minADA_For_CampaignDatum = calculateMinAdaOfUTxO({ datum: campaignDatum_Out_Hex_ForCalcMinADA, assets: valueFor_CampaignDatum_Out });
                const value_MinAda_For_CampaignDatum: Assets = { lovelace: minADA_For_CampaignDatum };
                valueFor_CampaignDatum_Out = addAssetsList([value_MinAda_For_CampaignDatum, valueFor_CampaignDatum_Out]);
                console_log(0, this._Entity.className(), `Deploy Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkNew_CampaignDatum(campaign, milestones, members, txParams, serverTime, minADA_For_CampaignDatum);
                console_log(0, this._Entity.className(), `Deploy Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `Deploy Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const campaignPolicyRedeemerMintID = new CampaignPolicyRedeemerMintID();
                console_log(0, this._Entity.className(), `Deploy Tx - campaignPolicyRedeemerMintID: ${showData(campaignPolicyRedeemerMintID, false)}`);
                const campaignPolicyRedeemerMintID_Hex = objToCborHex(campaignPolicyRedeemerMintID);
                console_log(0, this._Entity.className(), `Deploy Tx - campaignPolicyRedeemerMintID_Hex: ${showData(campaignPolicyRedeemerMintID_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Deploy Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIG_DEPLOY,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .readFrom([protocol_UTxO])
                        .collectFrom([campaignID_UTxO])
                        .attach.MintingPolicy(campaignPolicy_Script)
                        .mintAssets(valueFor_Mint_CampaignID, campaignPolicyRedeemerMintID_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Deploy Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignPolicyRedeemerMintID: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'mint',
                        redeemerObj: campaignPolicyRedeemerMintID,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionCampaignDatum_Out: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id },
                        redeemers: { campaignPolicyRedeemerMintID: transactionCampaignPolicyRedeemerMintID },
                        datums: { campaignDatum_Out: transactionCampaignDatum_Out },
                        reading_UTxOs: [protocol_UTxO],
                        consuming_UTxOs: [campaignID_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Deploy Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Deploy Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Deploy Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Deploy Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignFundsAddTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Fund Add Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignFundsAddTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Fund Add Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const campaign_SmartUTxO = campaign.smartUTxO;
                if (campaign_SmartUTxO === undefined) {
                    throw `Can't find Campaign UTxO`;
                }
                //--------------------------------------
                const campaign_UTxO = campaign_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Fund Add Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                const campaignValidator_Address = campaign.getNet_Address();
                const campaignFundsPolicyID_CS = campaign.fdpCampaignFundsPolicyID_CS;
                const campaignFundsPolicyID_Script = campaign.fdpCampaignFundsPolicyID_Script;
                const campaignFundsValidator_Address = campaign.getNet_FundHolding_Validator_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `Fund Add Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignFunds_Index = campaign.cdFundsIndex;
                const campaignFundsID_TN_Str = CAMPAIGN_FUNDSID_TN_Str_basename + campaignFunds_Index;
                const campaignFundsID_AC_Lucid = campaignFundsPolicyID_CS + strToHex(campaignFundsID_TN_Str);
                //--------------------------------------
                const valueFor_Mint_CampaignFundsID: Assets = { [campaignFundsID_AC_Lucid]: 1n };
                console_log(0, this._Entity.className(), `Fund Add Tx - valueFor_Mint_CampaignFundsID: ${showData(valueFor_Mint_CampaignFundsID)}`);
                //--------------------------------------
                const campaignFundsDatum_Out_ForCalcMinADA = CampaignFundsBackEndApplied.mkNew_CampaignFundsDatum(campaign, 0n);
                const campaignFundsDatum_Out_Hex_ForCalcMinADA = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out_ForCalcMinADA);
                //--------------------------------------
                let valueFor_CampaignFundsDatum_Out: Assets = valueFor_Mint_CampaignFundsID;
                let valueFor_CampaignFundsDatum_Out_PlusMock: Assets = addAssets(valueFor_Mint_CampaignFundsID);
                const minADA_For_CampaignFundsDatum = calculateMinAdaOfUTxO({ datum: campaignFundsDatum_Out_Hex_ForCalcMinADA, assets: valueFor_CampaignFundsDatum_Out_PlusMock });
                const value_MinAda_For_CampaignFundsDatum: Assets = { lovelace: minADA_For_CampaignFundsDatum };
                valueFor_CampaignFundsDatum_Out = addAssetsList([value_MinAda_For_CampaignFundsDatum, valueFor_CampaignFundsDatum_Out]);
                console_log(0, this._Entity.className(), `Fund Add Tx - valueFor_CampaignFundsDatum_Out: ${showData(valueFor_CampaignFundsDatum_Out, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_CampaignDatum_With_FundAdded(campaignDatum_In);
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const campaignFundsDatum_Out = CampaignFundsBackEndApplied.mkNew_CampaignFundsDatum(campaign, minADA_For_CampaignFundsDatum);
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignFundsDatum_Out: ${showData(campaignFundsDatum_Out, false)}`);
                const campaignFundsDatum_Out_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out);
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignFundsDatum_Out_Hex: ${showData(campaignFundsDatum_Out_Hex, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerCampaignFundsAdd = new CampaignValidatorRedeemerFundsAdd();
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignValidatorRedeemerCampaignFundsAdd: ${showData(campaignValidatorRedeemerCampaignFundsAdd, false)}`);
                const campaignValidatorRedeemerCampaignFundsAdd_Hex = campaignValidatorRedeemerCampaignFundsAdd.toCborHex();
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Add Tx - campaignValidatorRedeemerCampaignFundsAdd_Hex: ${showData(campaignValidatorRedeemerCampaignFundsAdd_Hex, false)}`
                );
                //--------------------------------------
                const campaignFundsPolicyRedeemerMintID = new CampaignFundsPolicyRedeemerMintID();
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignFundsPolicyRedeemerMintID: ${showData(campaignValidatorRedeemerCampaignFundsAdd, false)}`);
                const campaignFundsPolicyRedeemerMintID_Hex = campaignFundsPolicyRedeemerMintID.toCborHex();
                console_log(0, this._Entity.className(), `Fund Add Tx - campaignFundsPolicyRedeemerMintID_Hex: ${showData(campaignFundsPolicyRedeemerMintID_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Add Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIGN_ADD_FUND,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .mintAssets(valueFor_Mint_CampaignFundsID, campaignFundsPolicyRedeemerMintID_Hex)
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerCampaignFundsAdd_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .pay.ToAddressWithData(campaignFundsValidator_Address, { kind: 'inline', value: campaignFundsDatum_Out_Hex }, valueFor_CampaignFundsDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Fund Add Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Fund Add Tx - Attaching Script: ${campaignValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignValidator_Script);
                    }
                    //--------------------------------------
                    const scriptCampaignFundsPolicyID = await ScriptBackEndApplied.getByHash(campaignFundsPolicyID_CS);
                    if (scriptCampaignFundsPolicyID !== undefined) {
                        console_log(0, this._Entity.className(), `Fund Add Tx - Using Script as Ref: ${campaignFundsPolicyID_CS}`);
                        const smartUTxO = scriptCampaignFundsPolicyID.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Script`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Fund Add Tx - Attaching Script: ${campaignFundsPolicyID_CS}`);
                        tx = tx.attach.MintingPolicy(campaignFundsPolicyID_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Fund Add Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerCampaignFundsAdd: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerCampaignFundsAdd,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionCampaignDatum_In: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_In,
                    };
                    const transactionCampaignDatum_Out: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_Out,
                    };
                    const transactionCampaignFundsDatum_Out: TransactionDatum = {
                        address: campaignFundsValidator_Address,
                        datumType: CampaignFundsEntity.className(),
                        datumObj: campaignFundsDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id },
                        redeemers: { campaignValidatorRedeemerCampaignFundsAdd: transactionCampaignValidatorRedeemerCampaignFundsAdd },
                        datums: {
                            campaignDatum_In: transactionCampaignDatum_In,
                            campaignDatum_Out: transactionCampaignDatum_Out,
                            campaignFundsDatum_Out: transactionCampaignFundsDatum_Out,
                        },
                        reading_UTxOs: [],
                        consuming_UTxOs: [campaign_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Fund Add Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Fund Add Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Add Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Fund Add Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignFundsMintDepositTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Fund Mint & Deposit Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignFundsMintDepositTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const campaign_SmartUTxO = campaign.smartUTxO;
                if (campaign_SmartUTxO === undefined) {
                    throw `Can't find Campaign UTxO`;
                }
                //--------------------------------------
                const campaign_UTxO = campaign_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getById_<CampaignFundsEntity>(txParams.campaign_funds_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaignFunds === undefined) {
                    throw `Invalid campaign_funds_id id`;
                }
                //--------------------------------------
                const campaignFunds_SmartUTxO = campaignFunds.smartUTxO;
                if (campaignFunds_SmartUTxO === undefined) {
                    throw `Can't find Campaign Funds UTxO`;
                }
                //--------------------------------------
                const campaignFunds_UTxO = campaignFunds_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - campaignFunds_UTxO: ${formatUTxO(campaignFunds_UTxO.txHash, campaignFunds_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignPolicy_CS = campaign.fdpCampaignPolicy_CS;
                const campaignPolicy_Script = campaign.fdpCampaignPolicy_Script;
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                const campaignValidator_Address = campaign.getNet_Address();
                const campaignFundsPolicyID_CS = campaign.fdpCampaignFundsPolicyID_CS;
                const campaignFundsPolicyID_Script = campaign.fdpCampaignFundsPolicyID_Script;
                const campaignFundsValidator_Hash = campaign.fdpCampaignFundsValidator_Hash;
                const campaignFundsValidator_Script = campaign.fdpCampaignFundsValidator_Script;
                const campaignFundsValidator_Address = campaign.getNet_FundHolding_Validator_Address();
                //--------------------------------------
                const campaignTokens_AC_Lucid = campaignPolicy_CS + campaign.cdCampaignToken_TN;
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsDatum_In = campaignFunds.getMyDatum() as CampaignFundsDatum;
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - campaignFundsDatum_In: ${showData(campaignFundsDatum_In, false)}`);
                //--------------------------------------
                const campaignTokensAmount = campaign.cdRequestedMaxADA / campaign.cdCampaignToken_PriceADA;
                //--------------------------------------
                const valueFor_Mint_CampaignTokens: Assets = { [campaignTokens_AC_Lucid]: campaignTokensAmount };
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - valueFor_Mint_CampaignTokens: ${showData(valueFor_Mint_CampaignTokens)}`);
                //--------------------------------------
                const value_Of_CampaignFundsDatum_In = campaignFunds_SmartUTxO.assets;
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - value_Of_CampaignFundsDatum_In: ${showData(value_Of_CampaignFundsDatum_In, false)}`);
                const valueFor_CampaignFundsDatum_Out = addAssetsList([value_Of_CampaignFundsDatum_In, valueFor_Mint_CampaignTokens]);
                console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - valueFor_CampaignFundsDatum_Out: ${showData(valueFor_CampaignFundsDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsDatum_Out = CampaignFundsBackEndApplied.mkUpdated_CampaignFundsDatum_With_Deposit(campaignFundsDatum_In, campaignTokensAmount);
                console_log(0, this._Entity.className(), `Mint & Deposit Tx - campaignFundsDatum_Out: ${showData(campaignFundsDatum_Out, false)}`);
                const campaignFundsDatum_Out_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out);
                console_log(0, this._Entity.className(), `Mint & Deposit Tx - campaignFundsDatum_Out_Hex: ${showData(campaignFundsDatum_Out_Hex, false)}`);
                //--------------------------------------
                const campaignPolicyRedeemerMintCampaignToken = new CampaignPolicyRedeemerMintCampaignToken();
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Mint & Deposit Tx - campaignPolicyRedeemerMintCampaignToken: ${showData(campaignPolicyRedeemerMintCampaignToken, false)}`
                );
                const campaignPolicyRedeemerMintCampaignToken_Hex = campaignPolicyRedeemerMintCampaignToken.toCborHex();
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Mint & Deposit Tx - campaignPolicyRedeemerMintCampaignToken_Hex: ${showData(campaignPolicyRedeemerMintCampaignToken_Hex, false)}`
                );
                //--------------------------------------
                const campaignFundsValidatorRedeemerDeposit = new CampaignFundsValidatorRedeemerDeposit({ amount: campaignTokensAmount });
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Mint & Deposit Tx - campaignFundsValidatorRedeemerDeposit: ${showData(campaignPolicyRedeemerMintCampaignToken, false)}`
                );
                const campaignFundsValidatorRedeemerDeposit_Hex = campaignFundsValidatorRedeemerDeposit.toCborHex();
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Mint & Deposit Tx - campaignFundsValidatorRedeemerDeposit_Hex: ${showData(campaignFundsValidatorRedeemerDeposit_Hex, false)}`
                );
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Mint & Deposit Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIGN_FUNDS_MINT_DEPOSIT,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .readFrom([campaign_UTxO])
                        .mintAssets(valueFor_Mint_CampaignTokens, campaignPolicyRedeemerMintCampaignToken_Hex)
                        .collectFrom([campaignFunds_UTxO], campaignFundsValidatorRedeemerDeposit_Hex)
                        .pay.ToAddressWithData(campaignFundsValidator_Address, { kind: 'inline', value: campaignFundsDatum_Out_Hex }, valueFor_CampaignFundsDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignPolicy = await ScriptBackEndApplied.getByHash(campaignPolicy_CS);
                    if (scriptCampaignPolicy !== undefined) {
                        console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - Using Script as Ref: ${campaignPolicy_CS}`);
                        const smartUTxO = scriptCampaignPolicy.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Script`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - Attaching Script: ${campaignPolicy_CS}`);
                        tx = tx.attach.MintingPolicy(campaignPolicy_Script);
                    }
                    //--------------------------------------
                    const scriptCampaignFundsValidator = await ScriptBackEndApplied.getByHash(campaignFundsValidator_Hash);
                    if (scriptCampaignFundsValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - Using Script as Ref: ${campaignFundsValidator_Hash}`);
                        const smartUTxO = scriptCampaignFundsValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - Attaching Script: ${campaignFundsValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignFundsValidator_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Fund Mint & Deposit Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignPolicyRedeemerMintCampaignToken: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'mint',
                        redeemerObj: campaignPolicyRedeemerMintCampaignToken,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionCampaignFundsValidatorRedeemerDeposit: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignFundsValidatorRedeemerDeposit,
                        unit_mem: resources.redeemers[1]?.MEM,
                        unit_steps: resources.redeemers[1]?.CPU,
                    };
                    const transactionFundsCampaignDatum_In: TransactionDatum = {
                        address: campaignFundsValidator_Address,
                        datumType: CampaignFundsEntity.className(),
                        datumObj: campaignFundsDatum_In,
                    };
                    const transactionCampaignFundsDatum_Out: TransactionDatum = {
                        address: campaignFundsValidator_Address,
                        datumType: CampaignFundsEntity.className(),
                        datumObj: campaignFundsDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id, campaign_funds_id: txParams.campaign_funds_id },
                        redeemers: {
                            campaignPolicyRedeemerMintCampaignToken: transactionCampaignPolicyRedeemerMintCampaignToken,
                            campaignFundsValidatorRedeemerDeposit: transactionCampaignFundsValidatorRedeemerDeposit,
                        },
                        datums: {
                            campaignFundsDatum_In: transactionFundsCampaignDatum_In,
                            campaignFundsDatum_Out: transactionCampaignFundsDatum_Out,
                        },
                        reading_UTxOs: [campaign_UTxO],
                        consuming_UTxOs: [campaignFunds_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Fund Mint & Deposit Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Fund Mint & Deposit Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Add Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Fund Mint & Deposit Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignFundsInvestTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Fund Invest Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignFundsInvestTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Fund Invest Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const campaign_SmartUTxO = campaign.smartUTxO;
                if (campaign_SmartUTxO === undefined) {
                    throw `Can't find Campaign UTxO`;
                }
                //--------------------------------------
                const campaign_UTxO = campaign_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getById_<CampaignFundsEntity>(txParams.campaign_funds_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaignFunds === undefined) {
                    throw `Invalid campaign_funds_id id`;
                }
                //--------------------------------------
                const campaignFunds_SmartUTxO = campaignFunds.smartUTxO;
                if (campaignFunds_SmartUTxO === undefined) {
                    throw `Can't find Campaign Funds UTxO`;
                }
                //--------------------------------------
                const campaignFunds_UTxO = campaignFunds_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaignFunds_UTxO: ${formatUTxO(campaignFunds_UTxO.txHash, campaignFunds_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignPolicy_CS = campaign.fdpCampaignPolicy_CS;
                const campaignPolicy_Script = campaign.fdpCampaignPolicy_Script;
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                const campaignValidator_Address = campaign.getNet_Address();
                const campaignFundsPolicyID_CS = campaign.fdpCampaignFundsPolicyID_CS;
                const campaignFundsPolicyID_Script = campaign.fdpCampaignFundsPolicyID_Script;
                const campaignFundsValidator_Hash = campaign.fdpCampaignFundsValidator_Hash;
                const campaignFundsValidator_Script = campaign.fdpCampaignFundsValidator_Script;
                const campaignFundsValidator_Address = campaign.getNet_FundHolding_Validator_Address();
                //--------------------------------------
                const campaignTokens_AC_Lucid = campaignPolicy_CS + campaign.cdCampaignToken_TN;
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `Fund Invest Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsDatum_In = campaignFunds.getMyDatum() as CampaignFundsDatum;
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaignFundsDatum_In: ${showData(campaignFundsDatum_In, false)}`);
                //--------------------------------------
                const campaignTokensAmountBuyed = BigInt(txParams.amount);
                //--------------------------------------
                const valueFor_Buy_CampaignTokens: Assets = { [campaignTokens_AC_Lucid]: campaignTokensAmountBuyed };
                console_log(0, this._Entity.className(), `Fund Invest Tx - valueFor_Buy_CampaignTokens: ${showData(valueFor_Buy_CampaignTokens)}`);
                //--------------------------------------
                const valueFor_Buy_ADA: Assets = { lovelace: BigInt(Number(campaignTokensAmountBuyed) * (Number(campaign.campaignToken_PriceADA) / 1000000)) };
                console_log(0, this._Entity.className(), `Fund Invest Tx - valueFor_Buy_ADA: ${showData(valueFor_Buy_ADA)}`);
                //--------------------------------------
                const value_Of_CampaignFundsDatum_In = campaignFunds_SmartUTxO.assets;
                console_log(0, this._Entity.className(), `Fund Invest Tx - value_Of_CampaignFundsDatum_In: ${showData(value_Of_CampaignFundsDatum_In, false)}`);
                let valueFor_CampaignFundsDatum_Out = addAssetsList([value_Of_CampaignFundsDatum_In, valueFor_Buy_ADA]);
                valueFor_CampaignFundsDatum_Out = subsAssets(valueFor_CampaignFundsDatum_Out, valueFor_Buy_CampaignTokens);
                console_log(0, this._Entity.className(), `Fund Invest Tx - valueFor_CampaignFundsDatum_Out: ${showData(valueFor_CampaignFundsDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsDatum_Out = CampaignFundsBackEndApplied.mkUpdated_CampaignFundsDatum_Invest(
                    campaignFundsDatum_In,
                    campaignTokensAmountBuyed,
                    valueFor_Buy_ADA.lovelace
                );
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaignFundsDatum_Out: ${showData(campaignFundsDatum_Out, false)}`);
                const campaignFundsDatum_Out_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out);
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaignFundsDatum_Out_Hex: ${showData(campaignFundsDatum_Out_Hex, false)}`);
                //--------------------------------------
                const campaignFundsValidatorRedeemerSell = new CampaignFundsValidatorRedeemerSell({ amount: campaignTokensAmountBuyed });
                const campaignFundsValidatorRedeemerSell_Hex = campaignFundsValidatorRedeemerSell.toCborHex();
                console_log(0, this._Entity.className(), `Fund Invest Tx - campaignFundsValidatorRedeemerSell_Hex: ${showData(campaignFundsValidatorRedeemerSell_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Fund Invest Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIGN_FUNDS_INVEST,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .readFrom([campaign_UTxO])
                        .collectFrom([campaignFunds_UTxO], campaignFundsValidatorRedeemerSell_Hex)
                        .pay.ToAddressWithData(campaignFundsValidator_Address, { kind: 'inline', value: campaignFundsDatum_Out_Hex }, valueFor_CampaignFundsDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignFundsValidator = await ScriptBackEndApplied.getByHash(campaignFundsValidator_Hash);
                    if (scriptCampaignFundsValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Fund Invest Tx - Using Script as Ref: ${campaignFundsValidator_Hash}`);
                        const smartUTxO = scriptCampaignFundsValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Fund Invest Tx - Attaching Script: ${campaignFundsValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignFundsValidator_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Fund Invest Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignFundsValidatorRedeemerDeposit: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignFundsValidatorRedeemerSell,
                        unit_mem: resources.redeemers[1]?.MEM,
                        unit_steps: resources.redeemers[1]?.CPU,
                    };
                    const transactionFundsCampaignDatum_In: TransactionDatum = {
                        address: campaignFundsValidator_Address,
                        datumType: CampaignFundsEntity.className(),
                        datumObj: campaignFundsDatum_In,
                    };
                    const transactionCampaignFundsDatum_Out: TransactionDatum = {
                        address: campaignFundsValidator_Address,
                        datumType: CampaignFundsEntity.className(),
                        datumObj: campaignFundsDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id, campaign_funds_id: txParams.campaign_funds_id },
                        redeemers: {
                            campaignFundsValidatorRedeemerSell: transactionCampaignFundsValidatorRedeemerDeposit,
                        },
                        datums: {
                            campaignFundsDatum_In: transactionFundsCampaignDatum_In,
                            campaignFundsDatum_Out: transactionCampaignFundsDatum_Out,
                        },
                        reading_UTxOs: [campaign_UTxO],
                        consuming_UTxOs: [campaignFunds_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Fund Invest Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Fund Invest Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Add Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Fund Invest Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignLaunchTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Launch Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignLaunchTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Launch Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const campaign_SmartUTxO = campaign.smartUTxO;
                if (campaign_SmartUTxO === undefined) {
                    throw `Can't find Campaign UTxO`;
                }
                //--------------------------------------
                const campaign_UTxO = campaign_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Launch Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getAll_<CampaignFundsEntity>({
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaignFunds.length === 0) {
                    throw `Campaign Funds not found`;
                }
                //--------------------------------------
                const campaignFunds_SmartUTxOs = campaignFunds.map((campaignFunds) => {
                    if (campaignFunds.smartUTxO === undefined) {
                        throw `Can't find Campaign Funds UTxO`;
                    }
                    return campaignFunds.smartUTxO;
                });

                //--------------------------------------
                const campaignFunds_UTxOs = campaignFunds_SmartUTxOs.map((campaignFunds_SmartUTxO) => campaignFunds_SmartUTxO.getUTxO());
                console_log(0, this._Entity.className(), `Fund Launch Tx - campaignFunds_UTxOs: ${campaignFunds_UTxOs.length}`);
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `Launch Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_CampaignDatum_With_Status(campaignDatum_In, CampaignDatumStatus_Code_Id_Enums.CsInitialized);
                console_log(0, this._Entity.className(), `Launch Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `Launch Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `Launch Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerInitializeCampaign = new CampaignValidatorRedeemerInitializeCampaign();
                console_log(
                    0,
                    this._Entity.className(),
                    `Launch Tx - campaignValidatorRedeemerInitializeCampaign: ${showData(campaignValidatorRedeemerInitializeCampaign, false)}`
                );
                const campaignValidatorRedeemerInitializeCampaign_Hex = objToCborHex(campaignValidatorRedeemerInitializeCampaign);
                console_log(
                    0,
                    this._Entity.className(),
                    `Launch Tx - campaignValidatorRedeemerInitializeCampaign_Hex: ${showData(campaignValidatorRedeemerInitializeCampaign_Hex, false)}`
                );
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Launch Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIG_LAUNCH,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .readFrom([protocol_UTxO, ...campaignFunds_UTxOs])
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerInitializeCampaign_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Launch Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Launch Tx - Attaching Script: ${campaignValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignValidator_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Launch Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerInitializeCampaign: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerInitializeCampaign,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionCampaignDatum_In: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_In,
                    };
                    const transactionCampaignDatum_Out: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id },
                        redeemers: { campaignValidatorRedeemerInitializeCampaign: transactionCampaignValidatorRedeemerInitializeCampaign },
                        datums: { campaignDatum_In: transactionCampaignDatum_In, campaignDatum_Out: transactionCampaignDatum_Out },
                        reading_UTxOs: [protocol_UTxO, ...campaignFunds_UTxOs],
                        consuming_UTxOs: [campaign_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Launch Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Launch Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Launch Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Launch Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignReachedTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `CampaingReached Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignCampaingNotReachedTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `CampaingReached Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const campaign_SmartUTxO = campaign.smartUTxO;
                if (campaign_SmartUTxO === undefined) {
                    throw `Can't find Campaign UTxO`;
                }
                //--------------------------------------
                const campaign_UTxO = campaign_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getAll_<CampaignFundsEntity>({
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaignFunds.length === 0) {
                    throw `Campaign Funds not found`;
                }
                //--------------------------------------
                const campaignFunds_SmartUTxOs = campaignFunds.map((campaignFunds) => {
                    if (campaignFunds.smartUTxO === undefined) {
                        throw `Can't find Campaign Funds UTxO`;
                    }
                    return campaignFunds.smartUTxO;
                });

                //--------------------------------------
                const campaignFunds_UTxOs = campaignFunds_SmartUTxOs.map((campaignFunds_SmartUTxO) => campaignFunds_SmartUTxO.getUTxO());
                console_log(0, this._Entity.className(), `Fund CampaingReached Tx - campaignFunds_UTxOs: ${campaignFunds_UTxOs.length}`);
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_CampaignDatum_With_Status(campaignDatum_In, CampaignDatumStatus_Code_Id_Enums.CsNotReached);
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `CampaingReached Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerInitializeCampaign = new CampaignValidatorRedeemerInitializeCampaign();
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingReached Tx - campaignValidatorRedeemerInitializeCampaign: ${showData(campaignValidatorRedeemerInitializeCampaign, false)}`
                );
                const campaignValidatorRedeemerInitializeCampaign_Hex = objToCborHex(campaignValidatorRedeemerInitializeCampaign);
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingReached Tx - campaignValidatorRedeemerInitializeCampaign_Hex: ${showData(campaignValidatorRedeemerInitializeCampaign_Hex, false)}`
                );
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingReached Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIGN_NOT_REACHED,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .readFrom([protocol_UTxO, ...campaignFunds_UTxOs])
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerInitializeCampaign_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `CampaingReached Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `CampaingReached Tx - Attaching Script: ${campaignValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignValidator_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `CampaingReached Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerInitializeCampaign: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerInitializeCampaign,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionCampaignDatum_In: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_In,
                    };
                    const transactionCampaignDatum_Out: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id },
                        redeemers: { campaignValidatorRedeemerInitializeCampaign: transactionCampaignValidatorRedeemerInitializeCampaign },
                        datums: { campaignDatum_In: transactionCampaignDatum_In, campaignDatum_Out: transactionCampaignDatum_Out },
                        reading_UTxOs: [protocol_UTxO, ...campaignFunds_UTxOs],
                        consuming_UTxOs: [campaign_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `CampaingReached Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `CampaingReached Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} CampaingReached Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `CampaingReached Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignNotReachedTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `CampaingNotReached Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignCampaingNotReachedTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const ProtocolBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (protocol_SmartUTxO === undefined) {
                    throw `Can't find Protocol UTxO`;
                }
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                //--------------------------------------
                const campaign = await this._BackEndApplied.getById_<CampaignEntity>(txParams.campaign_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const campaign_SmartUTxO = campaign.smartUTxO;
                if (campaign_SmartUTxO === undefined) {
                    throw `Can't find Campaign UTxO`;
                }
                //--------------------------------------
                const campaign_UTxO = campaign_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getAll_<CampaignFundsEntity>({
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaignFunds.length === 0) {
                    throw `Campaign Funds not found`;
                }
                //--------------------------------------
                const campaignFunds_SmartUTxOs = campaignFunds.map((campaignFunds) => {
                    if (campaignFunds.smartUTxO === undefined) {
                        throw `Can't find Campaign Funds UTxO`;
                    }
                    return campaignFunds.smartUTxO;
                });

                //--------------------------------------
                const campaignFunds_UTxOs = campaignFunds_SmartUTxOs.map((campaignFunds_SmartUTxO) => campaignFunds_SmartUTxO.getUTxO());
                console_log(0, this._Entity.className(), `Fund CampaingNotReached Tx - campaignFunds_UTxOs: ${campaignFunds_UTxOs.length}`);
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_CampaignDatum_With_Status(campaignDatum_In, CampaignDatumStatus_Code_Id_Enums.CsReached);
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerInitializeCampaign = new CampaignValidatorRedeemerInitializeCampaign();
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingNotReached Tx - campaignValidatorRedeemerInitializeCampaign: ${showData(campaignValidatorRedeemerInitializeCampaign, false)}`
                );
                const campaignValidatorRedeemerInitializeCampaign_Hex = objToCborHex(campaignValidatorRedeemerInitializeCampaign);
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingNotReached Tx - campaignValidatorRedeemerInitializeCampaign_Hex: ${showData(campaignValidatorRedeemerInitializeCampaign_Hex, false)}`
                );
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingNotReached Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.CAMPAIGN_REACHED,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .readFrom([protocol_UTxO, ...campaignFunds_UTxOs])
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerInitializeCampaign_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `CampaingNotReached Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `CampaingNotReached Tx - Attaching Script: ${campaignValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignValidator_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `CampaingNotReached Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerInitializeCampaign: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerInitializeCampaign,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionCampaignDatum_In: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_In,
                    };
                    const transactionCampaignDatum_Out: TransactionDatum = {
                        address: campaignValidator_Address,
                        datumType: CampaignEntity.className(),
                        datumObj: campaignDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { campaign_id: campaign._DB_id },
                        redeemers: { campaignValidatorRedeemerInitializeCampaign: transactionCampaignValidatorRedeemerInitializeCampaign },
                        datums: { campaignDatum_In: transactionCampaignDatum_In, campaignDatum_Out: transactionCampaignDatum_Out },
                        reading_UTxOs: [protocol_UTxO, ...campaignFunds_UTxOs],
                        consuming_UTxOs: [campaign_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `CampaingNotReached Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `CampaingNotReached Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} CampaingNotReached Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `CampaingNotReached Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }
    // #endregion transactions
    // #endregion custom api handlers
}
