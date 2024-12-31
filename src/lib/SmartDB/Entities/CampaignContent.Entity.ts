import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignContentEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaigncontent';
    protected static _className: string = 'CampaignContent';

    // #region fields
    @Convertible({ isDB_id: true })
    campaign_id!: string;
    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    @Convertible()
    order!: number;
    @Convertible({ isCreatedAt: true })
    created_at!: Date;
    @Convertible({ isUpdatedAt: true })
    updated_at?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        campaign_id: true,
        name: true,
        description: true,
        order: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
