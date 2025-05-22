import { PostgreSQLAppliedFor} from 'smart-db';
import { BaseEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneSubmissionEntity } from './MilestoneSubmission.Entity';

@PostgreSQLAppliedFor([MilestoneSubmissionEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(MilestoneSubmissionEntity.className()) })
export class MilestoneSubmissionEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = MilestoneSubmissionEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    milestone_id!: string;
    @Column({ type: 'varchar', length: 255 })
    submission_status_id!: string;
    @Column({ type: 'varchar', length: 255 })
    submitted_by_wallet_id!: string;
    @Column({ type: 'text' })
    report_proof_of_finalization?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    revised_by_wallet_id!: string;
    @Column({ type: 'text', nullable: true })
    approved_justification?: string;
    @Column({ type: 'text', nullable: true })
    rejected_justification?: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof MilestoneSubmissionEntityPostgreSQL {
        return this.constructor as typeof MilestoneSubmissionEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof MilestoneSubmissionEntityPostgreSQL {
        return this as typeof MilestoneSubmissionEntityPostgreSQL;
    }

    public getStatic(): typeof MilestoneSubmissionEntity {
        return MilestoneSubmissionEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof MilestoneSubmissionEntity;
    }

    public static getStatic(): typeof MilestoneSubmissionEntity {
        return this.Entity as typeof MilestoneSubmissionEntity;
    }

    public className(): string {
        return this.getStatic().className();
    }

    public static className(): string {
        return this.getStatic().className();
    }

    // #endregion internal class methods

}
