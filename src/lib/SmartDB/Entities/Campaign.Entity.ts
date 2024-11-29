import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaigns';
    protected static _className: string = 'Campaign';

    @Convertible()
    id!: number;

    @Convertible()
    projectId!: number;

    @Convertible()
    campaignCategoryId!: number;

    @Convertible()
    campaignStatusId!: number;

    @Convertible()
    creatorWalletId!: number;

    @Convertible()
    cdCampaignVersion!: number;

    @Convertible()
    cdCampaignPolicy_CS!: string;

    @Convertible()
    cdCampaignFundsPolicyID_CS!: string;

    @Convertible({ type: String })
    cdAdmins!: string[];

    @Convertible()
    cdTokenAdminPolicy_CS!: string;

    @Convertible()
    cdMint_CampaignToken!: boolean;

    @Convertible()
    cdCampaignToken_CS!: string;

    @Convertible()
    cdCampaignToken_TN!: string;

    @Convertible()
    cdCampaignToken_PriceADA!: number;

    @Convertible()
    cdRequestedMaxADA!: number;

    @Convertible()
    cdRequestedMinADA!: number;

    @Convertible()
    cdFundedADA!: number;

    @Convertible()
    cdCollectedADA!: number;

    @Convertible()
    cdBeginAt!: Date;

    @Convertible()
    cdDeadline!: Date;

    @Convertible()
    cdStatus!: string;

    @Convertible({ type: String })
    cdMilestones!: string[];

    @Convertible()
    cdFundsCount!: number;

    @Convertible()
    cdFundsIndex!: number;

    @Convertible()
    cdMinADA!: number;

    @Convertible()
    description!: string;

    @Convertible()
    logoUrl!: string;

    @Convertible()
    bannerUrl!: string;

    @Convertible()
    website!: string;

    @Convertible()
    instagram!: string;

    @Convertible()
    twitter!: string;

    @Convertible()
    discord!: string;

    @Convertible()
    facebook!: string;

    @Convertible()
    investors!: number;

    @Convertible()
    featured!: boolean;

    @Convertible()
    archived!: boolean;

    @Convertible()
    createdAt!: Date;

    @Convertible()
    updatedAt!: Date;
}
