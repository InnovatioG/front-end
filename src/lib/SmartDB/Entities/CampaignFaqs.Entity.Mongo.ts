import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { CampaignFaqsEntity } from './CampaignFaqs.Entity';

@MongoAppliedFor([CampaignFaqsEntity])
export class CampaignFaqsEntityMongo extends BaseEntityMongo {
    protected static Entity = CampaignFaqsEntity;
    protected static _mongoTableName: string = CampaignFaqsEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignFaqsEntityMongo {
        return this.constructor as typeof CampaignFaqsEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignFaqsEntityMongo {
        return this as typeof CampaignFaqsEntityMongo;
    }

    public getStatic(): typeof CampaignFaqsEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignFaqsEntity;
    }

    public static getStatic(): typeof CampaignFaqsEntity {
        return this.Entity as typeof CampaignFaqsEntity;
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
            name: string;
            description: string;
            order: number;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                campaignId: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, required: false },
                order: { type: Number, required: true },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
