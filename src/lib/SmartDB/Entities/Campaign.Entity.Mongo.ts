import { Script } from 'lucid-cardano';
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
            campaign_category_id: string;
            campaign_status_id: string;
            creator_wallet_id: string;

            name: string;
            description: string;
            begin_at_days: number;
            deadline_days: number;
            campaign_deployed_date: Date;
            campaign_actived_date: Date;

            begin_at: Date;
            deadline: Date;

            mint_CampaignToken: boolean;
            campaignToken_CS: string;
            campaignToken_TN: string;
            campaignToken_PriceADA: bigint;
            requestedMaxADA: bigint;
            requestedMinADA: bigint;

            logo_url: string;
            banner_url: string;
            website: string;
            instagram: string;
            twitter: string;
            discord: string;
            linkedin: string;
            facebook: string;
            visualizations: number;
            investors: number;
            tokenomics_max_supply: bigint;
            tokenomics_for_campaign: bigint;
            tokenomics_description: string;

            fdpCampaignVersion: number;
            fdpCampaignPolicy_Params: object;
            fdpCampaignPolicy_Script: Script;
            fdpCampaignPolicy_CS: string;
            fdpCampaignValidator_AddressMainnet: string;
            fdpCampaignValidator_AddressTestnet: string;
            fdpCampaignValidator_Script: { [key: string]: any };
            fdpCampaignValidator_Hash: string;
            fdpCampaignValidator_Params: { [key: string]: any };
            fdpCampaignFundsPolicyID_Params: object;
            fdpCampaignFundsPolicyID_Script: Script;
            fdpCampaignFundsPolicyID_CS: string;
            fdpCampaignFundsValidator_Params: object;
            fdpCampaignFundsValidator_Hash: string;
            fdpCampaignFundsValidator_Script: Script;
            fdpCampaignFundsValidator_AddressTestnet: string;
            fdpCampaignFundsValidator_AddressMainnet: string;

            featured: boolean;
            archived: boolean;
            createdAt: Date;
            updatedAt: Date;
        }

        interface Interface extends InterfaceDB, CampaignDatum {}

        //TODO: Esto es obligatorio así con SmartDB Entities
        const schemaDB = {
            ...BaseSmartDBEntityMongo.smartDBSchema,
            campaign_category_id: { type: String, required: true },
            campaign_status_id: { type: String, required: true },
            creator_wallet_id: { type: String, required: true },

            name: { type: String, required: true },
            description: { type: String, required: false },
            begin_at_days: { type: Number, required: false },
            deadline_days: { type: Number, required: false },
            campaign_deployed_date: { type: Date, required: false },
            campaign_actived_date: { type: Date, required: false },

            begin_at: { type: Date, required: false },
            deadline: { type: Date, required: false },

            mint_CampaignToken: { type: Boolean, required: false },
            campaignToken_CS: { type: String, required: false },
            campaignToken_TN: { type: String, required: false },
            campaignToken_PriceADA: { type: String, required: false },
            requestedMaxADA: { type: String, required: false },
            requestedMinADA: { type: String, required: false },

            logo_url: { type: String, required: false },
            banner_url: { type: String, required: false },
            website: { type: String, required: false },
            instagram: { type: String, required: false },
            twitter: { type: String, required: false },
            discord: { type: String, required: false },
            linkedin: { type: String, required: false },
            facebook: { type: String, required: false },
            visualizations: { type: Number, required: false },
            investors: { type: Number, required: false },
            tokenomics_max_supply: { type: String, required: false },
            tokenomics_for_campaign: { type: String, required: false },
            tokenomics_description: { type: String, required: false },

            fdpCampaignVersion: { type: Number, required: false },
            fdpCampaignPolicy_Params: { type: Object, required: false },
            fdpCampaignPolicy_Script: { type: Object, required: false },
            fdpCampaignPolicy_CS: { type: String, required: false },
            fdpCampaignValidator_AddressMainnet: { type: String, required: false },
            fdpCampaignValidator_AddressTestnet: { type: String, required: false },
            fdpCampaignValidator_Script: { type: Object, required: false },
            fdpCampaignValidator_Hash: { type: String, required: false },
            fdpCampaignValidator_Params: { type: Object, required: false },
            fdpCampaignFundsPolicyID_Params: { type: Object, required: false },
            fdpCampaignFundsPolicyID_Script: { type: Object, required: false },
            fdpCampaignFundsPolicyID_CS: { type: String, required: false },
            fdpCampaignFundsValidator_Params: { type: Object, required: false },
            fdpCampaignFundsValidator_Hash: { type: String, required: false },
            fdpCampaignFundsValidator_Script: { type: Object, required: false },
            fdpCampaignFundsValidator_AddressTestnet: { type: String, required: false },
            fdpCampaignFundsValidator_AddressMainnet: { type: String, required: false },

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
