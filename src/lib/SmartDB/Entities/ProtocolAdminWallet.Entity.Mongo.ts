import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { ProtocolAdminWalletEntity } from './ProtocolAdminWallet.Entity';

@MongoAppliedFor([ProtocolAdminWalletEntity])
export class ProtocolAdminWalletEntityMongo extends BaseEntityMongo {
    protected static Entity = ProtocolAdminWalletEntity;
    protected static _mongoTableName: string = ProtocolAdminWalletEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof ProtocolAdminWalletEntityMongo {
        return this.constructor as typeof ProtocolAdminWalletEntityMongo;
    }

    public static getMongoStatic(): typeof ProtocolAdminWalletEntityMongo {
        return this as typeof ProtocolAdminWalletEntityMongo;
    }

    public getStatic(): typeof ProtocolAdminWalletEntity {
        return this.getMongoStatic().getStatic() as typeof ProtocolAdminWalletEntity;
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

    // #region mongo db

    public static MongoModel() {
        interface Interface {
            protocolId: string;
            walletId: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                protocolId: { type: String, required: true },
                walletId: { type: String, required: true },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
