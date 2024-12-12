import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { CampaignCategoryEntity } from './CampaignCategory.Entity';

@MongoAppliedFor([CampaignCategoryEntity])
export class CampaignCategoryEntityMongo extends BaseEntityMongo {
    protected static Entity = CampaignCategoryEntity;
    protected static _mongoTableName: string = CampaignCategoryEntity.className();

    // #region fields

    // name:String
    // description:String
    // createdAt: Date
    // updatedAt: Date

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignCategoryEntityMongo {
        return this.constructor as typeof CampaignCategoryEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignCategoryEntityMongo {
        return this as typeof CampaignCategoryEntityMongo;
    }

    public getStatic(): typeof CampaignCategoryEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignCategoryEntity;
    }

    public static getStatic(): typeof CampaignCategoryEntity {
        return this.Entity as typeof CampaignCategoryEntity;
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
