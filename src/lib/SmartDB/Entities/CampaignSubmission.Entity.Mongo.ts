
import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor  } from 'smart-db';
import { BaseEntityMongo  } from 'smart-db/backEnd';
import { CampaignSubmissionEntity } from './CampaignSubmission.Entity';

@MongoAppliedFor([CampaignSubmissionEntity])
export class CampaignSubmissionEntityMongo extends BaseEntityMongo  {
    protected static Entity = CampaignSubmissionEntity;
    protected static _mongoTableName: string = CampaignSubmissionEntity.className();

    // #region fields

    // campaignId:ID
    // submissionStatusId:ID
    // submittedByWalletId:ID
    // revisedByWalletId:ID
    // approvedJustification:String
    // rejectedJustification:String
    // createAt: Date 
    // updateAt: Date 

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

    public static MongoModel() {
        interface Interface {
            campaignId: string;
            submissionStatusId: string;
            submittedByWalletId: string;
            revisedByWalletId: string;
            approvedJustification: string;
            rejectedJustification: string;
            createAt:  Date ;
            updateAt:  Date ;
        }

        const schema = new Schema<Interface>({
            campaignId: { type: String, required: true },
            submissionStatusId: { type: String, required: true },
            submittedByWalletId: { type: String, required: true },
            revisedByWalletId: { type: String, required: true },
            approvedJustification: { type: String, required: false },
            rejectedJustification: { type: String, required: false },
            createAt: { type: Date, required: true },
            updateAt: { type: Date, required: false },
        });

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}

