import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneEntity } from './Milestone.Entity';

@PostgreSQLAppliedFor([MilestoneEntity])
@Entity({ name: getPostgreSQLTableName(MilestoneEntity.className()) })
export class MilestoneEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = MilestoneEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    campaign_id!: string;
    @Column({ type: 'varchar', length: 255 })
    milestone_status_id!: string;
    @Column({ type: 'integer' })
    estimate_delivery_days!: number;
    @Column({ type: 'date', nullable: true })
    estimate_delivery_date!: Date;
    @Column({ type: 'integer' })
    percentage!: number;
    @Column({ type: 'text' })
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
