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
            milestone_id: string;
            submission_status_id: string;
            submitted_by_wallet_id: string;
            revised_by_wallet_id: string;
            report_proof_of_finalization: string;
            approved_justification: string;
            rejected_justification: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                milestone_id: { type: String, required: true },
                submission_status_id: { type: String, required: true },
                submitted_by_wallet_id: { type: String, required: true },
                revised_by_wallet_id: { type: String, required: true },
                report_proof_of_finalization: { type: String, required: true },
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
