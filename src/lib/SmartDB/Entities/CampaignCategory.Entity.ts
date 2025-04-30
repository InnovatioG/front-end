import {} from '@lucid-evolution/lucid';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignCategoryEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaigncategory';
    protected static _className: string = 'CampaignCategory';

    // #region fields
    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
