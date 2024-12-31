import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignMemberEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignmember';
    protected static _className: string = 'CampaignMember';

    // #region fields
    @Convertible({ isDB_id: true })
    campaign_id!: string;
    @Convertible()
    editor!: boolean;
    @Convertible({ isDB_id: true })
    wallet_id!: string;
    @Convertible()
    rol?: string;
    @Convertible()
    description?: string;
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
        editor: true,
        wallet_id: true,
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
