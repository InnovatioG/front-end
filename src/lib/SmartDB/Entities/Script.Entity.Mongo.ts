import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor } from 'smart-db';
import { BaseSmartDBEntityMongo, IBaseSmartDBEntity } from 'smart-db/backEnd';
import { ScriptDatum, ScriptEntity } from './Script.Entity';

@MongoAppliedFor([ScriptEntity])
export class ScriptEntityMongo extends BaseSmartDBEntityMongo {
    protected static Entity = ScriptEntity;
    protected static _mongoTableName: string = ScriptEntity.className();

    // #region fields

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof ScriptEntityMongo {
        return this.constructor as typeof ScriptEntityMongo;
    }

    public static getMongoStatic(): typeof ScriptEntityMongo {
        return this as typeof ScriptEntityMongo;
    }

    public getStatic(): typeof ScriptEntity {
        return this.getMongoStatic().getStatic() as typeof ScriptEntity;
    }

    public static getStatic(): typeof ScriptEntity {
        return this.Entity as typeof ScriptEntity;
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
        interface InterfaceDB extends IBaseSmartDBEntity {}

        interface Interface extends InterfaceDB, ScriptDatum {}

        const schemaDB = {
            ...BaseSmartDBEntityMongo.smartDBSchema,
        };

        const schemaDatum = {
            sdVersion: { type: Number, required: false },
            sdAdminPaymentPKH: { type: String, required: false },
            sdAdminStakePKH: { type: Object, required: false },
            sdScriptHash: { type: String, required: false },
        };

        const schema = new Schema<Interface>(
            {
                ...schemaDB,
                ...schemaDatum,
            },
            { timestamps: true }
        );

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}
