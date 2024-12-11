import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignFaqsEntity } from './CampaignFaqs.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([CampaignFaqsEntity])
@Entity({ name: getPostgreSQLTableName(CampaignFaqsEntity.className()) })
export class CampaignFaqsEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignFaqsEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaignId!: string;
    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;
    @Column({ type: 'varchar', length: 255 })
    order!: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignFaqsEntityPostgreSQL {
        return this.constructor as typeof CampaignFaqsEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignFaqsEntityPostgreSQL {
        return this as typeof CampaignFaqsEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignFaqsEntity {
        return CampaignFaqsEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignFaqsEntity;
    }

    public static getStatic(): typeof CampaignFaqsEntity {
        return this.Entity as typeof CampaignFaqsEntity;
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
