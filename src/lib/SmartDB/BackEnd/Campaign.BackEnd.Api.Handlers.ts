import { CAMPAIGN_FUNDSID_TN_Str_basename, CAMPAIGN_VERSION, TxEnums } from '@/utils/constants/on-chain';
import {
    CampaignDatumStatus_Code_Id_Enums,
    CampaignStatus_Code_Id_Enums,
    MilestoneDatumStatus_Code_Id_Enums,
    MilestoneStatus_Code_Id_Enums,
} from '@/utils/constants/status/status';
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
    CampaignFundsCollectTxParams,
    CampaignFundsGetBackTxParams,
    CampaignFundsInvestTxParams,
    CampaignFundsMintDepositTxParams,
    CampaignLaunchTxParams,
} from '../Commons/Params';
import { CampaignFundsDatum, CampaignFundsEntity, CampaignMemberEntity, CampaignStatusEntity, MilestoneEntity, MilestoneStatusEntity, ProtocolEntity } from '../Entities';
import { CampaignDatum, CampaignEntity, CampaignMilestoneDatum } from '../Entities/Campaign.Entity';
import {
    CampaignPolicyRedeemerMintCampaignToken,
    CampaignPolicyRedeemerMintID,
    CampaignValidatorRedeemerFundsAdd,
    CampaignValidatorRedeemerFundsCollect,
    CampaignValidatorRedeemerInitializeCampaign,
    CampaignValidatorRedeemerMilestoneApprove,
    CampaignValidatorRedeemerMilestoneFail,
    CampaignValidatorRedeemerNotReachedCampaign,
    CampaignValidatorRedeemerReachedCampaign,
} from '../Entities/Redeemers/Campaign.Redeemer';
import { CampaignMemberBackEndApplied } from './CampaignMember.BackEnd.Api.Handlers';
import { CampaignStatusBackEndApplied } from './CampaignStatus.BackEnd.Api.Handlers';
import { MilestoneBackEndApplied } from './Milestone.BackEnd.Api.Handlers';
import { ScriptBackEndApplied } from './Script.BackEnd.Api.Handlers';
import { CampaignFundsBackEndApplied } from './CampaignFunds.BackEnd.Api.Handlers';
import {
    CampaignFundsPolicyRedeemerMintID,
    CampaignFundsValidatorRedeemerCollect,
    CampaignFundsValidatorRedeemerDeposit,
    CampaignFundsValidatorRedeemerGetBack,
    CampaignFundsValidatorRedeemerSell,
} from '../Entities/Redeemers/CampaignFunds.Redeemer';
import { MilestoneStatusBackEndApplied } from './MilestoneStatus.BackEnd.Api.Handlers';

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
        mindAda: bigint
    ): CampaignDatum {
        //-----------------------------------
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos
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
            cdBegin_at: BigInt(txParams.beginAt),
            cdDeadline: BigInt(txParams.deadline),
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

    public static mkUpdated_CampaignDatum_With_Status_And_TokensSold(capaignDatum_In: CampaignDatum, status: CampaignDatumStatus_Code_Id_Enums, tokensSold: BigInt): CampaignDatum {
        const datumPlainObject: CampaignDatum = {
            ...JSON.parse(toJson(capaignDatum_In)),
            cdFundedADA: tokensSold,
            cdStatus: status,
        };
        let datum: CampaignDatum = CampaignEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignDatum;
        this.sortDatum(datum);
        return datum;
    }

    public static mkUpdated_Campaign_Datum_With_MilestoneApproved(capaignDatum_In: CampaignDatum, milestoneIndex: number): CampaignDatum {
        const datumPlainObject: CampaignDatum = {
            ...JSON.parse(toJson(capaignDatum_In)),
            cdMilestones: capaignDatum_In.cdMilestones.map((milestone, index) =>
                index === milestoneIndex ? { ...milestone, cmStatus: MilestoneDatumStatus_Code_Id_Enums.MsSuccess } : milestone
            ),
        };
        let datum: CampaignDatum = CampaignEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignDatum;
        this.sortDatum(datum);
        return datum;
    }

    public static mkUpdated_Campaign_Datum_With_MilestoneFailed(capaignDatum_In: CampaignDatum, milestoneIndex: number): CampaignDatum {
        const datumPlainObject: CampaignDatum = {
            ...JSON.parse(toJson(capaignDatum_In)),
            cdMilestones: capaignDatum_In.cdMilestones.map((milestone, index) =>
                index === milestoneIndex ? { ...milestone, cmStatus: MilestoneDatumStatus_Code_Id_Enums.MsFailed } : milestone
            ),
            cdStatus: CampaignDatumStatus_Code_Id_Enums.CsFailedMilestone,
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
    public static mkUpdated_CampaignDatum_Collect(campaignDatum_In: CampaignDatum, amountADAToCollect: bigint): CampaignDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: CampaignDatum = {
            ...JSON.parse(toJson(campaignDatum_In)),
            cdCollectedADA: campaignDatum_In.cdCollectedADA + amountADAToCollect,
        };

        let datum: CampaignDatum = CampaignEntity.mkDatumFromPlainObject(datumPlainObject) as CampaignDatum;

        return datum;
    }

    // #endregion class methods

    // #region callbacks

    public static async callbackOnAfterLoad<T extends BaseEntity>(instance: T, cascadeUpdate: CascadeUpdate): Promise<CascadeUpdate> {
        //--------------------------------------
        console_log(1, this._Entity.className(), `callbackOnAfterLoad - INIT | instance: ${toJson(instance)}, cascadeUpdate: ${toJson(cascadeUpdate)}`);
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
            fundedADA: campaignInstance.fundedADA,
            collectedADA: campaignInstance.collectedADA,
            visualizations: campaignInstance.visualizations,
        };
        console_log(0, instance.className(), `callbackOnAfterLoad - prev values: ${toJson(prev)}`);
        //--------------------------------------
        const visualizations = campaignInstance.visualizations + 1;
        campaignInstance.visualizations = visualizations;
        console_log(0, instance.className(), `callbackOnAfterLoad - visualizations incremented: ${visualizations}`);
        //--------------------------------------
        // 🔹 AUTO-FILL DE TOKEN_CS SI APLICA
        if (campaignInstance.mint_CampaignToken === true && isNullOrBlank(campaignInstance.campaignToken_CS) && !isNullOrBlank(campaignInstance.getNET_id_CS())) {
            campaignInstance.campaignToken_CS = campaignInstance.getNET_id_CS();
            console_log(0, instance.className(), `callbackOnAfterLoad - AUTO-FILL campaignToken_CS: ${campaignInstance.campaignToken_CS}`);
        }
        //--------------------------------------
        if (
            campaignInstance.requestedMaxADA > 0n &&
            campaignInstance.tokenomics_for_campaign > 0n &&
            (campaignInstance.campaignToken_PriceADA === undefined || campaignInstance.campaignToken_PriceADA <= 0n)
        ) {
            const newPrice = Number(campaignInstance.requestedMaxADA * 1000000n) / Number(campaignInstance.tokenomics_for_campaign);
            const validPrice = Number(campaignInstance.requestedMaxADA * 1000000n) % Number(campaignInstance.tokenomics_for_campaign) === 0;
            console_log(0, instance.className(), `callbackOnAfterLoad - Calculating campaignToken_PriceADA | newPrice: ${newPrice}, validPrice: ${validPrice}`);
            if (validPrice) {
                campaignInstance.campaignToken_PriceADA = BigInt(newPrice);
                console_log(0, instance.className(), `callbackOnAfterLoad - Set campaignToken_PriceADA: ${campaignInstance.campaignToken_PriceADA}`);
            } else {
                campaignInstance.campaignToken_PriceADA = 0n;
                console_log(0, instance.className(), `callbackOnAfterLoad - Set campaignToken_PriceADA to 0n (invalid price)`);
            }
        }
        //--------------------------------------
        // 🔹 ACTUALIZACIÓN INFERIDA POR FECHAS
        if (campaignInstance._isDeployed === true) {
            console_log(0, instance.className(), `callbackOnAfterLoad - Entrando a bloque _isDeployed === true`);
            const serverTime = await TimeBackEnd.getServerTime();
            const begin_at = campaignInstance.cdBegin_at;
            const deadline = campaignInstance.cdDeadline;
            const statusDatum = campaignInstance.cdStatus;
            //------------------------------------------------------
            let status_id = campaignInstance.campaign_status_id;
            const statusInstanceCurrent: CampaignStatusEntity | undefined = await CampaignStatusBackEndApplied.getOneByParams_({ _id: status_id });
            if (!statusInstanceCurrent) {
                throw new Error(`Status not found for _id: ${status_id}`);
            }
            //------------------------------------------------------
            console_log(
                0,
                instance.className(),
                `callbackOnAfterLoad - _isDeployed TRUE | serverTime: ${serverTime}, begin_at: ${begin_at}, deadline: ${deadline}, statusDatum: ${statusDatum}, statusDB: ${statusInstanceCurrent.name}`
            );
            const campaignFunds = await CampaignFundsBackEndApplied.getByParams_<CampaignFundsEntity>(
                { cfdCampaignPolicy_CS: campaignInstance.getNET_id_CS() },
                {
                    fieldsForSelect: {},
                }
            );
            console_log(0, instance.className(), `callbackOnAfterLoad - campaignFunds: ${toJson(campaignFunds)}`);
            const fundedADA = campaignFunds.reduce((acc, campaignFund) => {
                return acc + BigInt(Math.round(Number(campaignFund.cfdSubtotal_Avalaible_ADA + campaignFund.cfdSubtotal_Collected_ADA) / 1000000));
            }, BigInt(0));
            const collectedADA = campaignFunds.reduce((acc, campaignFund) => {
                return acc + BigInt(Math.round(Number(campaignFund.cfdSubtotal_Collected_ADA) / 1000000));
            }, BigInt(0));
            console_log(0, instance.className(), `callbackOnAfterLoad - fundedADA: ${fundedADA}, collectedADA: ${collectedADA}`);
            //------------------------------------------------------
            if (statusDatum === CampaignDatumStatus_Code_Id_Enums.CsCreated) {
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDatum: CsCreated`);
                const statusInstanceCONTRACT_CREATED = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.CONTRACT_CREATED });
                const statusInstanceCONTRACT_STARTED = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.CONTRACT_STARTED });
                if (!statusInstanceCONTRACT_CREATED || !statusInstanceCONTRACT_STARTED) {
                    throw `Status ${CampaignStatus_Code_Id_Enums.CONTRACT_CREATED} or ${CampaignStatus_Code_Id_Enums.CONTRACT_STARTED} not found`;
                }
                if (campaignInstance.campaign_status_id === statusInstanceCONTRACT_CREATED._DB_id) {
                    console_log(0, instance.className(), `callbackOnAfterLoad - Status DB set to CONTRACT_STARTED`);
                    status_id = statusInstanceCONTRACT_STARTED._DB_id;
                }
            } else if (statusDatum === CampaignDatumStatus_Code_Id_Enums.CsInitialized) {
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDatum: CsInitialized`);
                if (serverTime > BigInt(begin_at) && serverTime < BigInt(deadline)) {
                    const statusInstanceFUNDRAISING = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.FUNDRAISING });
                    if (!statusInstanceFUNDRAISING) {
                        throw new Error(`Status not found for code_id: ${CampaignStatus_Code_Id_Enums.FUNDRAISING}`);
                    }
                    console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to FUNDRAISING`);
                    status_id = statusInstanceFUNDRAISING._DB_id;
                } else if (serverTime > BigInt(deadline)) {
                    const statusInstance = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.FINISHING });
                    if (!statusInstance) {
                        throw new Error(`Status not found for code_id: ${CampaignStatus_Code_Id_Enums.FINISHING}`);
                    }
                    console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to FINISHING`);
                    status_id = statusInstance._DB_id;
                } else {
                    const statusInstance = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.COUNTDOWN });
                    if (statusInstance) status_id = statusInstance._DB_id;
                    console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to COUNTDOWN`);
                }
            } else if (statusDatum === CampaignDatumStatus_Code_Id_Enums.CsReached) {
                //---------------------------------
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDatum: CsReached`);
                //---------------------------------
                const MilestoneBackEndApplied = (await import('./Milestone.BackEnd.Api.Handlers')).MilestoneBackEndApplied;
                const milestones: MilestoneEntity[] = await MilestoneBackEndApplied.getByParams_({ campaign_id: campaignInstance._DB_id }, { sort: { order: 1 } });
                //---------------------------------
                const milestoneStatusNOT_STARTED = await MilestoneStatusBackEndApplied.getOneByParams_({ code_id: MilestoneStatus_Code_Id_Enums.NOT_STARTED });
                const milestoneStatusSTARTED = await MilestoneStatusBackEndApplied.getOneByParams_({ code_id: MilestoneStatus_Code_Id_Enums.STARTED });
                const milestoneStatusCOLLECT = await MilestoneStatusBackEndApplied.getOneByParams_({ code_id: MilestoneStatus_Code_Id_Enums.COLLECT });
                const milestoneStatusFINISHED = await MilestoneStatusBackEndApplied.getOneByParams_({ code_id: MilestoneStatus_Code_Id_Enums.FINISHED });
                const milestoneStatusFAILED = await MilestoneStatusBackEndApplied.getOneByParams_({ code_id: MilestoneStatus_Code_Id_Enums.FAILED });
                //---------------------------------
                if (!milestoneStatusNOT_STARTED || !milestoneStatusSTARTED || !milestoneStatusFINISHED || !milestoneStatusCOLLECT || !milestoneStatusFAILED) {
                    throw new Error(`Milestone status not found`);
                }
                //---------------------------------
                if (milestones?.length) {
                    // 🔹 ACTUALIZACIÓN DE MILESTONES POR STATUS INFERIDO
                    console_log(0, instance.className(), `callbackOnAfterLoad - Actualizando milestones por status inferido. Total: ${campaignInstance.cdMilestones.length}`);
                    for (let i = 0; i < campaignInstance.cdMilestones.length; i++) {
                        const datumMilestone = campaignInstance.cdMilestones[i];
                        const statusMilestoneDatum = datumMilestone.cmStatus;
                        const statusMiestoneDatumStr = MilestoneDatumStatus_Code_Id_Enums[statusMilestoneDatum];
                        const dbMilestone = milestones[i];
                        let milestone_status_id = dbMilestone.milestone_status_id;
                        const statusMilestoneDBCurrent: MilestoneStatusEntity | undefined = await MilestoneStatusBackEndApplied.getOneByParams_({ _id: milestone_status_id });
                        if (!statusMilestoneDBCurrent) {
                            throw new Error(`Milestone status not found`);
                        }
                        console_log(
                            0,
                            instance.className(),
                            `callbackOnAfterLoad - Revisando milestone[${i}] | statusMilestoneDatum: ${statusMiestoneDatumStr} | statusMilestoneDB: ${statusMilestoneDBCurrent.name}`
                        );

                        const statusIsManual = [MilestoneStatus_Code_Id_Enums.SUBMITTED, MilestoneStatus_Code_Id_Enums.REJECTED, MilestoneStatus_Code_Id_Enums.COLLECT].includes(
                            statusMilestoneDBCurrent.code_id
                        );

                        if (statusIsManual) {
                            console_log(0, instance.className(), `callbackOnAfterLoad - milestone[${i}] | statusDB Is Manual | SKIP`);
                            continue;
                        }

                        const previousAllFinished = campaignInstance.cdMilestones
                            .slice(0, i)
                            .every(
                                (m, idx) => m.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsSuccess && milestones[idx]?.milestone_status_id === milestoneStatusFINISHED._DB_id
                            );

                        console_log(0, instance.className(), `callbackOnAfterLoad - milestone[${i}] | previousAllFinished: ${previousAllFinished} (MsSuccess and FINISHED)`);

                        let newMilestoneStatus_id: string | undefined = undefined;

                        if (
                            datumMilestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsCreated &&
                            dbMilestone.milestone_status_id === milestoneStatusNOT_STARTED._DB_id &&
                            previousAllFinished
                        ) {
                            console_log(0, instance.className(), `callbackOnAfterLoad - milestone[${i}] | statusMilestoneDatum: MsCreated | statusMilestoneDB set to STARTED`);
                            newMilestoneStatus_id = milestoneStatusSTARTED._DB_id;
                        } else if (
                            datumMilestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsSuccess &&
                            dbMilestone.milestone_status_id === milestoneStatusCOLLECT._DB_id &&
                            previousAllFinished
                        ) {
                            console_log(0, instance.className(), `callbackOnAfterLoad - milestone[${i}] | statusMilestoneDatum: MsSuccess | statusMilestoneDB set to FINISHED`);
                            newMilestoneStatus_id = milestoneStatusFINISHED._DB_id;
                        } else if (
                            datumMilestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsFailed &&
                            dbMilestone.milestone_status_id === milestoneStatusCOLLECT._DB_id &&
                            previousAllFinished
                        ) {
                            console_log(0, instance.className(), `callbackOnAfterLoad - milestone[${i}] | statusMilestoneDatum: MsFailed | statusMilestoneDB set to FAILED`);
                            newMilestoneStatus_id = milestoneStatusFAILED._DB_id;
                        }

                        if (newMilestoneStatus_id !== undefined && newMilestoneStatus_id !== milestone_status_id) {
                            console_log(0, 'MilestoneSync', `Milestone[${i}] | statusMilestoneDB updated: from ${milestone_status_id} to ${newMilestoneStatus_id}`);
                            dbMilestone.milestone_status_id = newMilestoneStatus_id;
                            await MilestoneBackEndApplied.update(dbMilestone);
                            console_log(0, instance.className(), `callbackOnAfterLoad - milestone[${i}] actualizado en base de datos`);
                        }
                    }
                }
                //---------------------------------
                const isMilestonesStatusDatumFailed = campaignInstance.cdMilestones.some((milestone) => milestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsFailed);
                const isMilestonesStatusDatumAllSuccess = campaignInstance.cdMilestones.every((milestone) => milestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsSuccess);
                const isMilestonesStatusDBAllSuccess = milestones.every((milestone) => milestone.milestone_status_id === milestoneStatusFINISHED._DB_id);
                //---------------------------------
                console_log(
                    0,
                    instance.className(),
                    `callbackOnAfterLoad - isMilestonesStatusDatumFailed: ${isMilestonesStatusDatumFailed}, isMilestonesStatusDatumAllSuccess: ${isMilestonesStatusDatumAllSuccess}, isMilestonesStatusDBAllSuccess: ${isMilestonesStatusDBAllSuccess}`
                );
                //---------------------------------
                if (isMilestonesStatusDatumFailed) {
                    const statusInstanceFAILED = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.FAILED });
                    if (!statusInstanceFAILED) {
                        throw `Status ${CampaignStatus_Code_Id_Enums.FAILED} not found`;
                    }
                    console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to FAILED`);
                    status_id = statusInstanceFAILED._DB_id;
                } else if (isMilestonesStatusDatumAllSuccess && isMilestonesStatusDBAllSuccess) {
                    const statusInstanceSUCCESS = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.SUCCESS });
                    if (!statusInstanceSUCCESS) {
                        throw `Status ${CampaignStatus_Code_Id_Enums.SUCCESS} not found`;
                    }
                    console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to SUCCESS`);
                    status_id = statusInstanceSUCCESS._DB_id;
                } else {
                    const statusInstanceACTIVE = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.ACTIVE });
                    if (!statusInstanceACTIVE) {
                        throw `Status ${CampaignStatus_Code_Id_Enums.ACTIVE} not found`;
                    }
                    console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to ACTIVE`);
                    status_id = statusInstanceACTIVE._DB_id;
                }
            } else if (statusDatum === CampaignDatumStatus_Code_Id_Enums.CsNotReached) {
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDatum: CsNotReached`);
                const statusInstanceUNREACHED = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.UNREACHED });
                if (!statusInstanceUNREACHED) {
                    throw `Status ${CampaignStatus_Code_Id_Enums.UNREACHED} not found`;
                }
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to UNREACHED`);
                status_id = statusInstanceUNREACHED._DB_id;
            } else if (statusDatum === CampaignDatumStatus_Code_Id_Enums.CsFailedMilestone) {
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDatum: CsFailedMilestone`);
                const statusInstanceFAILED = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: CampaignStatus_Code_Id_Enums.FAILED });
                if (!statusInstanceFAILED) {
                    throw `Status ${CampaignStatus_Code_Id_Enums.FAILED} not found`;
                }
                console_log(0, instance.className(), `callbackOnAfterLoad - statusDB set to FAILED`);
                status_id = statusInstanceFAILED._DB_id;
            }

            campaignInstance.begin_at = new Date(Number(begin_at.toString()));
            campaignInstance.deadline = new Date(Number(deadline.toString()));
            campaignInstance.campaignToken_PriceADA = BigInt(campaignInstance.cdCampaignToken_PriceADA.toString());
            campaignInstance.campaign_status_id = status_id;
            campaignInstance.fundedADA = fundedADA;
            campaignInstance.collectedADA = collectedADA;
        }

        //--------------------------------------
        // CAMPOS POSTERIORES A TODAS LAS ACTUALIZACIONES
        console_log(0, instance.className(), `callbackOnAfterLoad - Fin de bloque de actualizaciones. Estado actual de campaignInstance: ${toJson(campaignInstance)}`);
        const current = {
            begin_at: campaignInstance.begin_at,
            deadline: campaignInstance.deadline,
            campaign_status_id: campaignInstance.campaign_status_id,
            campaignToken_CS: campaignInstance.campaignToken_CS,
            campaignToken_PriceADA: campaignInstance.campaignToken_PriceADA,
            fundedADA: campaignInstance.fundedADA,
            collectedADA: campaignInstance.collectedADA,
            visualizations: campaignInstance.visualizations,
        };

        //--------------------------------------
        // DIFERENCIAS DETECTADAS
        let updatedFields = {};
        let swUpdateValues = false;
        Object.entries(prev).forEach(([key, value]) => {
            const newValue = (current as any)[key];
            if (value instanceof Date && newValue instanceof Date && value.toISOString() === newValue.toISOString()) {
                return;
            }
            if (
                (value instanceof Date && typeof newValue === 'string' && value.toISOString() === newValue) ||
                (newValue instanceof Date && typeof value === 'string' && newValue.toISOString() === value)
            ) {
                return;
            }
            if (newValue !== value) {
                (updatedFields as any)[key] = { from: value, to: newValue };
                swUpdateValues = true;
            }
        });
        if (swUpdateValues) {
            console_log(0, instance.className(), `callbackOnAfterLoad - Se detectaron diferencias en los campos. updatedFields: ${toJson(updatedFields)}`);
            cascadeUpdate = { swUpdate: true, updatedFields };
        }
        //--------------------------------------
        console_log(
            -1,
            this._Entity.className(),
            `callbackOnAfterLoad  - OK | Estado final campaignInstance: ${toJson(campaignInstance)}, cascadeUpdate: ${toJson(cascadeUpdate)}`
        );
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
                    if (query[1] === 'campaign-deploy-tx') {
                        return await this.campaignDeployTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-launch-tx') {
                        return await this.campaignLaunchTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-fund-add-tx') {
                        return await this.campaignFundsAddTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-fund-mint-deposit-tx') {
                        return await this.campaignFundsMintDepositTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-invest-tx') {
                        return await this.campaignInvestTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-reached-tx') {
                        return await this.campaignReachedTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-not-reached-tx') {
                        return await this.campaignNotReachedTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-milestone-approve-tx') {
                        return await this.campaignMilestoneApproveTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-milestone-fail-tx') {
                        return await this.campaignMilestoneFailTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-collect-tx') {
                        return await this.campaignCollectTxApiHandler(req, res);
                    } else if (query[1] === 'campaign-get-back-tx') {
                        return await this.campaignGetBackTxApiHandler(req, res);
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
                const members = await CampaignMemberBackEndApplied.getByParams_<CampaignMemberEntity>({ campaign_id: campaign._DB_id, admin: true }, { sort: { order: 1 } });
                //--------------------------------------
                if (members.length === 0) {
                    throw `Must set at least one admin member`;
                }
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
                const campaignDatum_Out_ForCalcMinADA = this._BackEndApplied.mkNew_CampaignDatum(campaign, milestones, members, txParams, 0n);
                const campaignDatum_Out_Hex_ForCalcMinADA = CampaignEntity.datumToCborHex(campaignDatum_Out_ForCalcMinADA);
                //--------------------------------------
                let valueFor_CampaignDatum_Out: Assets = valueFor_Mint_CampaignID;
                const minADA_For_CampaignDatum = calculateMinAdaOfUTxO({ datum: campaignDatum_Out_Hex_ForCalcMinADA, assets: valueFor_CampaignDatum_Out });
                const value_MinAda_For_CampaignDatum: Assets = { lovelace: minADA_For_CampaignDatum };
                valueFor_CampaignDatum_Out = addAssetsList([value_MinAda_For_CampaignDatum, valueFor_CampaignDatum_Out]);
                console_log(0, this._Entity.className(), `Deploy Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkNew_CampaignDatum(campaign, milestones, members, txParams, minADA_For_CampaignDatum);
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
                        type: TxEnums.CAMPAIGN_DEPLOY,
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
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Mint & Deposit Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Fund Mint & Deposit Tx - Error: Method not allowed`);
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
                const campaignFunds = await CampaignFundsBackEndApplied.getByParams_<CampaignFundsEntity>(
                    { cfdCampaignPolicy_CS: campaign.getNET_id_CS() },
                    {
                        ...optionsGetMinimalWithSmartUTxOCompleteFields,
                        fieldsForSelect: {},
                    }
                );
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
                        type: TxEnums.CAMPAIGN_LAUNCH,
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

    public static async campaignInvestTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Invest Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignFundsInvestTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Invest Tx - txParams: ${showData(txParams)}`);
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
                console_log(0, this._Entity.className(), `Invest Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
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
                console_log(0, this._Entity.className(), `Invest Tx - campaignFunds_UTxO: ${formatUTxO(campaignFunds_UTxO.txHash, campaignFunds_UTxO.outputIndex)}`);
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
                const campaignTokensAmountBuyed = BigInt(Math.round(Number(txParams.amount)));
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `Invest Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `Invest Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsDatum_In = campaignFunds.getMyDatum() as CampaignFundsDatum;
                console_log(0, this._Entity.className(), `Invest Tx - campaignFundsDatum_In: ${showData(campaignFundsDatum_In, false)}`);
                const campaignFundsDatum_In_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_In);
                console_log(0, this._Entity.className(), `Invest Tx - campaignFundsDatum_In_Hex: ${showData(campaignFundsDatum_In_Hex, false)}`);
                //--------------------------------------
                const valueFor_Buy_CampaignTokens: Assets = { [campaignTokens_AC_Lucid]: campaignTokensAmountBuyed };
                console_log(0, this._Entity.className(), `Invest Tx - valueFor_Buy_CampaignTokens: ${showData(valueFor_Buy_CampaignTokens)}`);
                //--------------------------------------
                const valueFor_Buy_ADA: Assets = { lovelace: BigInt(Number(campaignTokensAmountBuyed) * Number(campaign.campaignToken_PriceADA)) };
                console_log(0, this._Entity.className(), `Invest Tx - valueFor_Buy_ADA: ${showData(valueFor_Buy_ADA)}`);
                //--------------------------------------
                const value_Of_CampaignFundsDatum_In = campaignFunds_SmartUTxO.assets;
                console_log(0, this._Entity.className(), `Invest Tx - value_Of_CampaignFundsDatum_In: ${showData(value_Of_CampaignFundsDatum_In, false)}`);
                let valueFor_CampaignFundsDatum_Out = addAssetsList([value_Of_CampaignFundsDatum_In, valueFor_Buy_ADA]);
                valueFor_CampaignFundsDatum_Out = subsAssets(valueFor_CampaignFundsDatum_Out, valueFor_Buy_CampaignTokens);
                console_log(0, this._Entity.className(), `Invest Tx - valueFor_CampaignFundsDatum_Out: ${showData(valueFor_CampaignFundsDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsDatum_Out = CampaignFundsBackEndApplied.mkUpdated_CampaignFundsDatum_Invest(
                    campaignFundsDatum_In,
                    campaignTokensAmountBuyed,
                    valueFor_Buy_ADA.lovelace
                );
                console_log(0, this._Entity.className(), `Invest Tx - campaignFundsDatum_Out: ${showData(campaignFundsDatum_Out, false)}`);
                const campaignFundsDatum_Out_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out);
                console_log(0, this._Entity.className(), `Invest Tx - campaignFundsDatum_Out_Hex: ${showData(campaignFundsDatum_Out_Hex, false)}`);
                //--------------------------------------
                const campaignFundsValidatorRedeemerSell = new CampaignFundsValidatorRedeemerSell({ amount: campaignTokensAmountBuyed });
                const campaignFundsValidatorRedeemerSell_Hex = campaignFundsValidatorRedeemerSell.toCborHex();
                console_log(0, this._Entity.className(), `Invest Tx - campaignFundsValidatorRedeemerSell_Hex: ${showData(campaignFundsValidatorRedeemerSell_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Invest Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
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
                        console_log(0, this._Entity.className(), `Invest Tx - Using Script as Ref: ${campaignFundsValidator_Hash}`);
                        const smartUTxO = scriptCampaignFundsValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Invest Tx - Attaching Script: ${campaignFundsValidator_Hash}`);
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
                    console_log(0, this._Entity.className(), `Invest Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
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
                    console_log(-1, this._Entity.className(), `Invest Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Invest Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Invest Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Invest Tx - Error: Method not allowed`);
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
                const campaignFunds = await CampaignFundsBackEndApplied.getByParams_<CampaignFundsEntity>(
                    { cfdCampaignPolicy_CS: campaign.getNET_id_CS() },
                    {
                        ...optionsGetMinimalWithSmartUTxOCompleteFields,
                        fieldsForSelect: {},
                    }
                );
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
                const sumAvalaibleADA = campaignFunds.reduce((acc, campaignFund) => {
                    return acc + BigInt(campaignFund.cfdSubtotal_Avalaible_ADA);
                }, BigInt(0));
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_CampaignDatum_With_Status_And_TokensSold(
                    campaignDatum_In,
                    CampaignDatumStatus_Code_Id_Enums.CsReached,
                    sumAvalaibleADA
                );
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `CampaingReached Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `CampaingReached Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerReachedCampaign = new CampaignValidatorRedeemerReachedCampaign();
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingReached Tx - campaignValidatorRedeemerReachedCampaign: ${showData(campaignValidatorRedeemerReachedCampaign, false)}`
                );
                const campaignValidatorRedeemerReachedCampaign_Hex = objToCborHex(campaignValidatorRedeemerReachedCampaign);
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingReached Tx - campaignValidatorRedeemerReachedCampaign_Hex: ${showData(campaignValidatorRedeemerReachedCampaign_Hex, false)}`
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
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerReachedCampaign_Hex)
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
                    const transactionCampaignValidatorRedeemerReachedCampaign: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerReachedCampaign,
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
                        redeemers: { campaignValidatorRedeemerReachedCampaign: transactionCampaignValidatorRedeemerReachedCampaign },
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
                const campaignFunds = await CampaignFundsBackEndApplied.getByParams_<CampaignFundsEntity>(
                    { cfdCampaignPolicy_CS: campaign.getNET_id_CS() },
                    {
                        ...optionsGetMinimalWithSmartUTxOCompleteFields,
                        fieldsForSelect: {},
                    }
                );
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
                const sumAvalaibleADA = campaignFunds.reduce((acc, campaignFund) => {
                    return acc + BigInt(campaignFund.cfdSubtotal_Avalaible_ADA);
                }, BigInt(0));
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_CampaignDatum_With_Status_And_TokensSold(
                    campaignDatum_In,
                    CampaignDatumStatus_Code_Id_Enums.CsNotReached,
                    sumAvalaibleADA
                );
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `CampaingNotReached Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerNotReachedCampaign = new CampaignValidatorRedeemerNotReachedCampaign();
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingNotReached Tx - campaignValidatorRedeemerNotReachedCampaign: ${showData(campaignValidatorRedeemerNotReachedCampaign, false)}`
                );
                const campaignValidatorRedeemerNotReachedCampaign_Hex = objToCborHex(campaignValidatorRedeemerNotReachedCampaign);
                console_log(
                    0,
                    this._Entity.className(),
                    `CampaingNotReached Tx - campaignValidatorRedeemerNotReachedCampaign_Hex: ${showData(campaignValidatorRedeemerNotReachedCampaign_Hex, false)}`
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
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerNotReachedCampaign_Hex)
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
                    const transactionCampaignValidatorRedeemerNotReachedCampaign: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerNotReachedCampaign,
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
                        redeemers: { campaignValidatorRedeemerNotReachedCampaign: transactionCampaignValidatorRedeemerNotReachedCampaign },
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

    public static async campaignMilestoneApproveTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `MilestoneApprove Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignCampaingNotReachedTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - txParams: ${showData(txParams)}`);
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
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getByParams_<CampaignFundsEntity>(
                    { cfdCampaignPolicy_CS: campaign.getNET_id_CS() },
                    {
                        ...optionsGetMinimalWithSmartUTxOCompleteFields,
                        fieldsForSelect: {},
                    }
                );
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
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - campaignFunds_UTxOs: ${campaignFunds_UTxOs.length}`);
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const currentMilestone = campaign.getCurrentMilestoneDatumIndex();
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_Campaign_Datum_With_MilestoneApproved(campaignDatum_In, currentMilestone);
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `MilestoneApprove Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerMilestoneApprove = new CampaignValidatorRedeemerMilestoneApprove({ milestoneIndex: currentMilestone });
                console_log(
                    0,
                    this._Entity.className(),
                    `MilestoneApprove Tx - campaignValidatorRedeemerMilestoneApprove: ${showData(campaignValidatorRedeemerMilestoneApprove, false)}`
                );
                const campaignValidatorRedeemerMilestoneApprove_Hex = objToCborHex(campaignValidatorRedeemerMilestoneApprove);
                console_log(
                    0,
                    this._Entity.className(),
                    `MilestoneApprove Tx - campaignValidatorRedeemerMilestoneApprove_Hex: ${showData(campaignValidatorRedeemerMilestoneApprove_Hex, false)}`
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
                    `MilestoneApprove Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
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
                        type: TxEnums.CAMPAIGN_MILESTONE_APPROVE,
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
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerMilestoneApprove_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `MilestoneApprove Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `MilestoneApprove Tx - Attaching Script: ${campaignValidator_Hash}`);
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
                    console_log(0, this._Entity.className(), `MilestoneApprove Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerMilestoneApprove: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerMilestoneApprove,
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
                        redeemers: { campaignValidatorRedeemerMilestoneApprove: transactionCampaignValidatorRedeemerMilestoneApprove },
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
                    console_log(-1, this._Entity.className(), `MilestoneApprove Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `MilestoneApprove Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} MilestoneApprove Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `MilestoneApprove Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignMilestoneFailTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `MilestoneFail Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignCampaingNotReachedTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `MilestoneFail Tx - txParams: ${showData(txParams)}`);
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
                console_log(0, this._Entity.className(), `MilestoneFail Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getByParams_<CampaignFundsEntity>(
                    { cfdCampaignPolicy_CS: campaign.getNET_id_CS() },
                    {
                        ...optionsGetMinimalWithSmartUTxOCompleteFields,
                        fieldsForSelect: {},
                    }
                );
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
                console_log(0, this._Entity.className(), `MilestoneFail Tx - campaignFunds_UTxOs: ${campaignFunds_UTxOs.length}`);
                //--------------------------------------
                const campaignValidator_Hash = campaign.fdpCampaignValidator_Hash;
                const campaignValidator_Script = campaign.fdpCampaignValidator_Script;
                //--------------------------------------
                const campaignValidator_Address: Address = campaign.getNet_Address();
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `MilestoneFail Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const currentMilestone = campaign.getCurrentMilestoneDatumIndex();
                const campaignDatum_Out = this._BackEndApplied.mkUpdated_Campaign_Datum_With_MilestoneFailed(campaignDatum_In, currentMilestone);
                console_log(0, this._Entity.className(), `MilestoneFail Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `MilestoneFail Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `MilestoneFail Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerMilestoneFail = new CampaignValidatorRedeemerMilestoneFail({ milestoneIndex: currentMilestone });
                console_log(0, this._Entity.className(), `MilestoneFail Tx - campaignValidatorRedeemerMilestoneFail: ${showData(campaignValidatorRedeemerMilestoneFail, false)}`);
                const campaignValidatorRedeemerMilestoneFail_Hex = objToCborHex(campaignValidatorRedeemerMilestoneFail);
                console_log(
                    0,
                    this._Entity.className(),
                    `MilestoneFail Tx - campaignValidatorRedeemerMilestoneFail_Hex: ${showData(campaignValidatorRedeemerMilestoneFail_Hex, false)}`
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
                    `MilestoneFail Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
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
                        type: TxEnums.CAMPAIGN_MILESTONE_FAIL,
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
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerMilestoneFail_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `MilestoneFail Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `MilestoneFail Tx - Attaching Script: ${campaignValidator_Hash}`);
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
                    console_log(0, this._Entity.className(), `MilestoneFail Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerMilestoneFail: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerMilestoneFail,
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
                        redeemers: { campaignValidatorRedeemerMilestoneFail: transactionCampaignValidatorRedeemerMilestoneFail },
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
                    console_log(-1, this._Entity.className(), `MilestoneFail Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `MilestoneFail Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} MilestoneFail Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `MilestoneFail Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignCollectTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Collect Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignFundsCollectTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Collect Tx - txParams: ${showData(txParams)}`);
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
                console_log(0, this._Entity.className(), `Collect Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
                //--------------------------------------
                const campaignFunds = await CampaignFundsBackEndApplied.getById_<CampaignFundsEntity>(txParams.campaign_funds_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (campaignFunds === undefined) {
                    throw `Invalid campaign_funds_id`;
                }
                //--------------------------------------
                const campaignFunds_SmartUTxO = campaignFunds.smartUTxO;
                if (campaignFunds_SmartUTxO === undefined) {
                    throw `Can't find Campaign Funds UTxO`;
                }
                //--------------------------------------
                const campaignFunds_UTxO = campaignFunds_SmartUTxO.getUTxO();
                console_log(0, this._Entity.className(), `Collect Tx - campaignFunds_UTxO: ${formatUTxO(campaignFunds_UTxO.txHash, campaignFunds_UTxO.outputIndex)}`);
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
                const campaignCollectLovelaceAmount = BigInt(Math.round(Number(txParams.amount)));
                console_log(0, this._Entity.className(), `Collect Tx - User Request Collect Lovelace: ${campaignCollectLovelaceAmount}`);
                const campaignLovelaceMaxToCollect = campaign.getAmountLovelaceToCollect();
                console_log(0, this._Entity.className(), `Collect Tx - Campaign Max To Collect Lovelace: ${campaignLovelaceMaxToCollect}`);
                const campaignFundsLovelaceMaxToCollect = campaignFunds.cfdSubtotal_Avalaible_ADA;
                console_log(0, this._Entity.className(), `Collect Tx - Fund Max To Collect Lovelace: ${campaignFundsLovelaceMaxToCollect}`);
                const campaignLovelaceToCollect = BigInt(
                    Math.min(Number(campaignCollectLovelaceAmount), Number(campaignLovelaceMaxToCollect), Number(campaignFundsLovelaceMaxToCollect))
                );
                if (campaignLovelaceToCollect <= 0n) {
                    throw `Nothing to Collect`;
                }
                //--------------------------------------
                const valueFor_Collect_ADA: Assets = { lovelace: campaignLovelaceToCollect };
                console_log(0, this._Entity.className(), `Collect Tx - valueFor_Collect_ADA: ${showData(valueFor_Collect_ADA)}`);
                //--------------------------------------
                const campaignDatum_In = campaign.getMyDatum() as CampaignDatum;
                console_log(0, this._Entity.className(), `Collect Tx - campaignDatum_In: ${showData(campaignDatum_In, false)}`);
                //--------------------------------------
                const campaignDatum_Out = CampaignBackEndApplied.mkUpdated_CampaignDatum_Collect(campaignDatum_In, campaignLovelaceToCollect);
                console_log(0, this._Entity.className(), `Collect Tx - campaignDatum_Out: ${showData(campaignDatum_Out, false)}`);
                const campaignDatum_Out_Hex = CampaignEntity.datumToCborHex(campaignDatum_Out);
                console_log(0, this._Entity.className(), `Collect Tx - campaignDatum_Out_Hex: ${showData(campaignDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignDatum_In = campaign_SmartUTxO.assets;
                const valueFor_CampaignDatum_Out = value_Of_CampaignDatum_In;
                console_log(0, this._Entity.className(), `Collect Tx - valueFor_CampaignDatum_Out: ${showData(valueFor_CampaignDatum_Out, false)}`);
                //--------------------------------------
                const campaignValidatorRedeemerCollect = new CampaignValidatorRedeemerFundsCollect({ amount: campaignLovelaceToCollect });
                const campaignValidatorRedeemerCollect_Hex = campaignValidatorRedeemerCollect.toCborHex();
                console_log(0, this._Entity.className(), `Collect Tx - campaignValidatorRedeemerCollect_Hex: ${showData(campaignValidatorRedeemerCollect_Hex, false)}`);
                //--------------------------------------
                const campaignFundsDatum_In = campaignFunds.getMyDatum() as CampaignFundsDatum;
                console_log(0, this._Entity.className(), `Collect Tx - campaignFundsDatum_In: ${showData(campaignFundsDatum_In, false)}`);
                //--------------------------------------
                const campaignFundsDatum_Out = CampaignFundsBackEndApplied.mkUpdated_CampaignFundsDatum_Collect(campaignFundsDatum_In, campaignLovelaceToCollect);
                console_log(0, this._Entity.className(), `Collect Tx - campaignFundsDatum_Out: ${showData(campaignFundsDatum_Out, false)}`);
                const campaignFundsDatum_Out_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out);
                console_log(0, this._Entity.className(), `Collect Tx - campaignFundsDatum_Out_Hex: ${showData(campaignFundsDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignFundsDatum_In = campaignFunds_SmartUTxO.assets;
                console_log(0, this._Entity.className(), `Collect Tx - value_Of_CampaignFundsDatum_In: ${showData(value_Of_CampaignFundsDatum_In, false)}`);
                let valueFor_CampaignFundsDatum_Out = subsAssets(value_Of_CampaignFundsDatum_In, valueFor_Collect_ADA);
                console_log(0, this._Entity.className(), `Collect Tx - valueFor_CampaignFundsDatum_Out: ${showData(valueFor_CampaignFundsDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsValidatorRedeemerCollect = new CampaignFundsValidatorRedeemerCollect({ amount: campaignLovelaceToCollect });
                const campaignFundsValidatorRedeemerCollect_Hex = campaignFundsValidatorRedeemerCollect.toCborHex();
                console_log(0, this._Entity.className(), `Collect Tx - campaignFundsValidatorRedeemerCollect_Hex: ${showData(campaignFundsValidatorRedeemerCollect_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Collect Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
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
                        type: TxEnums.CAMPAIGN_FUNDS_COLLECT,
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
                    // TODO: Agregar que todas las UTxO de la cual colectar
                    tx = tx
                        .collectFrom([campaign_UTxO], campaignValidatorRedeemerCollect_Hex)
                        .collectFrom([campaignFunds_UTxO], campaignFundsValidatorRedeemerCollect_Hex)
                        .pay.ToAddressWithData(campaignValidator_Address, { kind: 'inline', value: campaignDatum_Out_Hex }, valueFor_CampaignDatum_Out)
                        .pay.ToAddressWithData(campaignFundsValidator_Address, { kind: 'inline', value: campaignFundsDatum_Out_Hex }, valueFor_CampaignFundsDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignValidator = await ScriptBackEndApplied.getByHash(campaignValidator_Hash);
                    if (scriptCampaignValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Collect Tx - Using Script as Ref: ${campaignValidator_Hash}`);
                        const smartUTxO = scriptCampaignValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Collect Tx - Attaching Script: ${campaignValidator_Hash}`);
                        tx = tx.attach.MintingPolicy(campaignValidator_Script);
                    }
                    //--------------------------------------
                    const scriptCampaignFundsValidator = await ScriptBackEndApplied.getByHash(campaignFundsValidator_Hash);
                    if (scriptCampaignFundsValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Collect Tx - Using Script as Ref: ${campaignFundsValidator_Hash}`);
                        const smartUTxO = scriptCampaignFundsValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Collect Tx - Attaching Script: ${campaignFundsValidator_Hash}`);
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
                    console_log(0, this._Entity.className(), `Collect Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignValidatorRedeemerDeposit: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignValidatorRedeemerCollect,
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
                    const transactionCampaignFundsValidatorRedeemerDeposit: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignFundsValidatorRedeemerCollect,
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
                            campaignValidatorRedeemerCollect: transactionCampaignValidatorRedeemerDeposit,
                            campaignFundsValidatorRedeemerCollect: transactionCampaignFundsValidatorRedeemerDeposit,
                        },
                        datums: {
                            campaignDatum_In: transactionCampaignDatum_In,
                            campaignDatum_Out: transactionCampaignDatum_Out,

                            campaignFundsDatum_In: transactionFundsCampaignDatum_In,
                            campaignFundsDatum_Out: transactionCampaignFundsDatum_Out,
                        },
                        reading_UTxOs: [],
                        consuming_UTxOs: [campaign_UTxO, campaignFunds_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Collect Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Collect Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Collect Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Collect Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async campaignGetBackTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Get Back Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignFundsGetBackTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Get Back Tx - txParams: ${showData(txParams)}`);
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
                console_log(0, this._Entity.className(), `Get Back Tx - campaign_UTxO: ${formatUTxO(campaign_UTxO.txHash, campaign_UTxO.outputIndex)}`);
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
                console_log(0, this._Entity.className(), `Get Back Tx - campaignFunds_UTxO: ${formatUTxO(campaignFunds_UTxO.txHash, campaignFunds_UTxO.outputIndex)}`);
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
                const campaignTokensAmountToGetBack = BigInt(Math.round(Number(txParams.amount)));
                //--------------------------------------
                const amountLovelace = campaign.calculateGetBackAmountLovelace(campaignTokensAmountToGetBack);
                const valueFor_GetBack_ADA: Assets = { lovelace: amountLovelace };
                console_log(0, this._Entity.className(), `Get Back Tx - valueFor_GetBack_ADA: ${showData(valueFor_GetBack_ADA)}`);
                //--------------------------------------
                const valueFor_GetBack_CampaignTokens: Assets = { [campaignTokens_AC_Lucid]: campaignTokensAmountToGetBack };
                console_log(0, this._Entity.className(), `Get Back Tx - valueFor_GetBack_CampaignTokens: ${showData(valueFor_GetBack_CampaignTokens)}`);
                //--------------------------------------
                const campaignFundsDatum_In = campaignFunds.getMyDatum() as CampaignFundsDatum;
                console_log(0, this._Entity.className(), `Get Back Tx - campaignFundsDatum_In: ${showData(campaignFundsDatum_In, false)}`);
                const campaignFundsDatum_In_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_In);
                console_log(0, this._Entity.className(), `Get Back Tx - campaignFundsDatum_In_Hex: ${showData(campaignFundsDatum_In_Hex, false)}`);
                //--------------------------------------
                const campaignFundsDatum_Out = CampaignFundsBackEndApplied.mkUpdated_CampaignFundsDatum_GetBack(
                    campaignFundsDatum_In,
                    campaignTokensAmountToGetBack,
                    valueFor_GetBack_ADA.lovelace
                );
                console_log(0, this._Entity.className(), `Get Back Tx - campaignFundsDatum_Out: ${showData(campaignFundsDatum_Out, false)}`);
                const campaignFundsDatum_Out_Hex = CampaignFundsEntity.datumToCborHex(campaignFundsDatum_Out);
                console_log(0, this._Entity.className(), `Get Back Tx - campaignFundsDatum_Out_Hex: ${showData(campaignFundsDatum_Out_Hex, false)}`);
                //--------------------------------------
                const value_Of_CampaignFundsDatum_In = campaignFunds_SmartUTxO.assets;
                console_log(0, this._Entity.className(), `Get Back Tx - value_Of_CampaignFundsDatum_In: ${showData(value_Of_CampaignFundsDatum_In, false)}`);
                let valueFor_CampaignFundsDatum_Out = addAssetsList([value_Of_CampaignFundsDatum_In, valueFor_GetBack_CampaignTokens]);
                valueFor_CampaignFundsDatum_Out = subsAssets(valueFor_CampaignFundsDatum_Out, valueFor_GetBack_ADA);
                console_log(0, this._Entity.className(), `Get Back Tx - valueFor_CampaignFundsDatum_Out: ${showData(valueFor_CampaignFundsDatum_Out, false)}`);
                //--------------------------------------
                const campaignFundsValidatorRedeemerGetBack = new CampaignFundsValidatorRedeemerGetBack({ amount: campaignTokensAmountToGetBack });
                const campaignFundsValidatorRedeemerGetBack_Hex = campaignFundsValidatorRedeemerGetBack.toCborHex();
                console_log(0, this._Entity.className(), `Get Back Tx - campaignFundsValidatorRedeemerGetBack_Hex: ${showData(campaignFundsValidatorRedeemerGetBack_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Get Back Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
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
                        type: TxEnums.CAMPAIGN_FUNDS_GET_BACK,
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
                        .collectFrom([campaignFunds_UTxO], campaignFundsValidatorRedeemerGetBack_Hex)
                        .pay.ToAddressWithData(campaignFundsValidator_Address, { kind: 'inline', value: campaignFundsDatum_Out_Hex }, valueFor_CampaignFundsDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptCampaignFundsValidator = await ScriptBackEndApplied.getByHash(campaignFundsValidator_Hash);
                    if (scriptCampaignFundsValidator !== undefined) {
                        console_log(0, this._Entity.className(), `Get Back Tx - Using Script as Ref: ${campaignFundsValidator_Hash}`);
                        const smartUTxO = scriptCampaignFundsValidator.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Campaign`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Get Back Tx - Attaching Script: ${campaignFundsValidator_Hash}`);
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
                    console_log(0, this._Entity.className(), `Get Back Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionCampaignFundsValidatorRedeemerDeposit: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: campaignFundsValidatorRedeemerGetBack,
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
                            campaignFundsValidatorRedeemerGetBack: transactionCampaignFundsValidatorRedeemerDeposit,
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
                    console_log(-1, this._Entity.className(), `Get Back Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Get Back Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Fund Get Back Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Get Back Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }
    // #endregion transactions
    // #endregion custom api handlers
}
