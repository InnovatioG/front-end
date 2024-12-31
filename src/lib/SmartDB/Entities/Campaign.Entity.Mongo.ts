import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseSmartDBEntityMongo, IBaseSmartDBEntity } from 'smart-db/backEnd';
import { CampaignDatum, CampaignEntity } from './Campaign.Entity';

@MongoAppliedFor([CampaignEntity])
export class CampaignEntityMongo extends BaseSmartDBEntityMongo {
    protected static Entity = CampaignEntity;
    protected static _mongoTableName: string = CampaignEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignEntityMongo {
        return this.constructor as typeof CampaignEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignEntityMongo {
        return this as typeof CampaignEntityMongo;
    }

    public getStatic(): typeof CampaignEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignEntity;
    }

    public static getStatic(): typeof CampaignEntity {
        return this.Entity as typeof CampaignEntity;
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
        interface InterfaceDB extends IBaseSmartDBEntity {
            project_id: string;
            campaing_category_id: string;
            campaign_status_id: string;
            creator_wallet_id: string;
            description: string;
            begin_at: Date;
            deadline: Date;
            logo_url: string;
            banner_url: string;
            website: string;
            instagram: string;
            twitter: string;
            discord: string;
            facebook: string;
            investors: number;
            tokenomics_max_supply: string;
            tokenomics_description: string;
            featured: boolean;
            archived: boolean;
            createdAt: Date;
            updatedAt: Date;
        }

        interface Interface extends InterfaceDB, CampaignDatum {}

        //TODO: Esto es obligatorio así con SmartDB Entities
        const schemaDB = {
            ...BaseSmartDBEntityMongo.smartDBSchema,
            project_id: { type: String, required: true },
            campaing_category_id: { type: String, required: true },
            campaign_status_id: { type: String, required: true },
            creator_wallet_id: { type: String, required: true },
            description: { type: String, required: false },
            begin_at: { type: Date, required: false },
            deadline: { type: Date, required: false },
            logo_url: { type: String, required: false },
            banner_url: { type: String, required: false },
            website: { type: String, required: false },
            instagram: { type: String, required: false },
            twitter: { type: String, required: false },
            discord: { type: String, required: false },
            facebook: { type: String, required: false },
            investors: { type: Number, required: false },
            tokenomics_max_supply: { type: String, required: false },
            tokenomics_description: { type: String, required: false },
            featured: { type: Boolean, required: false },
            archived: { type: Boolean, required: false },
        };

        const schemaDatum = {
            cdCampaignVersion: { type: Number, required: false },
            cdCampaignPolicy_CS: { type: String, required: false },
            cdCampaignFundsPolicyID_CS: { type: String, required: false },
            cdAdmins: { type: [String], required: false },
            cdTokenAdminPolicy_CS: { type: String, required: false },
            cdMint_CampaignToken: { type: Boolean, required: false },
            cdCampaignToken_CS: { type: String, required: false },
            cdCampaignToken_TN: { type: String, required: false },
            cdCampaignToken_PriceADA: { type: String, required: false },
            cdRequestedMaxADA: { type: String, required: false },
            cdRequestedMinADA: { type: String, required: false },
            cdFundedADA: { type: String, required: false },
            cdCollectedADA: { type: String, required: false },
            cdbegin_at: { type: String, required: false },
            cdDeadline: { type: String, required: false },
            cdStatus: { type: Number, required: false },
            cdMilestones: { type: String, required: false },
            cdFundsCount: { type: Number, required: false },
            cdFundsIndex: { type: Number, required: false },
            cdMinADA: { type: String, required: false },
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
