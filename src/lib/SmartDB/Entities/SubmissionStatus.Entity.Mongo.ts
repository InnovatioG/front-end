import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseEntityMongo } from 'smart-db/backEnd';
import { SubmissionStatusEntity } from './SubmissionStatus.Entity';

@MongoAppliedFor([SubmissionStatusEntity])
export class SubmissionStatusEntityMongo extends BaseEntityMongo {
    protected static Entity = SubmissionStatusEntity;
    protected static _mongoTableName: string = SubmissionStatusEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof SubmissionStatusEntityMongo {
        return this.constructor as typeof SubmissionStatusEntityMongo;
    }

    public static getMongoStatic(): typeof SubmissionStatusEntityMongo {
        return this as typeof SubmissionStatusEntityMongo;
    }

    public getStatic(): typeof SubmissionStatusEntity {
        return this.getMongoStatic().getStatic() as typeof SubmissionStatusEntity;
    }

    public static getStatic(): typeof SubmissionStatusEntity {
        return this.Entity as typeof SubmissionStatusEntity;
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
            code_id: number;
            name: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
        }

        const schema = new Schema<Interface>(
            {
                code_id: { type: Number, required: true },
                name: { type: String, required: true },
                description: { type: String, required: false },
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
