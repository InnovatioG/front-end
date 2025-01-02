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
            id_internal: number;
            name: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                id_internal: { type: Number, required: true },
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
