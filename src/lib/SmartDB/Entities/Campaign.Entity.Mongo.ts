
import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor  } from 'smart-db';
import {  BaseSmartDBEntityMongo, IBaseSmartDBEntity } from 'smart-db/backEnd';
import { CampaignEntity } from './Campaign.Entity';
import { UnixTime,  } from 'lucid-cardano';

@MongoAppliedFor([CampaignEntity])
export class CampaignEntityMongo extends  BaseSmartDBEntityMongo {
    protected static Entity = CampaignEntity;
    protected static _mongoTableName: string = CampaignEntity.className();

    // #region fields

    // projectId:ID
    // campaingCategoryId:ID
    // campaignStatusId:ID
    // creatorWalletId:ID
    // cdCampaignVersion:String
    // cdCampaignPolicy_CS:String
    // cdCampaignFundsPolicyID_CS:String
    // cdAdmins:[String]
    // cdTokenAdminPolicy_CS:String
    // cdMint_CampaignToken:Boolean
    // cdCampaignToken_CS:String
    // cdCampaignToken_TN:String
    // cdCampaignToken_PriceADA:String
    // cdRequestedMaxADA:String
    // cdRequestedMinADA:String
    // cdFundedADA:String
    // cdCollectedADA:String
    // cdBeginAt: Date 
    // cdDeadline: Date 
    // cdStatus:Int
    // cdMilestones:String
    // cdFundsCount:Int
    // cdFundsIndex:Int
    // cdMinADA:String
    // description:String
    // logoUrl:String
    // bannerUrl:String
    // website:String
    // instagram:String
    // twitter:String
    // discord:String
    // facebook:String
    // investors:Int
    // tokenomicsMaxSupply:String
    // tokenomicsDescription:String
    // featured:Boolean
    // archived:Boolean
    // createAt: Date 
    // updateAt: Date 

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
        interface Interface {
            projectId: string;
            campaingCategoryId: string;
            campaignStatusId: string;
            creatorWalletId: string;
            cdCampaignVersion: string;
            cdCampaignPolicy_CS: string;
            cdCampaignFundsPolicyID_CS: string;
            cdAdmins: [String];
            cdTokenAdminPolicy_CS: string;
            cdMint_CampaignToken: boolean;
            cdCampaignToken_CS: string;
            cdCampaignToken_TN: string;
            cdCampaignToken_PriceADA: string;
            cdRequestedMaxADA: string;
            cdRequestedMinADA: string;
            cdFundedADA: string;
            cdCollectedADA: string;
            cdBeginAt:  Date ;
            cdDeadline:  Date ;
            cdStatus: number;
            cdMilestones: string;
            cdFundsCount: number;
            cdFundsIndex: number;
            cdMinADA: string;
            description: string;
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
            createAt:  Date ;
            updateAt:  Date ;
        }

        const schema = new Schema<Interface>({
            projectId: { type: String, required: true },
            campaingCategoryId: { type: String, required: true },
            campaignStatusId: { type: String, required: true },
            creatorWalletId: { type: String, required: true },
            cdCampaignVersion: { type: String, required: true },
            cdCampaignPolicy_CS: { type: String, required: true },
            cdCampaignFundsPolicyID_CS: { type: String, required: true },
            cdAdmins: { type: [String], required: true },
            cdTokenAdminPolicy_CS: { type: String, required: true },
            cdMint_CampaignToken: { type: Boolean, required: true },
            cdCampaignToken_CS: { type: String, required: true },
            cdCampaignToken_TN: { type: String, required: true },
            cdCampaignToken_PriceADA: { type: String, required: true },
            cdRequestedMaxADA: { type: String, required: true },
            cdRequestedMinADA: { type: String, required: true },
            cdFundedADA: { type: String, required: true },
            cdCollectedADA: { type: String, required: true },
            cdBeginAt: { type: Date, required: true },
            cdDeadline: { type: Date, required: true },
            cdStatus: { type: Number, required: true },
            cdMilestones: { type: String, required: true },
            cdFundsCount: { type: Number, required: true },
            cdFundsIndex: { type: Number, required: true },
            cdMinADA: { type: String, required: true },
            description: { type: String, required: false },
            logoUrl: { type: String, required: false },
            bannerUrl: { type: String, required: false },
            website: { type: String, required: false },
            instagram: { type: String, required: false },
            twitter: { type: String, required: false },
            discord: { type: String, required: false },
            facebook: { type: String, required: false },
            investors: { type: Number, required: true },
            tokenomicsMaxSupply: { type: String, required: true },
            tokenomicsDescription: { type: String, required: true },
            featured: { type: Boolean, required: true },
            archived: { type: Boolean, required: true },
            createAt: { type: Date, required: true },
            updateAt: { type: Date, required: false },
        });

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}

