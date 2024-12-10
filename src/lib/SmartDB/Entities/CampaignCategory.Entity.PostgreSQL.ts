import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignCategoryEntity } from './CampaignCategory.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL  } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([CampaignCategoryEntity])
@Entity({ name: getPostgreSQLTableName(CampaignCategoryEntity.className()) })

export class CampaignCategoryEntityPostgreSQL extends BaseEntityPostgreSQL  {
    protected static Entity = CampaignCategoryEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: "varchar", length: 255  })
    name!:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    description?:string;
    @Column({ type: "varchar", length: 255  })
    createAt!: Date ;
    @Column({ type: "varchar", length: 255 , nullable: true })
    updateAt?: Date ;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CampaignCategoryEntityPostgreSQL {
        return this.constructor as typeof CampaignCategoryEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CampaignCategoryEntityPostgreSQL {
        return this as typeof CampaignCategoryEntityPostgreSQL;
    }

    public getStatic(): typeof CampaignCategoryEntity {
        return CampaignCategoryEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CampaignCategoryEntity;
    }

    public static getStatic(): typeof CampaignCategoryEntity {
        return this.Entity as typeof CampaignCategoryEntity;
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
