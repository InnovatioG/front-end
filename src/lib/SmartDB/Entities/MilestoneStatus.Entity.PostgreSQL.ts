import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneStatusEntity } from './MilestoneStatus.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([MilestoneStatusEntity])
@Entity({ name: getPostgreSQLTableName(MilestoneStatusEntity.className()) })
export class MilestoneStatusEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = MilestoneStatusEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof MilestoneStatusEntityPostgreSQL {
        return this.constructor as typeof MilestoneStatusEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof MilestoneStatusEntityPostgreSQL {
        return this as typeof MilestoneStatusEntityPostgreSQL;
    }

    public getStatic(): typeof MilestoneStatusEntity {
        return MilestoneStatusEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof MilestoneStatusEntity;
    }

    public static getStatic(): typeof MilestoneStatusEntity {
        return this.Entity as typeof MilestoneStatusEntity;
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
