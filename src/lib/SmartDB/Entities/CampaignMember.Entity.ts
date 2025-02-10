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
    name?: string;
    @Convertible()
    last_name?: string;
    @Convertible()
    role?: string;
    @Convertible()
    description?: string;
    @Convertible()
    avatar_url?: string;
    @Convertible()
    editor!: boolean;
    @Convertible()
    admin!: boolean;
    @Convertible()
    email?: string;
    @Convertible({ isDB_id: true })
    wallet_id!: string;
    @Convertible()
    wallet_address?: string;
    @Convertible()
    website?: string;
    @Convertible()
    instagram?: string;
    @Convertible()
    twitter?: string;
    @Convertible()
    discord?: string;
    @Convertible()
    linkedin?: string;
    @Convertible()
    facebook?: string;
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
        campaign_id: true,
        name: true,
        last_name: true,
        rol: true,
        description: true,
        avatar_url: true,
        editor: true,
        admin: true,
        email: true,
        wallet_id: true,
        wallet_address: true,
        website: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        discord: true,
        facebook: true,
        order: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
