import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { CampaignStatusEntity } from './CampaignStatus.Entity';

@MongoAppliedFor([CampaignStatusEntity])
export class CampaignStatusEntityMongo extends BaseEntityMongo {
    protected static Entity = CampaignStatusEntity;
    protected static _mongoTableName: string = CampaignStatusEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignStatusEntityMongo {
        return this.constructor as typeof CampaignStatusEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignStatusEntityMongo {
        return this as typeof CampaignStatusEntityMongo;
    }

    public getStatic(): typeof CampaignStatusEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignStatusEntity;
    }

    public static getStatic(): typeof CampaignStatusEntity {
        return this.Entity as typeof CampaignStatusEntity;
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
            code_id: number;
            name: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                code_id: { type: Number, required: true },
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
