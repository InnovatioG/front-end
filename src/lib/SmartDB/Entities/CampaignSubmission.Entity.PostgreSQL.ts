import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignSubmissionEntity } from './CampaignSubmission.Entity';

@PostgreSQLAppliedFor([CampaignSubmissionEntity])
@Entity({ name: getPostgreSQLTableName(CampaignSubmissionEntity.className()) })
export class CampaignSubmissionEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignSubmissionEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaign_id!: string;
    @Column({ type: 'varchar', length: 255 })
    submission_status_id!: string;
    @Column({ type: 'varchar', length: 255 })
    submitted_by_wallet_id!: string;
    @Column({ type: 'varchar', length: 255 })
    revised_by_wallet_id!: string;
    @Column({ type: 'text', nullable: true })
    approved_justification?: string;
    @Column({ type: 'text', nullable: true })
    rejected_justification?: string;
    @CreateDateColumn()
    created_at!: Date;
    @UpdateDateColumn()
    updated_at!: Date;

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
