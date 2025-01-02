import { type Address, type PaymentKeyHash, type StakeKeyHash } from 'lucid-cardano';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomWalletEntity } from './CustomWallet.Entity';

@PostgreSQLAppliedFor([CustomWalletEntity])
@Entity({ name: getPostgreSQLTableName(CustomWalletEntity.className()) })
export class CustomWalletEntityPostgreSQL extends BaseEntityPostgreSQL {
    protected static Entity = CustomWalletEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    created_by!: string;
    @Column({ type: 'varchar', length: 255 })
    last_connection!: Date;
    @Column({ type: 'varchar', length: 255 })
    wallet_used!: string;
    @Column({ type: 'boolean', default: false })
    wallet_validated_with_signed_token!: boolean
    @Column({ type: 'varchar', length: 255 })
    payment_pkh!: PaymentKeyHash;
    @Column({ type: 'varchar', length: 255 })
    stakePkh!: StakeKeyHash;
    @Column({ type: 'varchar', length: 255 })
    name!: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    validated_email?: string;
    @Column({ type: 'varchar', length: 255 })
    testnet_address!: Address;
    @Column({ type: 'varchar', length: 255 })
    mainnet_address!: Address;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof CustomWalletEntityPostgreSQL {
        return this.constructor as typeof CustomWalletEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof CustomWalletEntityPostgreSQL {
        return this as typeof CustomWalletEntityPostgreSQL;
    }

    public getStatic(): typeof CustomWalletEntity {
        return CustomWalletEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof CustomWalletEntity;
    }

    public static getStatic(): typeof CustomWalletEntity {
        return this.Entity as typeof CustomWalletEntity;
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
