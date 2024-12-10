import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignEntity } from './Campaign.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import {  BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';
import { UnixTime,  } from 'lucid-cardano';

@PostgreSQLAppliedFor([CampaignEntity])
@Entity({ name: getPostgreSQLTableName(CampaignEntity.className()) })

export class CampaignEntityPostgreSQL extends  BaseSmartDBEntityPostgreSQL {
    protected static Entity = CampaignEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: "varchar", length: 255  })
    projectId!:string;
    @Column({ type: "varchar", length: 255  })
    campaingCategoryId!:string;
    @Column({ type: "varchar", length: 255  })
    campaignStatusId!:string;
    @Column({ type: "varchar", length: 255  })
    creatorWalletId!:string;
    @Column({ type: "varchar", length: 255  })
    cdCampaignVersion!:string;
    @Column({ type: "varchar", length: 255  })
    cdCampaignPolicy_CS!:string;
    @Column({ type: "varchar", length: 255  })
    cdCampaignFundsPolicyID_CS!:string;
    @Column({ type: "varchar", length: 255  })
    cdAdmins!:[String];
    @Column({ type: "varchar", length: 255  })
    cdTokenAdminPolicy_CS!:string;
    @Column({ type: "varchar", length: 255  })
    cdMint_CampaignToken!:boolean;
    @Column({ type: "varchar", length: 255  })
    cdCampaignToken_CS!:string;
    @Column({ type: "varchar", length: 255  })
    cdCampaignToken_TN!:string;
    @Column({ type: "varchar", length: 255  })
    cdCampaignToken_PriceADA!:string;
    @Column({ type: "varchar", length: 255  })
    cdRequestedMaxADA!:string;
    @Column({ type: "varchar", length: 255  })
    cdRequestedMinADA!:string;
    @Column({ type: "varchar", length: 255  })
    cdFundedADA!:string;
    @Column({ type: "varchar", length: 255  })
    cdCollectedADA!:string;
    @Column({ type: "varchar", length: 255  })
    cdBeginAt!: Date ;
    @Column({ type: "varchar", length: 255  })
    cdDeadline!: Date ;
    @Column({ type: "int"  })
    cdStatus!:number;
    @Column({ type: "varchar", length: 255  })
    cdMilestones!:string;
    @Column({ type: "int"  })
    cdFundsCount!:number;
    @Column({ type: "int"  })
    cdFundsIndex!:number;
    @Column({ type: "varchar", length: 255  })
    cdMinADA!:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    description?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    logoUrl?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    bannerUrl?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    website?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    instagram?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    twitter?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    discord?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    facebook?:string;
    @Column({ type: "int"  })
    investors!:number;
    @Column({ type: "varchar", length: 255  })
    tokenomicsMaxSupply!:string;
    @Column({ type: "varchar", length: 255  })
    tokenomicsDescription!:string;
    @Column({ type: "varchar", length: 255  })
    featured!:boolean;
    @Column({ type: "varchar", length: 255  })
    archived!:boolean;
    @Column({ type: "varchar", length: 255  })
    createAt!: Date ;
    @Column({ type: "varchar", length: 255 , nullable: true })
    updateAt?: Date ;

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
