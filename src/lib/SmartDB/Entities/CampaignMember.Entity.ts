import 'reflect-metadata';
import { Convertible, BaseEntity, asEntity } from 'smart-db';
import {} from 'lucid-cardano';

@asEntity()
export class CampaignMemberEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignmember';
    protected static _className: string = 'CampaignMember';

    // #region fields
    @Convertible()
    campaignId!: string;
    @Convertible()
    editor!: boolean;
    @Convertible()
    walletId!: string;
    @Convertible()
    rol?: string;
    @Convertible()
    description?: string;
    @Convertible()
    website!: string;
    @Convertible()
    instagram?: string;
    @Convertible()
    twitter?: string;
    @Convertible()
    discord?: string;
    @Convertible()
    facebook?: string;
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
        editor: true,
        walletId: true,
        rol: true,
        description: true,
        website: true,
        instagram: true,
        twitter: true,
        discord: true,
        facebook: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
