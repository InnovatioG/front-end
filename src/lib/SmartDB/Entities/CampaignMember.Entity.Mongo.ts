import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { CampaignMemberEntity } from './CampaignMember.Entity';

@MongoAppliedFor([CampaignMemberEntity])
export class CampaignMemberEntityMongo extends BaseEntityMongo {
    protected static Entity = CampaignMemberEntity;
    protected static _mongoTableName: string = CampaignMemberEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignMemberEntityMongo {
        return this.constructor as typeof CampaignMemberEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignMemberEntityMongo {
        return this as typeof CampaignMemberEntityMongo;
    }

    public getStatic(): typeof CampaignMemberEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignMemberEntity;
    }

    public static getStatic(): typeof CampaignMemberEntity {
        return this.Entity as typeof CampaignMemberEntity;
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
            campaign_id: string;
            editor: boolean;
            wallet_id: string;
            rol: string;
            description: string;
            website: string;
            instagram: string;
            twitter: string;
            discord: string;
            facebook: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                campaign_id: { type: String, required: true },
                editor: { type: Boolean, required: true },
                wallet_id: { type: String, required: true },
                rol: { type: String, required: false },
                description: { type: String, required: false },
                website: { type: String, required: false },
                instagram: { type: String, required: false },
                twitter: { type: String, required: false },
                discord: { type: String, required: false },
                facebook: { type: String, required: false },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
