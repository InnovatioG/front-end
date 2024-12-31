import 'reflect-metadata';
import { BaseSmartDBEntity, Convertible, asSmartDBEntity, type POSIXTime } from 'smart-db';

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
    cdBeginAt: POSIXTime;
    cdDeadline: POSIXTime;
    cdStatus: number;
    cdMilestones: string;
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
    _NET_id_TN: string = 'CampaignID';

    // #region fields
    @Convertible({ isDB_id: true })
    projectId!: string;
    @Convertible({ isDB_id: true })
    campaingCategoryId!: string;
    @Convertible({ isDB_id: true })
    campaignStatusId!: string;
    @Convertible({ isDB_id: true })
    creatorWalletId!: string;
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
    cdBeginAt!: POSIXTime;
    @Convertible({ isForDatum: true, type: BigInt })
    cdDeadline!: POSIXTime;
    @Convertible({ isForDatum: true })
    cdStatus!: number;
    @Convertible({ isForDatum: true })
    cdMilestones!: string;
    @Convertible({ isForDatum: true })
    cdFundsCount!: number;
    @Convertible({ isForDatum: true })
    cdFundsIndex!: number;
    @Convertible({ isForDatum: true })
    cdMinADA!: bigint;
    @Convertible()
    description?: string;
    @Convertible()
    beginAt?: Date;
    @Convertible()
    deadline?: Date;
    @Convertible()
    logoUrl?: string;
    @Convertible()
    bannerUrl?: string;
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
    tokenomicsMaxSupply!: string;
    @Convertible()
    tokenomicsDescription!: string;
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

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        projectId: true,
        campaingCategoryId: true,
        campaignStatusId: true,
        creatorWalletId: true,
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
        cdBeginAt: true,
        cdDeadline: true,
        cdStatus: true,
        cdMilestones: true,
        cdFundsCount: true,
        cdFundsIndex: true,
        cdMinADA: true,
        description: true,
        beginAt: true,
        deadline: true,
        logoUrl: true,
        bannerUrl: true,
        website: true,
        instagram: true,
        twitter: true,
        discord: true,
        facebook: true,
        investors: true,
        tokenomicsMaxSupply: true,
        tokenomicsDescription: true,
        featured: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
