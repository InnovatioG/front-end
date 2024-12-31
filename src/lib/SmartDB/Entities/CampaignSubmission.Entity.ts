import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignSubmissionEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignsubmission';
    protected static _className: string = 'CampaignSubmission';

    // #region fields
    @Convertible({ isDB_id: true })
    campaign_id!: string;
    @Convertible({ isDB_id: true })
    submission_status_id!: string;
    @Convertible({ isDB_id: true })
    submitted_by_wallet_id!: string;
    @Convertible({ isDB_id: true })
    revised_by_wallet_id!: string;
    @Convertible()
    approved_justification?: string;
    @Convertible()
    rejected_justification?: string;
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
        submission_status_id: true,
        submitted_by_wallet_id: true,
        revised_by_wallet_id: true,
        approved_justification: true,
        rejected_justification: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
