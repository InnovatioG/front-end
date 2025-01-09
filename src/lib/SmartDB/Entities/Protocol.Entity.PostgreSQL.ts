import { type Script } from 'lucid-cardano';
import { type CS, PostgreSQLAppliedFor, getPostgreSQLTableName } from 'smart-db';
import { BaseSmartDBEntityPostgreSQL } from 'smart-db/backEnd';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CampaignFactory, ProtocolEntity } from './Protocol.Entity';

@PostgreSQLAppliedFor([ProtocolEntity])
@Entity({ name: getPostgreSQLTableName(ProtocolEntity.className()) })
export class ProtocolEntityPostgreSQL extends BaseSmartDBEntityPostgreSQL {
    protected static Entity = ProtocolEntity;

    // #region fields

    @PrimaryGeneratedColumn()
    _id!: number; // Auto-generated primary key

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'integer' })
    fdpProtocolVersion!: number;

    @Column({ type: 'integer' })
    fdpScriptVersion!: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    fdpProtocolPolicyID_CS!: CS;

    @Column({ type: 'jsonb' })
    fdpProtocolPolicyID_Script!: Script;

    @Column({ type: 'jsonb' })
    fdpProtocolPolicyID_Params!: object;

    @Column({ type: 'varchar', length: 255 })
    fdpProtocolValidator_AddressMainnet!: string;

    @Column({ type: 'varchar', length: 255 })
    fdpProtocolValidator_AddressTestnet!: string;

    @Column({ type: 'jsonb' })
    fdpProtocolValidator_Script!: Script;

    @Column({ type: 'varchar', length: 255, unique: true })
    fdpProtocolValidator_Hash!: string;

    @Column({ type: 'jsonb' })
    fdpProtocolValidator_Params!: object;

    @Column({ type: 'varchar', length: 255 })
    fdpScriptPolicyID_CS!: CS;

    @Column({ type: 'jsonb' })
    fdpScriptPolicyID_Script!: Script;

    @Column({ type: 'jsonb' })
    fdpScriptPolicyID_Params!: object;

    @Column({ type: 'varchar', length: 255 })
    fdpScriptValidator_AddressMainnet!: string;

    @Column({ type: 'varchar', length: 255 })
    fdpScriptValidator_AddressTestnet!: string;

    @Column({ type: 'jsonb' })
    fdpScriptValidator_Script!: Script;

    @Column({ type: 'varchar', length: 255 })
    fdpScriptValidator_Hash!: string;

    @Column({ type: 'jsonb' })
    fdpScriptValidator_Params!: object;

    @Column({ type: 'jsonb' })
    fdpCampaignFactories!: CampaignFactory[];

    @Column({ type: 'integer', nullable: true })
    pdProtocolVersion!: number;
    @Column({ type: 'varchar', length: 255, array: true, nullable: true })
    pdAdmins!: String[];
    @Column({ type: 'varchar', length: 255, nullable: true })
    pdTokenAdminPolicy_CS!: string;
    @Column({ type: 'bigint', nullable: true })
    pdMinADA!: string;

    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

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
