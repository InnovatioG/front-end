import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { CampaignSubmissionEntity } from './CampaignSubmission.Entity';

@MongoAppliedFor([CampaignSubmissionEntity])
export class CampaignSubmissionEntityMongo extends BaseEntityMongo {
    protected static Entity = CampaignSubmissionEntity;
    protected static _mongoTableName: string = CampaignSubmissionEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CampaignSubmissionEntityMongo {
        return this.constructor as typeof CampaignSubmissionEntityMongo;
    }

    public static getMongoStatic(): typeof CampaignSubmissionEntityMongo {
        return this as typeof CampaignSubmissionEntityMongo;
    }

    public getStatic(): typeof CampaignSubmissionEntity {
        return this.getMongoStatic().getStatic() as typeof CampaignSubmissionEntity;
    }

    public static getStatic(): typeof CampaignSubmissionEntity {
        return this.Entity as typeof CampaignSubmissionEntity;
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
        interface Interface {
            campaign_id: string;
            submission_status_id: string;
            submitted_by_wallet_id: string;
            revised_by_wallet_id: string;
            approved_justification: string;
            rejected_justification: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                campaign_id: { type: String, required: true },
                submission_status_id: { type: String, required: true },
                submitted_by_wallet_id: { type: String, required: true },
                revised_by_wallet_id: { type: String, required: false },
                approved_justification: { type: String, required: false },
                rejected_justification: { type: String, required: false },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
