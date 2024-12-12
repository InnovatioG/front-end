import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { CampaignContentEntity } from './CampaignContent.Entity';

@MongoAppliedFor([CampaignContentEntity])
export class CampaignContentEntityMongo extends BaseEntityMongo {
    protected static Entity = CampaignContentEntity;
    protected static _mongoTableName: string = CampaignContentEntity.className();

    // #region fields

    // campaignId:ID
    // name:String
    // description:String
    // order:String
    // createdAt: Date
    // updatedAt: Date

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignContentEntityMongo {
        return this.constructor as typeof CampaignContentEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignContentEntityMongo {
        return this as typeof CampaignContentEntityMongo;
    }

    public getStatic(): typeof CampaignContentEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignContentEntity;
    }

    public static getStatic(): typeof CampaignContentEntity {
        return this.Entity as typeof CampaignContentEntity;
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
            order: string;
        }

        const schema = new Schema<Interface>(
            {
                campaignId: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, required: false },
                order: { type: String, required: true },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
