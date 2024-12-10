import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ProtocolEntity } from './Protocol.Entity';
import { PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import {  BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';

@PostgreSQLAppliedFor([ProtocolEntity])
@Entity({ name: getPostgreSQLTableName(ProtocolEntity.className()) })

export class ProtocolEntityPostgreSQL extends  BaseSmartDBEntityPostgreSQL {
    protected static Entity = ProtocolEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: "varchar", length: 255  })
    pdProtocolVersion!:string;
    @Column({ type: "varchar", length: 255  })
    pdAdmins!:[String];
    @Column({ type: "varchar", length: 255  })
    pdTokenAdminPolicy_CS!:string;
    @Column({ type: "varchar", length: 255  })
    pdMinADA!:string;
    @Column({ type: "varchar", length: 255  })
    contracts!:[String];
    @Column({ type: "varchar", length: 255  })
    createAt!: Date ;
    @Column({ type: "varchar", length: 255 , nullable: true })
    updateAt?: Date ;

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
