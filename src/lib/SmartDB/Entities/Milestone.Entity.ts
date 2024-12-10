import 'reflect-metadata';
import { Convertible, BaseSmartDBEntity, asSmartDBEntity } from 'smart-db';
import {  } from 'lucid-cardano';

@asSmartDBEntity()
export class MilestoneEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'milestone';
    protected static _className: string = 'Milestone';

    protected static _plutusDataIsSubType = false;
    protected static _is_NET_id_Unique = false;
    _NET_id_TN: string = 'MilestoneID';

    // #region fields
    @Convertible()
    campaignId!: string;
    @Convertible()
    campaignStatusId!: string;
    @Convertible( { isForDatum: true,  } )
    cmEstimateDeliveryDate!: number;
    @Convertible( { isForDatum: true,  } )
    cmPercentage!: number;
    @Convertible( { isForDatum: true,  } )
    cmStatus!: number;
    @Convertible()
    description!: string;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
          campaignId: true,
          campaignStatusId: true,
          cmEstimateDeliveryDate: true,
          cmPercentage: true,
          cmStatus: true,
          description: true,
    };

    // #endregion db
}


