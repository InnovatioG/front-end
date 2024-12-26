import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneEntity } from './Milestone.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([MilestoneEntity])
@Entity({ name: getPostgreSQLTableName(MilestoneEntity.className()) })
export class MilestoneEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = MilestoneEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaignId!: string;
    @Column({ type: 'varchar', length: 255 })
    campaignStatusId!: string;
    @Column({ type: 'date' })
    cmEstimateDeliveryDate!: Date;
    @Column({ type: 'int' })
    cmPercentage!: number;
    @Column({ type: 'int' })
    cmStatus!: number;
    @Column({ type: 'varchar', length: 255 })
    description!: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof MilestoneEntityPostgreSQL {
        return this.constructor as typeof MilestoneEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof MilestoneEntityPostgreSQL {
        return this as typeof MilestoneEntityPostgreSQL;
    }

    public getStatic(): typeof MilestoneEntity {
        return MilestoneEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof MilestoneEntity;
    }

    public static getStatic(): typeof MilestoneEntity {
        return this.Entity as typeof MilestoneEntity;
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
