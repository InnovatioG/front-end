import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignFundsEntity } from './CampaignFunds.Entity';

@PostgreSQLAppliedFor([CampaignFundsEntity])
@Entity({ name: getPostgreSQLTableName(CampaignFundsEntity.className()) })
export class CampaignFundsEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = CampaignFundsEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'integer', nullable: true })
    cfdIndex!: number;
    @Column({ type: 'varchar', length: 255, nullable: true })
    cfdCampaignPolicy_CS!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    cfdCampaignFundsPolicyID_CS!: string;
    @Column({ type: 'bigint', nullable: true })
    cfdSubtotal_Avalaible_CampaignToken!: string;
    @Column({ type: 'bigint', nullable: true })
    cfdSubtotal_Sold_CampaignToken!: string;
    @Column({ type: 'bigint', nullable: true })
    cfdSubtotal_Avalaible_ADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cfdSubtotal_Collected_ADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cfdMinADA!: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignFundsEntityPostgreSQL {
        return this.constructor as typeof CampaignFundsEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignFundsEntityPostgreSQL {
        return this as typeof CampaignFundsEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignFundsEntity {
        return CampaignFundsEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignFundsEntity;
    }

    public static getStatic(): typeof CampaignFundsEntity {
        return this.Entity as typeof CampaignFundsEntity;
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
