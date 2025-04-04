import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneStatusEntity } from './MilestoneStatus.Entity';

@PostgreSQLAppliedFor([MilestoneStatusEntity])
@Entity({ name: getPostgreSQLTableName(MilestoneStatusEntity.className()) })
export class MilestoneStatusEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = MilestoneStatusEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'integer' })
    id_internal!: number;
    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'text', nullable: true })
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
