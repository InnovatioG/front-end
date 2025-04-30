import { type Script } from '@lucid-evolution/lucid';
import { type CS, PostgreSQLAppliedFor} from 'smart-db';
import { BaseSmartDBEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignEntity, CampaignMilestoneDatum } from './Campaign.Entity';

@PostgreSQLAppliedFor([CampaignEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(CampaignEntity.className()) })
export class CampaignEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = CampaignEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaign_category_id!: string;
    @Column({ type: 'varchar', length: 255 })
    campaign_status_id!: string;
    @Column({ type: 'varchar', length: 255 })
    creator_wallet_id!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'text', nullable: true })
    description?: string;
    @Column({ type: 'integer', nullable: true })
    begin_at_days!: number;
    @Column({ type: 'integer', nullable: true })
    deadline_days!: number;
    @Column({ type: 'timestamp', nullable: true })
    campaign_deployed_date!: Date;
    @Column({ type: 'timestamp', nullable: true })
    campaign_actived_date!: Date;

    @Column({ type: 'timestamp', nullable: true })
    begin_at!: Date;
    @Column({ type: 'timestamp', nullable: true })
    deadline!: Date;

    @Column({ type: 'boolean', default: false, nullable: true })
    mint_CampaignToken!: boolean;
    @Column({ type: 'varchar', length: 255, nullable: true })
    campaignToken_CS!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    campaignToken_TN!: string;
    @Column({ type: 'bigint', nullable: true })
    campaignToken_PriceADA!: string;
    @Column({ type: 'bigint', nullable: true })
    requestedMaxADA!: string;
    @Column({ type: 'bigint', nullable: true })
    requestedMinADA!: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    logo_url?: string;
    @Column({ type: 'varchar', length: 1024, nullable: true })
    banner_url?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    website?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    twitter?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    discord?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    linkedin?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    facebook?: string;
    @Column({ type: 'integer', nullable: true })
    visualizations!: number;
    @Column({ type: 'bigint', nullable: true })
    fundedADA!: string;
    @Column({ type: 'bigint', nullable: true })
    collectedADA!: string;
    @Column({ type: 'integer', nullable: true })
    investors!: number;
    @Column({ type: 'bigint', nullable: true })
    tokenomics_max_supply!: string;
    @Column({ type: 'bigint', nullable: true })
    tokenomics_for_campaign!: string;
    @Column({ type: 'text', nullable: true })
    tokenomics_description!: string;

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
    cdBegin_at!: string;
    @Column({ type: 'bigint', nullable: true })
    cdDeadline!: string;
    @Column({ type: 'integer', nullable: true })
    cdStatus!: number;
    @Column({
        type: 'jsonb',
        nullable: true,
        transformer: {
            to: (value: CampaignMilestoneDatum[]) => value,
            from: (value: any) =>
                value
                    ? value.map((m: { cmPerncentage: number; cmStatus: number }) => ({
                          cmPerncentage: m.cmPerncentage,
                          cmStatus: m.cmStatus,
                      }))
                    : [],
        },
    })
    cdMilestones!: CampaignMilestoneDatum[];
    @Column({ type: 'integer', nullable: true })
    cdFundsCount!: number;
    @Column({ type: 'integer', nullable: true })
    cdFundsIndex!: number;
    @Column({ type: 'bigint', nullable: true })
    cdMinADA!: string;

    @Column({ type: 'integer', nullable: true })
    fdpCampaignVersion!: number;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignPolicy_Params!: object;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignPolicy_Script!: Script;
    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    fdpCampaignPolicy_CS!: CS;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignValidator_AddressMainnet!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignValidator_AddressTestnet!: string;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignValidator_Script!: Script;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignValidator_Hash!: string;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignValidator_Params!: object;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignFundsPolicyID_Params!: object;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignFundsPolicyID_Script!: Script;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignFundsPolicyID_CS!: CS;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignFundsValidator_Params!: object;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignFundsValidator_Hash!: string;
    @Column({ type: 'jsonb', nullable: true })
    fdpCampaignFundsValidator_Script!: Script;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignFundsValidator_AddressTestnet!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    fdpCampaignFundsValidator_AddressMainnet!: string;

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

}
