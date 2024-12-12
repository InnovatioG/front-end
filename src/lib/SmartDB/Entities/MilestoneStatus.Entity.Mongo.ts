import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { MilestoneStatusEntity } from './MilestoneStatus.Entity';

@MongoAppliedFor([MilestoneStatusEntity])
export class MilestoneStatusEntityMongo extends BaseEntityMongo {
    protected static Entity = MilestoneStatusEntity;
    protected static _mongoTableName: string = MilestoneStatusEntity.className();

    // #region fields

    // name:String
    // description:String
    // createdAt: Date
    // updatedAt: Date

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof MilestoneStatusEntityMongo {
        return this.constructor as typeof MilestoneStatusEntityMongo;
    }

    public static getMongoStatic(): typeof MilestoneStatusEntityMongo {
        return this as typeof MilestoneStatusEntityMongo;
    }

    public getStatic(): typeof MilestoneStatusEntity {
        return this.getMongoStatic().getStatic() as typeof MilestoneStatusEntity;
    }

    public static getStatic(): typeof MilestoneStatusEntity {
        return this.Entity as typeof MilestoneStatusEntity;
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
            name: string;
            description: string;
        }

        const schema = new Schema<Interface>(
            {
                name: { type: String, required: true },
                description: { type: String, required: false },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
