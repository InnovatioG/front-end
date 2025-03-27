import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { MilestoneEntity } from './Milestone.Entity';

@MongoAppliedFor([MilestoneEntity])
export class MilestoneEntityMongo extends BaseEntityMongo {
    protected static Entity = MilestoneEntity;
    protected static _mongoTableName: string = MilestoneEntity.className();

    // #region fields

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

    public static DBModel() {
        interface Interface {
            campaign_id: string;
            milestone_status_id: string;
            estimate_delivery_days: number;
            estimate_delivery_date: Date;
            percentage: number;
            description: string;
            order: number;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                campaign_id: { type: String, required: true },
                milestone_status_id: { type: String, required: true },
                estimate_delivery_days: { type: Number, required: false },
                estimate_delivery_date: { type: Date, required: false },
                percentage: { type: Number, required: false },
                description: { type: String, required: false },
                order: { type: Number, required: true }

            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
