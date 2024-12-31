import 'reflect-metadata';
import { BaseSmartDBEntity, Convertible, asSmartDBEntity, type POSIXTime } from 'smart-db';

export interface CampaignMilestone {
    cmEstimatedDeliveryDate: POSIXTime;
    cmPerncentage: number;
    cmStatus: number;
}

export const deserealizeCampaignMilestone = (value: any | undefined): CampaignMilestone | undefined => {
    if (value === undefined) return undefined;
    const deserialized: CampaignMilestone = {
        cmEstimatedDeliveryDate: BigInt(value.cmEstimatedDeliveryDate),
        cmPerncentage: value.cmPerncentage,
        cmStatus: value.cmStatus,
    };
    return deserialized;
};

export const campaignMilestonefromPlutusData = (lucidDataForDatum: any | undefined) => {
    if (lucidDataForDatum?.index === 0) {
        const lucidDataForConstr0 = lucidDataForDatum.fields;
        if (lucidDataForConstr0.length === 3) {
            const objectInstance: CampaignMilestone = {
                cmEstimatedDeliveryDate: lucidDataForConstr0[0],
                cmPerncentage: Number(lucidDataForConstr0[1]),
                cmStatus: Number(lucidDataForConstr0[2]),
            };
            return objectInstance;
        }
    }
    throw `CampaignMilestone - Can't get from Datum`;
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
    cdbegin_at: POSIXTime;
    cdDeadline: POSIXTime;
    cdStatus: number;
    cdMilestones: CampaignMilestone[];
    cdFundsCount: number;
    cdFundsIndex: number;
    cdMinADA: bigint;
}

@asSmartDBEntity()
export class CampaignEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'campaign';
    protected static _className: string = 'Campaign';

    protected static _plutusDataIsSubType = true;
    protected static _is_NET_id_Unique = true;
    _NET_id_TN: string = 'campaign_id';

    // #region fields
    @Convertible({ isDB_id: true })
    project_id!: string;
    @Convertible({ isDB_id: true })
    campaing_category_id!: string;
    @Convertible({ isDB_id: true })
    campaign_status_id!: string;
    @Convertible({ isDB_id: true })
    creator_wallet_id!: string;
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
    cdbegin_at!: POSIXTime;
    @Convertible({ isForDatum: true, type: BigInt })
    cdDeadline!: POSIXTime;
    @Convertible({ isForDatum: true })
    cdStatus!: number;
    @Convertible({
        isForDatum: true,
        type: Object,
        fromPlainObject: deserealizeCampaignMilestone,
        fromPlutusData: campaignMilestonefromPlutusData,
    })
    cdMilestones!: CampaignMilestone[];
    @Convertible({ isForDatum: true })
    cdFundsCount!: number;
    @Convertible({ isForDatum: true })
    cdFundsIndex!: number;
    @Convertible({ isForDatum: true })
    cdMinADA!: bigint;
    @Convertible()
    description?: string;
    @Convertible()
    begin_at?: Date;
    @Convertible()
    deadline?: Date;
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
    facebook?: string;
    @Convertible()
    investors!: number;
    @Convertible()
    tokenomics_max_supply!: string;
    @Convertible()
    tokenomics_description!: string;
    @Convertible()
    featured!: boolean;
    @Convertible()
    archived!: boolean;
    @Convertible({ isCreatedAt: true })
    created_at!: Date;
    @Convertible({ isUpdatedAt: true })
    updated_at?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        project_id: true,
        campaing_category_id: true,
        campaign_status_id: true,
        creator_wallet_id: true,
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
        cdbegin_at: true,
        cdDeadline: true,
        cdStatus: true,
        cdMilestones: true,
        cdFundsCount: true,
        cdFundsIndex: true,
        cdMinADA: true,
        description: true,
        begin_at: true,
        deadline: true,
        logo_url: true,
        banner_url: true,
        website: true,
        instagram: true,
        twitter: true,
        discord: true,
        facebook: true,
        investors: true,
        tokenomics_max_supply: true,
        tokenomics_description: true,
        featured: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
