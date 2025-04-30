import { } from '@lucid-evolution/lucid';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignFaqsEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignfaqs';
    protected static _className: string = 'CampaignFaqs';

    // #region fields
    @Convertible({ isDB_id: true })
    campaign_id!: string;
    @Convertible()
    question!: string;
    @Convertible()
    answer?: string;
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
        question: true,
        answer: true,
        order: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
