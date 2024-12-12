import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseSmartDBEntityMongo, IBaseSmartDBEntity } from 'smart-db/backEnd';
import { ProtocolEntity } from './Protocol.Entity';

@MongoAppliedFor([ProtocolEntity])
export class ProtocolEntityMongo extends BaseSmartDBEntityMongo {
    protected static Entity = ProtocolEntity;
    protected static _mongoTableName: string = ProtocolEntity.className();

    // #region fields

    // pdProtocolVersion:String
    // pdAdmins:String []
    // pdTokenAdminPolicy_CS:String
    // pdMinADA:String
    // contracts:String []
    // createdAt: Date
    // updatedAt: Date

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof ProtocolEntityMongo {
        return this.constructor as typeof ProtocolEntityMongo;
    }

    public static getMongoStatic(): typeof ProtocolEntityMongo {
        return this as typeof ProtocolEntityMongo;
    }

    public getStatic(): typeof ProtocolEntity {
        return this.getMongoStatic().getStatic() as typeof ProtocolEntity;
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

    // #region mongo db

    public static MongoModel() {
        interface Interface {
            pdProtocolVersion: string;
            pdAdmins: string[];
            pdTokenAdminPolicy_CS: string;
            pdMinADA: string;
            contracts: string[];
        }

        const schema = new Schema<Interface>(
            {
                pdProtocolVersion: { type: String, required: true },
                pdAdmins: { type: [String], required: true },
                pdTokenAdminPolicy_CS: { type: String, required: true },
                pdMinADA: { type: String, required: true },
                contracts: { type: [String], required: true },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
