import { PostgreSQLAppliedFor} from 'smart-db';
import { BaseEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MilestoneStatusEntity } from './MilestoneStatus.Entity';

@PostgreSQLAppliedFor([MilestoneStatusEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(MilestoneStatusEntity.className()) })
export class MilestoneStatusEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = MilestoneStatusEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'integer' })
    code_id!: number;
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

}
