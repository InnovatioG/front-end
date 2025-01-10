import {} from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class MilestoneSubmissionEntity extends BaseEntity {
    protected static _apiRoute: string = 'milestonesubmission';
    protected static _className: string = 'MilestoneSubmission';

    // #region fields
    @Convertible({ isDB_id: true })
    milestone_id!: string;
    @Convertible({ isDB_id: true })
    submission_status_id!: string;
    @Convertible({ isDB_id: true })
    submitted_by_wallet_id!: string;
    @Convertible()
    report_proof_of_finalization?: string;
    @Convertible({ isDB_id: true })
    revised_by_wallet_id!: string;
    @Convertible()
    approved_justification?: string;
    @Convertible()
    rejected_justification?: string;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        milestone_id: true,
        submission_status_id: true,
        submitted_by_wallet_id: true,
        revised_by_wallet_id: true,
        report_proof_of_finalization: true,
        approved_justification: true,
        rejected_justification: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
