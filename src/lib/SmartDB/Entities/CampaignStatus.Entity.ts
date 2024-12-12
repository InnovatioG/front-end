import 'reflect-metadata';
import { Convertible, BaseEntity, asEntity } from 'smart-db';
import {} from 'lucid-cardano';

@asEntity()
export class CampaignStatusEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignstatus';
    protected static _className: string = 'CampaignStatus';

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
