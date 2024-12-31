import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignEntity, CampaignMilestone } from './Campaign.Entity';

@PostgreSQLAppliedFor([CampaignEntity])
@Entity({ name: getPostgreSQLTableName(CampaignEntity.className()) })
export class CampaignEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = CampaignEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    projectId!: string;
    @Column({ type: 'varchar', length: 255 })
    campaingCategoryId!: string;
    @Column({ type: 'varchar', length: 255 })
    campaignStatusId!: string;
    @Column({ type: 'varchar', length: 255 })
    creatorWalletId!: string;
    @Column({ type: 'integer', nullable: true })
    cdCampaignVersion!: number;
    @Column({ type: 'varchar', length: 255, nullable: true })
    cdCampaignPolicy_CS!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    cdCampaignFundsPolicyID_CS!: string;
    @Column({ type: 'varchar', length: 255, array: true, nullable: true })
    cdAdmins!: String[];
    @Column({ type: 'varchar', length: 255, nullable: true })
    cdTokenAdminPolicy_CS!: string;
    @Column({ type: 'boolean', default: false, nullable: true })
    cdMint_CampaignToken!: boolean;
    @Column({ type: 'varchar', length: 255, nullable: true })
    cdCampaignToken_CS!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    cdCampaignToken_TN!: string;
    @Column({ type: 'bigint', nullable: true })
    cdCampaignToken_PriceADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cdRequestedMaxADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cdRequestedMinADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cdFundedADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cdCollectedADA!: string;
    @Column({ type: 'bigint', nullable: true })
    cdBeginAt!: string;
    @Column({ type: 'bigint', nullable: true })
    cdDeadline!: string;
    @Column({ type: 'integer', nullable: true })
    cdStatus!: number;
    @Column({
        type: 'jsonb',
        nullable: true,
        transformer: {
            to: (value: CampaignMilestone[]) => value,
            from: (value: any) =>
                value
                    ? value.map((m: { cmEstimatedDeliveryDate: number; cmPerncentage: number; cmStatus: number; }) => ({
                          cmEstimatedDeliveryDate: BigInt(m.cmEstimatedDeliveryDate),
                          cmPerncentage: m.cmPerncentage,
                          cmStatus: m.cmStatus,
                      }))
                    : [],
        },
    })
    cdMilestones!: CampaignMilestone[];
    @Column({ type: 'integer', nullable: true })
    cdFundsCount!: number;
    @Column({ type: 'integer', nullable: true })
    cdFundsIndex!: number;
    @Column({ type: 'bigint', nullable: true })
    cdMinADA!: string;
    @Column({ type: 'text', nullable: true })
    description?: string;
    @Column({ type: 'timestamp', nullable: true })
    beginAt!: Date;
    @Column({ type: 'timestamp', nullable: true })
    deadline!: Date;
    @Column({ type: 'varchar', length: 255, nullable: true })
    logoUrl?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    bannerUrl?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    website?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    twitter?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    discord?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    facebook?: string;
    @Column({ type: 'integer', nullable: true })
    investors!: number;
    @Column({ type: 'bigint', nullable: true })
    tokenomicsMaxSupply!: string;
    @Column({ type: 'text', nullable: true })
    tokenomicsDescription!: string;
    @Column({ type: 'boolean', default: false })
    featured!: boolean;
    @Column({ type: 'boolean', default: false })
    archived!: boolean;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignEntityPostgreSQL {
        return this.constructor as typeof CampaignEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignEntityPostgreSQL {
        return this as typeof CampaignEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignEntity {
        return CampaignEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignEntity;
    }

    public static getStatic(): typeof CampaignEntity {
        return this.Entity as typeof CampaignEntity;
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
