import { PostgreSQLAppliedFor} from 'smart-db';
import { BaseEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignStatusEntity } from './CampaignStatus.Entity';

@PostgreSQLAppliedFor([CampaignStatusEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(CampaignStatusEntity.className()) })
export class CampaignStatusEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignStatusEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'integer' })
    code_id!: number;
    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'text', nullable: true })
    description?: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignStatusEntityPostgreSQL {
        return this.constructor as typeof CampaignStatusEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignStatusEntityPostgreSQL {
        return this as typeof CampaignStatusEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignStatusEntity {
        return CampaignStatusEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignStatusEntity;
    }

    public static getStatic(): typeof CampaignStatusEntity {
        return this.Entity as typeof CampaignStatusEntity;
    }

    public className(): string {
        return this.getStatic().className();
    }

    public static className(): string {
        return this.getStatic().className();
    }

    // #endregion internal class methods

}
