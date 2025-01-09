import {} from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignCategoryEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaigncategory';
    protected static _className: string = 'CampaignCategory';

    // #region fields
    @Convertible()
    id_internal!: number;
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
        internal_id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
