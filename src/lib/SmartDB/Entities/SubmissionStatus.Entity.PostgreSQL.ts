import { PostgreSQLAppliedFor} from 'smart-db';
import { BaseEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SubmissionStatusEntity } from './SubmissionStatus.Entity';

@PostgreSQLAppliedFor([SubmissionStatusEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(SubmissionStatusEntity.className()) })
export class SubmissionStatusEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = SubmissionStatusEntity;

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

    public getPostgreSQLStatic(): typeof SubmissionStatusEntityPostgreSQL {
        return this.constructor as typeof SubmissionStatusEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof SubmissionStatusEntityPostgreSQL {
        return this as typeof SubmissionStatusEntityPostgreSQL;
    }

    public getStatic(): typeof SubmissionStatusEntity {
        return SubmissionStatusEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof SubmissionStatusEntity;
    }

    public static getStatic(): typeof SubmissionStatusEntity {
        return this.Entity as typeof SubmissionStatusEntity;
    }

    public className(): string {
        return this.getStatic().className();
    }

    public static className(): string {
        return this.getStatic().className();
    }

    // #endregion internal class methods

}
