import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneSubmissionEntity } from './MilestoneSubmission.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([MilestoneSubmissionEntity])
@Entity({ name: getPostgreSQLTableName(MilestoneSubmissionEntity.className()) })
export class MilestoneSubmissionEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = MilestoneSubmissionEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    milestoneId!: string;
    @Column({ type: 'varchar', length: 255 })
    submissionStatusId!: string;
    @Column({ type: 'varchar', length: 255 })
    submittedByWalletId!: string;
    @Column({ type: 'varchar', length: 255 })
    revisedByWalletId!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    reportProofOfFinalization?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    approvedJustification?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    rejectedJustification?: string;
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

    // #region posgresql db

    public static PostgreSQLModel() {
        return this;
    }

    // #endregion posgresql db
}
