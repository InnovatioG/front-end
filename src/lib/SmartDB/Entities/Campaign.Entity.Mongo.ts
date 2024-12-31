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
            projectId: string;
            campaingCategoryId: string;
            campaignStatusId: string;
            creatorWalletId: string;
            description: string;
            beginAt: Date;
            deadline: Date;
            logoUrl: string;
            bannerUrl: string;
            website: string;
            instagram: string;
            twitter: string;
            discord: string;
            facebook: string;
            investors: number;
            tokenomicsMaxSupply: string;
            tokenomicsDescription: string;
            featured: boolean;
            archived: boolean;
            createdAt: Date;
            updatedAt: Date;
        }

        interface Interface extends InterfaceDB, CampaignDatum {}

        //TODO: Esto es obligatorio así con SmartDB Entities
        const schemaDB = {
            ...BaseSmartDBEntityMongo.smartDBSchema,
            projectId: { type: String, required: true },
            campaingCategoryId: { type: String, required: true },
            campaignStatusId: { type: String, required: true },
            creatorWalletId: { type: String, required: true },
            description: { type: String, required: false },
            beginAt: { type: Date, required: false },
            deadline: { type: Date, required: false },
            logoUrl: { type: String, required: false },
            bannerUrl: { type: String, required: false },
            website: { type: String, required: false },
            instagram: { type: String, required: false },
            twitter: { type: String, required: false },
            discord: { type: String, required: false },
            facebook: { type: String, required: false },
            investors: { type: Number, required: false },
            tokenomicsMaxSupply: { type: String, required: false },
            tokenomicsDescription: { type: String, required: false },
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
            cdBeginAt: { type: String, required: false },
            cdDeadline: { type: String, required: false },
            cdStatus: { type: Number, required: false },
            cdMilestones: { type: [Object], required: false },
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
