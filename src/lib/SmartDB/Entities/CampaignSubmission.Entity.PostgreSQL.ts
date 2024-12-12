import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignSubmissionEntity } from './CampaignSubmission.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([CampaignSubmissionEntity])
@Entity({ name: getPostgreSQLTableName(CampaignSubmissionEntity.className()) })
export class CampaignSubmissionEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignSubmissionEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaignId!: string;
    @Column({ type: 'varchar', length: 255 })
    submissionStatusId!: string;
    @Column({ type: 'varchar', length: 255 })
    submittedByWalletId!: string;
    @Column({ type: 'varchar', length: 255 })
    revisedByWalletId!: string;
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

    public getPostgreSQLStatic(): typeof CampaignSubmissionEntityPostgreSQL {
        return this.constructor as typeof CampaignSubmissionEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignSubmissionEntityPostgreSQL {
        return this as typeof CampaignSubmissionEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignSubmissionEntity {
        return CampaignSubmissionEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignSubmissionEntity;
    }

    public static getStatic(): typeof CampaignSubmissionEntity {
        return this.Entity as typeof CampaignSubmissionEntity;
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
