import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { MilestoneSubmissionEntity } from './MilestoneSubmission.Entity';

@MongoAppliedFor([MilestoneSubmissionEntity])
export class MilestoneSubmissionEntityMongo extends BaseEntityMongo {
    protected static Entity = MilestoneSubmissionEntity;
    protected static _mongoTableName: string = MilestoneSubmissionEntity.className();

    // #region fields

    // milestoneId:ID
    // submissionStatusId:ID
    // submittedByWalletId:ID
    // revisedByWalletId:ID
    // reportProofOfFinalization:String
    // approvedJustification:String
    // rejectedJustification:String
    // createdAt: Date
    // updatedAt: Date

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof MilestoneSubmissionEntityMongo {
        return this.constructor as typeof MilestoneSubmissionEntityMongo;
    }

    public static getMongoStatic(): typeof MilestoneSubmissionEntityMongo {
        return this as typeof MilestoneSubmissionEntityMongo;
    }

    public getStatic(): typeof MilestoneSubmissionEntity {
        return this.getMongoStatic().getStatic() as typeof MilestoneSubmissionEntity;
    }

    public static getStatic(): typeof MilestoneSubmissionEntity {
        return this.Entity as typeof MilestoneSubmissionEntity;
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
            milestoneId: string;
            submissionStatusId: string;
            submittedByWalletId: string;
            revisedByWalletId: string;
            reportProofOfFinalization: string;
            approvedJustification: string;
            rejectedJustification: string;
        }

        const schema = new Schema<Interface>(
            {
                milestoneId: { type: String, required: true },
                submissionStatusId: { type: String, required: true },
                submittedByWalletId: { type: String, required: true },
                revisedByWalletId: { type: String, required: true },
                reportProofOfFinalization: { type: String, required: false },
                approvedJustification: { type: String, required: false },
                rejectedJustification: { type: String, required: false },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
