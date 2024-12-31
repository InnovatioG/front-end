import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CampaignSubmissionEntity extends BaseEntity {
    protected static _apiRoute: string = 'campaignsubmission';
    protected static _className: string = 'CampaignSubmission';

    // #region fields
    @Convertible({ isDB_id: true })
    campaignId!: string;
    @Convertible({ isDB_id: true })
    submissionStatusId!: string;
    @Convertible({ isDB_id: true })
    submittedByWalletId!: string;
    @Convertible({ isDB_id: true })
    revisedByWalletId!: string;
    @Convertible()
    approvedJustification?: string;
    @Convertible()
    rejectedJustification?: string;
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
        submissionStatusId: true,
        submittedByWalletId: true,
        revisedByWalletId: true,
        approvedJustification: true,
        rejectedJustification: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
