import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseSmartDBEntityMongo, IBaseSmartDBEntity } from 'smart-db/backEnd';
import { MilestoneEntity } from './Milestone.Entity';

@MongoAppliedFor([MilestoneEntity])
export class MilestoneEntityMongo extends BaseSmartDBEntityMongo {
    protected static Entity = MilestoneEntity;
    protected static _mongoTableName: string = MilestoneEntity.className();

    // #region fields

    // campaignId:ID
    // campaignStatusId:ID
    // cmEstimateDeliveryDate:Int
    // cmPercentage:Int
    // cmStatus:Int
    // description:String

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof MilestoneEntityMongo {
        return this.constructor as typeof MilestoneEntityMongo;
    }

    public static getMongoStatic(): typeof MilestoneEntityMongo {
        return this as typeof MilestoneEntityMongo;
    }

    public getStatic(): typeof MilestoneEntity {
        return this.getMongoStatic().getStatic() as typeof MilestoneEntity;
    }

    public static getStatic(): typeof MilestoneEntity {
        return this.Entity as typeof MilestoneEntity;
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
            campaignId: string;
            campaignStatusId: string;
            cmEstimateDeliveryDate: Date;
            cmPercentage: number;
            cmStatus: number;
            description: string;
        }

        const schema = new Schema<Interface>(
            {
                campaignId: { type: String, required: true },
                campaignStatusId: { type: String, required: true },
                cmEstimateDeliveryDate: { type: Date, required: true },
                cmPercentage: { type: Number, required: true },
                cmStatus: { type: Number, required: true },
                description: { type: String, required: true },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
