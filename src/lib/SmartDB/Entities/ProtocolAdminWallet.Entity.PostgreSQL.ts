import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProtocolAdminWalletEntity } from './ProtocolAdminWallet.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([ProtocolAdminWalletEntity])
@Entity({ name: getPostgreSQLTableName(ProtocolAdminWalletEntity.className()) })
export class ProtocolAdminWalletEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = ProtocolAdminWalletEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    protocolId!: string;
    @Column({ type: 'varchar', length: 255 })
    walletId!: string;
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

    // #region posgresql db

    public static PostgreSQLModel() {
        return this;
    }

    // #endregion posgresql db
}
