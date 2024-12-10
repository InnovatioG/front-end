import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CustomWalletEntity } from './CustomWallet.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL  } from 'smart-db/backEnd';
import {type PaymentKeyHash, type StakeKeyHash,type  Address,  } from 'lucid-cardano';

@PostgreSQLAppliedFor([CustomWalletEntity])
@Entity({ name: getPostgreSQLTableName(CustomWalletEntity.className()) })

export class CustomWalletEntityPostgreSQL extends BaseEntityPostgreSQL  {
    protected static Entity = CustomWalletEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: "varchar", length: 255  })
    createdBy!:string;
    @Column({ type: "varchar", length: 255  })
    lastConnection!: Date ;
    @Column({ type: "varchar", length: 255  })
    walletUsed!:string;
    @Column({ type: "varchar", length: 255  })
    walletValidatedWithSignedToken!:boolean;
    @Column({ type: "varchar", length: 255  })
    paymentPkh!: PaymentKeyHash ;
    @Column({ type: "varchar", length: 255  })
    stakePkh!: StakeKeyHash ;
    @Column({ type: "varchar", length: 255  })
    name!:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    email?:string;
    @Column({ type: "varchar", length: 255 , nullable: true })
    validatedEmail?:string;
    @Column({ type: "varchar", length: 255  })
    testnetAddress!: Address ;
    @Column({ type: "varchar", length: 255  })
    mainnetAddress!: Address ;
    @Column({ type: "varchar", length: 255  })
    createAt!: Date ;
    @Column({ type: "varchar", length: 255 , nullable: true })
    updateAt?: Date ;

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
