import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignFaqsEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignfaqs';
    protected static _className: string = 'CampaignFaqs';

    // #region fields
    @Convertible({ isDB_id: true })
    campaignId!: string;
    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    @Convertible()
    order!: number;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

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
