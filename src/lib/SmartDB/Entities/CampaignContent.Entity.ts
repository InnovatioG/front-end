import 'reflect-metadata';
import { Convertible, BaseEntity, asEntity } from 'smart-db';
import {  } from 'lucid-cardano';

@asEntity()
export class CampaignContentEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaigncontent';
    protected static _className: string = 'CampaignContent';


    // #region fields
    @Convertible()
    campaignId!: string;
    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    @Convertible()
    order!: string;
    @Convertible()
    createdAt!:  Date ;
    @Convertible()
    updatedAt?:  Date ;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
          campaignId: true,
          name: true,
          description: true,
          order: true,
          createdAt: true,
          updatedAt: true,
    };

    // #endregion db
}


