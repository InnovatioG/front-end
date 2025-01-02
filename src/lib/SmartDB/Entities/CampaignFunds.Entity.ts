import 'reflect-metadata';
import { BaseSmartDBEntity, Convertible, asSmartDBEntity, getAssetsFromCS, hexToStr, isNullOrBlank, type CS } from 'smart-db';

export interface CampaignFundsDatum {
    cfdIndex: number;
    cfdCampaignPolicy_CS: CS;
    cfdCampaignFundsPolicyID_CS: CS;
    cfdSubtotal_Avalaible_CampaignToken: bigint;
    cfdSubtotal_Sold_CampaignToken: bigint;
    cfdSubtotal_Avalaible_ADA: bigint;
    cfdSubtotal_Collected_ADA: bigint;
    cfdMinADA: bigint;
}

@asSmartDBEntity()
export class CampaignFundsEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'campaign-funds';
    protected static _className: string = 'CampaignFunds';

    protected static _plutusDataIsSubType = true;
    protected static _is_NET_id_Unique = false;
    // _NET_id_TN: string = 'CampaignFundsID';

    // #region fields
    @Convertible({ isForDatum: true })
    cfdVersion!: number;
    @Convertible({ isForDatum: true })
    cfdIndex!: number;
    @Convertible({ isForDatum: true, type: String })
    cfdCampaignPolicy_CS!: CS;
    @Convertible({ isForDatum: true, type: String })
    cfdCampaignFundsPolicyID_CS!: CS;
    @Convertible({ isForDatum: true })
    cfdSubtotal_Avalaible_CampaignToken!: bigint;
    @Convertible({ isForDatum: true })
    cfdSubtotal_Sold_CampaignToken!: bigint;
    @Convertible({ isForDatum: true })
    cfdSubtotal_Avalaible_ADA!: bigint;
    @Convertible({ isForDatum: true })
    cfdSubtotal_Collected_ADA!: bigint;
    @Convertible({ isForDatum: true })
    cfdMinADA!: bigint;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        cfdVersion: true,
        cfdIndex: true,
        cfdCampaignPolicy_CS: true,
        cfdCampaignFundsPolicyID_CS: true,
        cfdSubtotal_Avalaible_CampaignToken: true,
        cfdSubtotal_Sold_CampaignToken: true,
        cfdSubtotal_Avalaible_ADA: true,
        cfdSubtotal_Collected_ADA: true,
        cfdMinADA: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db

    // #region class methods

    public getNET_id_TN(): string {
        if (isNullOrBlank(super.getNET_id_TN()) === false) return super.getNET_id_TN();
        if (this.smartUTxO !== undefined) {
            const assetsCS = getAssetsFromCS(this.smartUTxO?.assets, this.getNET_id_CS());
            const pid = Object.keys(assetsCS);
            if (pid.length === 1) {
                const TN_Str = hexToStr(pid[0].slice(56));
                return TN_Str;
            }
        }
        return '';
    }

    // #endregion class methods
}
