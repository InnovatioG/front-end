import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { MilestoneEntity } from './Milestone.Entity';
import { BaseEntityMongo } from 'smart-db/backEnd';

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

    public static MongoModel() {
        interface Interface {
            campaign_id: string;
            milestone_status_id: string;
            estimate_delivery_date: Date;
            percentage: number;
            status: number;
            description: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                campaign_id: { type: String, required: true },
                milestone_status_id: { type: String, required: true },
                estimate_delivery_date: { type: Date, required: true },
                percentage: { type: Number, required: true },
                status: { type: Number, required: true },
                description: { type: String, required: true },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
