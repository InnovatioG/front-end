import { PostgreSQLAppliedFor} from 'smart-db';
import { BaseEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignMemberEntity } from './CampaignMember.Entity';

@PostgreSQLAppliedFor([CampaignMemberEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(CampaignMemberEntity.className()) })
export class CampaignMemberEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignMemberEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaign_id!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    last_name?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    role?: string;
    @Column({ type: 'text', nullable: true })
    description?: string;
    @Column({ type: 'varchar', length: 1024, nullable: true })
    avatar_url?: string;
    @Column({ type: 'boolean', default: false })
    editor!: boolean;
    @Column({ type: 'boolean', default: false })
    admin!: boolean;
    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    wallet_id?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    wallet_address?: string;
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
    @Column({ type: 'integer' })
    order!: number;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignMemberEntityPostgreSQL {
        return this.constructor as typeof CampaignMemberEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignMemberEntityPostgreSQL {
        return this as typeof CampaignMemberEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignMemberEntity {
        return CampaignMemberEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignMemberEntity;
    }

    public static getStatic(): typeof CampaignMemberEntity {
        return this.Entity as typeof CampaignMemberEntity;
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
