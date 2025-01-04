import { type Script } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseSmartDBEntity, type CS, Convertible, asSmartDBEntity, type POSIXTime, LucidLUCID_NETWORK_MAINNET_NAME } from 'smart-db';

export interface CampaignMilestone {
    cmPerncentage: number;
    cmStatus: number;
}

export const deserealizeCampaignMilestone = (value: any | undefined): CampaignMilestone | undefined => {
    if (value === undefined) return undefined;
    const deserialized: CampaignMilestone = {
        cmPerncentage: value.cmPerncentage,
        cmStatus: value.cmStatus,
    };
    return deserialized;
};

export const campaignMilestonefromPlutusData = (lucidDataForDatum: any | undefined) => {
    if (lucidDataForDatum?.index === 0) {
        const lucidDataForConstr0 = lucidDataForDatum.fields;
        if (lucidDataForConstr0.length === 2) {
            const objectInstance: CampaignMilestone = {
                cmPerncentage: Number(lucidDataForConstr0[0]),
                cmStatus: Number(lucidDataForConstr0[1]),
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
    campaing_category_id!: string;
    @Convertible({ isDB_id: true })
    campaign_status_id!: string;
    @Convertible({ isDB_id: true })
    creator_wallet_id!: string;

    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    
    @Convertible()
    begin_at_days?: number;
    @Convertible()
    deadline_days?: number;
    @Convertible()
    campaign_deployed_date!: Date;
    @Convertible()
    campaign_actived_date!: Date;
    
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
    facebook?: string;
    @Convertible()
    visualizations!: number;
    @Convertible()
    investors!: number;
    @Convertible()
    tokenomics_max_supply!: string;
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

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        campaing_category_id: true,
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
        cdbegin_at: true,
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

    // #endregion db

    // #region class methods

    public getNet_Address(): string {
        if (process.env.NEXT_PUBLIC_CARDANO_NET === LucidLUCID_NETWORK_MAINNET_NAME) {
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
        if (process.env.NEXT_PUBLIC_CARDANO_NET === LucidLUCID_NETWORK_MAINNET_NAME) {
            return this.fdpCampaignFundsValidator_AddressMainnet;
        } else {
            return this.fdpCampaignFundsValidator_AddressTestnet;
        }
    }

    // #endregion class methods
}
