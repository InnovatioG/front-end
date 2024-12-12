import 'reflect-metadata';
import { Convertible, BaseEntity, asEntity } from 'smart-db';
import {} from 'lucid-cardano';

@asEntity()
export class MilestoneSubmissionEntity extends BaseEntity {
    protected static _apiRoute: string = 'milestonesubmission';
    protected static _className: string = 'MilestoneSubmission';

    // #region fields
    @Convertible()
    milestoneId!: string;
    @Convertible()
    submissionStatusId!: string;
    @Convertible()
    submittedByWalletId!: string;
    @Convertible()
    revisedByWalletId!: string;
    @Convertible()
    reportProofOfFinalization?: string;
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
        milestoneId: true,
        submissionStatusId: true,
        submittedByWalletId: true,
        revisedByWalletId: true,
        reportProofOfFinalization: true,
        approvedJustification: true,
        rejectedJustification: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
