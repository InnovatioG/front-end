import { Maybe, PostgreSQLAppliedFor, StakeCredentialPubKeyHash, getPostgreSQLTableName } from 'smart-db';
import { BaseEntityPostgreSQL, BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ScriptEntity } from './Script.Entity';

@PostgreSQLAppliedFor([ScriptEntity])
@Entity({ name: getPostgreSQLTableName(ScriptEntity.className()) })
export class ScriptEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = ScriptEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'integer', length: 255 })
    sdVersion!: number;
    @Column({ type: 'varchar', length: 255, nullable: true })
    sdAdminPaymentPKH?: string;
    @Column({
        type: 'jsonb',
        nullable: true,
        // transformer: {
        //     to: (value: Maybe<StakeCredentialPubKeyHash>) => value,
        //     from: (value: any) =>
        //         value
        //             ? value.map((m: { cmEstimatedDeliveryDate: number; cmPerncentage: number; cmStatus: number }) => ({
        //                   cmEstimatedDeliveryDate: BigInt(m.cmEstimatedDeliveryDate),
        //                   cmPerncentage: m.cmPerncentage,
        //                   cmStatus: m.cmStatus,
        //               }))
        //             : [],
        // },
    })
    sdAdminStakePKH?: Maybe<StakeCredentialPubKeyHash>;
    @Column({ type: 'varchar', length: 255, nullable: true })
    sdScriptHash?: string;
    @CreateDateColumn()
    created_at!: Date;
    @UpdateDateColumn()
    updated_at!: Date;

    // #endregion fields

    // #region internal class methods

    public getPostgreSQLStatic(): typeof ScriptEntityPostgreSQL {
        return this.constructor as typeof ScriptEntityPostgreSQL;
    }

    public static getPostgreSQLStatic(): typeof ScriptEntityPostgreSQL {
        return this as typeof ScriptEntityPostgreSQL;
    }

    public getStatic(): typeof ScriptEntity {
        return ScriptEntityPostgreSQL.getPostgreSQLStatic().getStatic() as typeof ScriptEntity;
    }

    public static getStatic(): typeof ScriptEntity {
        return this.Entity as typeof ScriptEntity;
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
