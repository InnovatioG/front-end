import { CAMPAIGN_ID_TN_Str } from '@/utils/constants/on-chain';
import { CampaignDatumStatus_Code_Id_Enums, MilestoneDatumStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import { Constr, Data, type Script } from '@lucid-evolution/lucid';
import 'reflect-metadata';
import { BaseSmartDBEntity, Convertible, LUCID_NETWORK_MAINNET_NAME, asSmartDBEntity, type CS, type POSIXTime } from 'smart-db';

export interface CampaignMilestoneDatum {
    cmPerncentage: bigint;
    cmStatus: MilestoneDatumStatus_Code_Id_Enums;
}

export const toPlutusDataMilestoneStatus = (status: MilestoneDatumStatus_Code_Id_Enums): Data => {
    return new Constr(status, []);
};

export const fromPlutusDataMilestoneStatus = (data: any): MilestoneDatumStatus_Code_Id_Enums => {
    if (data?.index === undefined || data.fields?.length !== 0) {
        throw `Invalid Constr for MilestoneStatus`;
    }

    const index = data.index;
    if (index !== MilestoneDatumStatus_Code_Id_Enums.MsCreated && index !== MilestoneDatumStatus_Code_Id_Enums.MsSuccess && index !== MilestoneDatumStatus_Code_Id_Enums.MsFailed) {
        throw `Unknown MilestoneStatus index: ${index}`;
    }

    return index as MilestoneDatumStatus_Code_Id_Enums;
};

export const deserealizeCampaignMilestone = (value: any | undefined): CampaignMilestoneDatum | undefined => {
    if (value === undefined) return undefined;
    const deserialized: CampaignMilestoneDatum = {
        cmPerncentage: value.cmPerncentage,
        cmStatus: value.cmStatus,
    };
    return deserialized;
};

export const campaignMilestonefromPlutusData = (lucidDataForDatum: any | undefined): CampaignMilestoneDatum => {
    if (lucidDataForDatum?.index === 0) {
        const fields = lucidDataForDatum.fields;
        if (fields.length === 2) {
            const cmPerncentage = BigInt(fields[0]);
            const cmStatus = fromPlutusDataMilestoneStatus(fields[1]); // ← AQUÍ se interpreta como enum
            return { cmPerncentage, cmStatus };
        }
    }
    throw `CampaignMilestone - Can't get from Datum`;
};

export const toPlutusDataCampaignMilestones = (milestones: CampaignMilestoneDatum[] | undefined): Data[] => {
    if (!milestones) throw `CampaignMilestone is undefined`;
    return milestones.map((m) => new Constr(0, [BigInt(m.cmPerncentage), toPlutusDataMilestoneStatus(m.cmStatus)]));
};

export interface CampaignDatum {
    cdCampaignVersion: number;
    cdCampaignPolicy_CS: string;
    cdCampaignFundsPolicyID_CS: string;
    cdAdmins: string[];
    cdTokenAdminPolicy_CS: string;
    cdMint_CampaignToken: boolean;
    cdCampaignToken_CS: string;
    cdCampaignToken_TN: string;
    cdCampaignToken_PriceADA: bigint;
    cdRequestedMaxADA: bigint;
    cdRequestedMinADA: bigint;
    cdFundedADA: bigint;
    cdCollectedADA: bigint;
    cdBegin_at: POSIXTime;
    cdDeadline: POSIXTime;
    cdStatus: CampaignDatumStatus_Code_Id_Enums;
    cdMilestones: CampaignMilestoneDatum[];
    cdFundsCount: number;
    cdFundsIndex: number;
    cdMinADA: bigint;
}

export const toPlutusDataCampaignStatus = (status: CampaignDatumStatus_Code_Id_Enums): Data => {
    return new Constr(status, []);
};

export const fromPlutusDataCampaignStatus = (data: any): CampaignDatumStatus_Code_Id_Enums => {
    if (data?.index === undefined || data.fields?.length !== 0) {
        throw `Invalid Constr for CampaignStatus`;
    }

    const index = data.index;
    if (
        index !== CampaignDatumStatus_Code_Id_Enums.CsCreated &&
        index !== CampaignDatumStatus_Code_Id_Enums.CsInitialized &&
        index !== CampaignDatumStatus_Code_Id_Enums.CsReached &&
        index !== CampaignDatumStatus_Code_Id_Enums.CsNotReached &&
        index !== CampaignDatumStatus_Code_Id_Enums.CsFailedMilestone
    ) {
        throw `Unknown CampaignStatus index: ${index}`;
    }

    return index as CampaignDatumStatus_Code_Id_Enums;
};

@asSmartDBEntity()
export class CampaignEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'campaign';
    protected static _className: string = 'Campaign';

    protected static _plutusDataIsSubType = true;

    protected static _isOnlyDatum = false;

    _NET_id_TN_Str: string = CAMPAIGN_ID_TN_Str;

    // #region fields

    @Convertible({ isDB_id: true })
    campaign_category_id!: string;
    @Convertible({ isDB_id: true })
    campaign_status_id!: string;
    @Convertible({ isDB_id: true })
    creator_wallet_id!: string;

    @Convertible()
    name!: string;
    @Convertible()
    description?: string;

    @Convertible()
    begin_at_days!: number;
    @Convertible()
    deadline_days!: number;
    @Convertible()
    campaign_deployed_date?: Date;
    @Convertible()
    campaign_actived_date?: Date;

    @Convertible()
    begin_at?: Date;
    @Convertible()
    deadline?: Date;

    @Convertible()
    mint_CampaignToken!: boolean;
    @Convertible()
    campaignToken_CS!: string;
    @Convertible()
    campaignToken_TN!: string;
    @Convertible()
    campaignToken_PriceADA!: bigint;
    @Convertible()
    requestedMaxADA!: bigint;
    @Convertible()
    requestedMinADA!: bigint;

    @Convertible()
    logo_url?: string;
    @Convertible()
    banner_url?: string;
    @Convertible()
    website?: string;
    @Convertible()
    instagram?: string;
    @Convertible()
    twitter?: string;
    @Convertible()
    discord?: string;
    @Convertible()
    linkedin?: string;
    @Convertible()
    facebook?: string;
    @Convertible()
    visualizations!: number;
    @Convertible()
    investors!: number;
    @Convertible()
    fundedADA!: bigint;
    @Convertible()
    collectedADA!: bigint;
    @Convertible()
    tokenomics_max_supply!: bigint;
    @Convertible()
    tokenomics_for_campaign!: bigint;
    @Convertible()
    tokenomics_description!: string;

    @Convertible({ isForDatum: true })
    cdCampaignVersion!: number;
    @Convertible({ isForDatum: true })
    cdCampaignPolicy_CS!: string;
    @Convertible({ isForDatum: true })
    cdCampaignFundsPolicyID_CS!: string;
    @Convertible({ isForDatum: true, type: String })
    cdAdmins!: string[];
    @Convertible({ isForDatum: true })
    cdTokenAdminPolicy_CS!: string;
    @Convertible({ isForDatum: true })
    cdMint_CampaignToken!: boolean;
    @Convertible({ isForDatum: true })
    cdCampaignToken_CS!: string;
    @Convertible({ isForDatum: true })
    cdCampaignToken_TN!: string;
    @Convertible({ isForDatum: true })
    cdCampaignToken_PriceADA!: bigint;
    @Convertible({ isForDatum: true })
    cdRequestedMaxADA!: bigint;
    @Convertible({ isForDatum: true })
    cdRequestedMinADA!: bigint;
    @Convertible({ isForDatum: true })
    cdFundedADA!: bigint;
    @Convertible({ isForDatum: true })
    cdCollectedADA!: bigint;
    @Convertible({ isForDatum: true, type: BigInt })
    cdBegin_at!: POSIXTime;
    @Convertible({ isForDatum: true, type: BigInt })
    cdDeadline!: POSIXTime;
    @Convertible({
        type: Number,
        isForDatum: true,
        toPlutusData: toPlutusDataCampaignStatus,
        fromPlutusData: fromPlutusDataCampaignStatus,
    })
    cdStatus!: CampaignDatumStatus_Code_Id_Enums;
    @Convertible({
        isForDatum: true,
        type: Object,
        fromPlainObject: deserealizeCampaignMilestone,
        fromPlutusData: campaignMilestonefromPlutusData,
        toPlutusData: toPlutusDataCampaignMilestones,
    })
    cdMilestones!: CampaignMilestoneDatum[];
    @Convertible({ isForDatum: true })
    cdFundsCount!: number;
    @Convertible({ isForDatum: true })
    cdFundsIndex!: number;
    @Convertible({ isForDatum: true })
    cdMinADA!: bigint;

    @Convertible()
    fdpCampaignVersion!: number;
    @Convertible()
    fdpCampaignPolicy_Params!: object;
    @Convertible()
    fdpCampaignPolicy_Script!: Script;
    @Convertible({ isUnique: true })
    fdpCampaignPolicy_CS!: CS;
    @Convertible()
    fdpCampaignValidator_AddressMainnet!: string;
    @Convertible()
    fdpCampaignValidator_AddressTestnet!: string;
    @Convertible()
    fdpCampaignValidator_Script!: Script;
    @Convertible()
    fdpCampaignValidator_Hash!: string;
    @Convertible()
    fdpCampaignValidator_Params!: object;
    @Convertible()
    fdpCampaignFundsPolicyID_Params!: object;
    @Convertible()
    fdpCampaignFundsPolicyID_Script!: Script;
    @Convertible()
    fdpCampaignFundsPolicyID_CS!: CS;
    @Convertible()
    fdpCampaignFundsValidator_Params!: object;
    @Convertible()
    fdpCampaignFundsValidator_Hash!: string;
    @Convertible()
    fdpCampaignFundsValidator_Script!: Script;
    @Convertible()
    fdpCampaignFundsValidator_AddressTestnet!: string;
    @Convertible()
    fdpCampaignFundsValidator_AddressMainnet!: string;

    @Convertible()
    featured!: boolean;
    @Convertible()
    archived!: boolean;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {
        fdpCampaignPolicy_Params: false,
        fdpCampaignPolicy_Script: false,
        fdpCampaignValidator_Params: false,
        fdpCampaignValidator_Script: false,
        fdpCampaignFundsPolicyID_Params: false,
        fdpCampaignFundsPolicyID_Script: false,
        fdpCampaignFundsValidator_Params: false,
        fdpCampaignFundsValidator_Script: false,
    };

    public static fieldsForHomePage: Record<string, boolean> = {
        campaign_category_id: true,
        campaign_status_id: true,
        creator_wallet_id: true,

        campaign_deployed_date: true,
        campaign_actived_date: true,

        name: true,
        description: true,
        begin_at_days: true,
        deadline_days: true,
        begin_at: true,
        deadline: true,
        mint_CampaignToken: true,
        campaignToken_CS: true,
        campaignToken_TN: true,
        campaignToken_PriceADA: true,
        requestedMaxADA: true,
        requestedMinADA: true,

        logo_url: true,
        banner_url: true,
        website: true,
        instagram: true,
        twitter: true,
        discord: true,
        linkedin: true,
        facebook: true,
        visualizations: true,
        investors: true,
        tokenomics_max_supply: true,
        tokenomics_for_campaign: true,
        tokenomics_description: true,
        featured: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
    };

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        campaign_category_id: true,
        campaign_status_id: true,
        creator_wallet_id: true,

        campaign_deployed_date: true,
        campaign_actived_date: true,

        name: true,
        description: true,
        begin_at_days: true,
        deadline_days: true,
        begin_at: true,
        deadline: true,
        mint_CampaignToken: true,
        campaignToken_CS: true,
        campaignToken_TN: true,
        campaignToken_PriceADA: true,
        requestedMaxADA: true,
        requestedMinADA: true,

        logo_url: true,
        banner_url: true,
        website: true,
        instagram: true,
        twitter: true,
        discord: true,
        facebook: true,
        visualizations: true,
        investors: true,
        tokenomics_max_supply: true,
        tokenomics_for_campaign: true,
        tokenomics_description: true,

        cdCampaignVersion: true,
        cdCampaignPolicy_CS: true,
        cdCampaignFundsPolicyID_CS: true,
        cdAdmins: true,
        cdTokenAdminPolicy_CS: true,
        cdMint_CampaignToken: true,
        cdCampaignToken_CS: true,
        cdCampaignToken_TN: true,
        cdCampaignToken_PriceADA: true,
        cdRequestedMaxADA: true,
        cdRequestedMinADA: true,
        cdFundedADA: true,
        cdCollectedADA: true,
        cdBegin_at: true,
        cdDeadline: true,
        cdStatus: true,
        cdMilestones: true,
        cdFundsCount: true,
        cdFundsIndex: true,
        cdMinADA: true,

        fdpCampaignVersion: true,
        fdpCampaignPolicy_CS: true,
        fdpCampaignPolicy_Params: false,
        fdpCampaignPolicy_Script: false,
        fdpCampaignValidator_AddressTestnet: true,
        fdpCampaignValidator_AddressMainnet: true,
        fdpCampaignValidator_Hash: true,
        fdpCampaignValidator_Params: false,
        fdpCampaignValidator_Script: false,
        fdpCampaignFundsPolicyID_CS: true,
        fdpCampaignFundsPolicyID_Params: false,
        fdpCampaignFundsPolicyID_Script: false,
        fdpCampaignFundsValidator_AddressMainnet: true,
        fdpCampaignFundsValidator_AddressTestnet: true,
        fdpCampaignFundsValidator_Hash: true,
        fdpCampaignFundsValidator_Params: false,
        fdpCampaignFundsValidator_Script: false,

        featured: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
    };

    public static defaultFieldsAddScriptsTxScript: Record<string, boolean> = {
        fdpCampaignPolicy_CS: true,
        fdpCampaignPolicy_Script: true,
        fdpCampaignValidator_Hash: true,
        fdpCampaignValidator_Script: true,
        fdpCampaignFundsPolicyID_CS: true,
        fdpCampaignFundsPolicyID_Script: true,
        fdpCampaignFundsValidator_Hash: true,
        fdpCampaignFundsValidator_Script: true,
    };

    // #endregion db

    // #region class methods

    public getNet_Address(): string {
        if (process.env.NEXT_PUBLIC_CARDANO_NET === LUCID_NETWORK_MAINNET_NAME) {
            return this.fdpCampaignValidator_AddressMainnet;
        } else {
            return this.fdpCampaignValidator_AddressTestnet;
        }
    }

    public getNET_id_CS(): string {
        return this.fdpCampaignPolicy_CS;
    }

    public getNet_FundHoldingPolicyID_CS(): string {
        return this.fdpCampaignFundsPolicyID_CS;
    }

    public getNet_FundHolding_Validator_Address(): string {
        if (process.env.NEXT_PUBLIC_CARDANO_NET === LUCID_NETWORK_MAINNET_NAME) {
            return this.fdpCampaignFundsValidator_AddressMainnet;
        } else {
            return this.fdpCampaignFundsValidator_AddressTestnet;
        }
    }
    
    public getAmountToCollect(): bigint {
        const sucessMilestones = this.cdMilestones.filter((milestone) => milestone.cmStatus === MilestoneDatumStatus_Code_Id_Enums.MsSuccess);
        const accumPorcentaje = sucessMilestones.reduce((acc, milestone) => acc + milestone.cmPerncentage, 0n);

        const totalFundsToCollect = this.cdFundedADA * accumPorcentaje;
        const avalibleFundsToCollect = totalFundsToCollect - this.cdCollectedADA;

        return avalibleFundsToCollect;
    }

    // #endregion class methods
}
