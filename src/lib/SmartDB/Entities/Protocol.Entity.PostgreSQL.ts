import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProtocolEntity } from './Protocol.Entity';

@PostgreSQLAppliedFor([ProtocolEntity])
@Entity({ name: getPostgreSQLTableName(ProtocolEntity.className()) })
export class ProtocolEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = ProtocolEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'integer', nullable: true })
    pdProtocolVersion!: number;
    @Column({ type: 'varchar', length: 255, array: true, nullable: true })
    pdAdmins!: String[];
    @Column({ type: 'varchar', length: 255, nullable: true })
    pdTokenAdminPolicy_CS!: string;
    @Column({ type: 'bigint', nullable: true })
    pdMinADA!: string;
    @Column({ type: 'varchar', length: 255, array: true, nullable: true })
    contracts!: String[];
    @CreateDateColumn()
    created_at!: Date;
    @UpdateDateColumn()
    updated_at!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof ProtocolEntityPostgreSQL {
        return this.constructor as typeof ProtocolEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof ProtocolEntityPostgreSQL {
        return this as typeof ProtocolEntityPostgreSQL;
    }

    public getStatic(): typeof ProtocolEntity {
        return ProtocolEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof ProtocolEntity;
    }

    public static getStatic(): typeof ProtocolEntity {
        return this.Entity as typeof ProtocolEntity;
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
