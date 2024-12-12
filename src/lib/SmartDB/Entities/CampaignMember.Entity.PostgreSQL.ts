import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignMemberEntity } from './CampaignMember.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([CampaignMemberEntity])
@Entity({ name: getPostgreSQLTableName(CampaignMemberEntity.className()) })
export class CampaignMemberEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CampaignMemberEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaignId!: string;
    @Column({ type: 'varchar', length: 255 })
    editor!: boolean;
    @Column({ type: 'varchar', length: 255 })
    walletId!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    rol?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;
    @Column({ type: 'varchar', length: 255 })
    website!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    twitter?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    discord?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    facebook?: string;
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
