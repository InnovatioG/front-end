import 'reflect-metadata';
import { Convertible, BaseSmartDBEntity, asSmartDBEntity } from 'smart-db';
import { UnixTime,  } from 'lucid-cardano';

@asSmartDBEntity()
export class CampaignEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'campaign';
    protected static _className: string = 'Campaign';

    protected static _plutusDataIsSubType = false;
    protected static _is_NET_id_Unique = false;
    _NET_id_TN: string = 'CampaignID';

    // #region fields
    @Convertible()
    projectId!: string;
    @Convertible()
    campaingCategoryId!: string;
    @Convertible()
    campaignStatusId!: string;
    @Convertible()
    creatorWalletId!: string;
    @Convertible( { isForDatum: true,  } )
    cdCampaignVersion!: string;
    @Convertible()
    cdCampaignPolicy_CS!: string;
    @Convertible( { isForDatum: true,  } )
    cdCampaignFundsPolicyID_CS!: string;
    @Convertible( { isForDatum: true,  } )
    cdAdmins!: [String];
    @Convertible( { isForDatum: true,  } )
    cdTokenAdminPolicy_CS!: string;
    @Convertible( { isForDatum: true,  } )
    cdMint_CampaignToken!: boolean;
    @Convertible( { isForDatum: true,  } )
    cdCampaignToken_CS!: string;
    @Convertible( { isForDatum: true,  } )
    cdCampaignToken_TN!: string;
    @Convertible( { isForDatum: true,  } )
    cdCampaignToken_PriceADA!: string;
    @Convertible( { isForDatum: true,  } )
    cdRequestedMaxADA!: string;
    @Convertible( { isForDatum: true,  } )
    cdRequestedMinADA!: string;
    @Convertible( { isForDatum: true,  } )
    cdFundedADA!: string;
    @Convertible( { isForDatum: true,  } )
    cdCollectedADA!: string;
    @Convertible( { isForDatum: true,  } )
    cdBeginAt!:  Date ;
    @Convertible( { isForDatum: true,  } )
    cdDeadline!:  Date ;
    @Convertible( { isForDatum: true,  } )
    cdStatus!: number;
    @Convertible( { isForDatum: true,  } )
    cdMilestones!: string;
    @Convertible( { isForDatum: true,  } )
    cdFundsCount!: number;
    @Convertible( { isForDatum: true,  } )
    cdFundsIndex!: number;
    @Convertible( { isForDatum: true,  } )
    cdMinADA!: string;
    @Convertible()
    description?: string;
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
    @Convertible()
    createAt!:  Date ;
    @Convertible()
    updateAt?:  Date ;

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
          createAt: true,
          updateAt: true,
    };

    // #endregion db
}


