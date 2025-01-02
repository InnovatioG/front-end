import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignContentEntity } from './CampaignContent.Entity';

@PostgreSQLAppliedFor([CampaignContentEntity])
@Entity({ name: getPostgreSQLTableName(CampaignContentEntity.className()) })
export class CampaignContentEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignContentEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaign_id!: string;
    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'text', nullable: true })
    description?: string;
    @Column({ type: 'integer' })
    order!: number;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignContentEntityPostgreSQL {
        return this.constructor as typeof CampaignContentEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignContentEntityPostgreSQL {
        return this as typeof CampaignContentEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignContentEntity {
        return CampaignContentEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignContentEntity;
    }

    public static getStatic(): typeof CampaignContentEntity {
        return this.Entity as typeof CampaignContentEntity;
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
