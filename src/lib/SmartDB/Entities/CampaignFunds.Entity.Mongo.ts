import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseSmartDBEntityMongo, IBaseSmartDBEntity } from 'smart-db/backEnd';
import { CampaignFundsDatum, CampaignFundsEntity } from './CampaignFunds.Entity';

@MongoAppliedFor([CampaignFundsEntity])
export class CampaignFundsEntityMongo extends BaseSmartDBEntityMongo {
    protected static Entity = CampaignFundsEntity;
    protected static _mongoTableName: string = CampaignFundsEntity.className();

    // #region fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignFundsEntityMongo {
        return this.constructor as typeof CampaignFundsEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignFundsEntityMongo {
        return this as typeof CampaignFundsEntityMongo;
    }

    public getStatic(): typeof CampaignFundsEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignFundsEntity;
    }

    public static getStatic(): typeof CampaignFundsEntity {
        return this.Entity as typeof CampaignFundsEntity;
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
        interface InterfaceDB extends IBaseSmartDBEntity {
            createdAt: Date;
            updatedAt: Date;
        }

        interface Interface extends InterfaceDB, CampaignFundsDatum {}

        //TODO: Esto es obligatorio así con SmartDB Entities
        const schemaDB = {
            ...BaseSmartDBEntityMongo.smartDBSchema,
        };

        const schemaDatum = {
            cfdVersion: { type: Number, required: false },
            cfdIndex: { type: Number, required: false },
            cfdCampaignPolicy_CS: { type: String, required: false },
            cfdCampaignFundsPolicyID_CS: { type: String, required: false },
            cfdSubtotal_Avalaible_CampaignToken: { type: String, required: false },
            cfdSubtotal_Sold_CampaignToken: { type: String, required: false },
            cfdSubtotal_Avalaible_ADA: { type: String, required: false },
            cfdSubtotal_Collected_ADA: { type: String, required: false },
            cfdMinADA: { type: String, required: false },
        };

        const schema = new Schema<Interface>(
            {
                ...schemaDB,
                ...schemaDatum,
            },
            {
                timestamps: true,
            }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
