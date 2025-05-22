import { PostgreSQLAppliedFor} from 'smart-db';
import { BaseEntityPostgreSQL, PostgreSQLDatabaseService } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProtocolAdminWalletEntity } from './ProtocolAdminWallet.Entity';

@PostgreSQLAppliedFor([ProtocolAdminWalletEntity])
@Entity({ name: PostgreSQLDatabaseService.getTableName(ProtocolAdminWalletEntity.className()) })
export class ProtocolAdminWalletEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = ProtocolAdminWalletEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    protocol_id!: string;
    @Column({ type: 'varchar', length: 255 })
    wallet_id!: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof ProtocolAdminWalletEntityPostgreSQL {
        return this.constructor as typeof ProtocolAdminWalletEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof ProtocolAdminWalletEntityPostgreSQL {
        return this as typeof ProtocolAdminWalletEntityPostgreSQL;
    }

    public getStatic(): typeof ProtocolAdminWalletEntity {
        return ProtocolAdminWalletEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof ProtocolAdminWalletEntity;
    }

    public static getStatic(): typeof ProtocolAdminWalletEntity {
        return this.Entity as typeof ProtocolAdminWalletEntity;
    }

    public className(): string {
        return this.getStatic().className();
    }

    public static className(): string {
        return this.getStatic().className();
    }

    // #endregion internal class methods

}
