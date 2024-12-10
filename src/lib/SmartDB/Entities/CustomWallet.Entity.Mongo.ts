
import { Schema, model, models } from 'mongoose';
import 'reflect-metadata';
import { MongoAppliedFor  } from 'smart-db';
import { BaseEntityMongo  } from 'smart-db/backEnd';
import { CustomWalletEntity } from './CustomWallet.Entity';
import { PaymentKeyHash, StakeKeyHash, Address,  } from 'lucid-cardano';

@MongoAppliedFor([CustomWalletEntity])
export class CustomWalletEntityMongo extends BaseEntityMongo  {
    protected static Entity = CustomWalletEntity;
    protected static _mongoTableName: string = CustomWalletEntity.className();

    // #region fields

    // createdBy:String
    // lastConnection: Date 
    // walletUsed:String
    // walletValidatedWithSignedToken:Boolean
    // paymentPkh: PaymentKeyHash 
    // stakePkh: StakeKeyHash 
    // name:String
    // email:String
    // validatedEmail:String
    // testnetAddress: Address 
    // mainnetAddress: Address 
    // createAt: Date 
    // updateAt: Date 

    // #endregion fields

    // #region internal class methods

    public getMongoStatic(): typeof CustomWalletEntityMongo {
        return this.constructor as typeof CustomWalletEntityMongo;
    }

    public static getMongoStatic(): typeof CustomWalletEntityMongo {
        return this as typeof CustomWalletEntityMongo;
    }

    public getStatic(): typeof CustomWalletEntity {
        return this.getMongoStatic().getStatic() as typeof CustomWalletEntity;
    }

    public static getStatic(): typeof CustomWalletEntity {
        return this.Entity as typeof CustomWalletEntity;
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
            createdBy: string;
            lastConnection:  Date ;
            walletUsed: string;
            walletValidatedWithSignedToken: boolean;
            paymentPkh:  PaymentKeyHash ;
            stakePkh:  StakeKeyHash ;
            name: string;
            email: string;
            validatedEmail: string;
            testnetAddress:  Address ;
            mainnetAddress:  Address ;
            createAt:  Date ;
            updateAt:  Date ;
        }

        const schema = new Schema<Interface>({
            createdBy: { type: String, required: true },
            lastConnection: { type: Date, required: true },
            walletUsed: { type: String, required: true },
            walletValidatedWithSignedToken: { type: Boolean, required: true },
            paymentPkh: { type: String, required: true },
            stakePkh: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: false },
            validatedEmail: { type: String, required: false },
            testnetAddress: { type: String, required: true },
            mainnetAddress: { type: String, required: true },
            createAt: { type: Date, required: true },
            updateAt: { type: Date, required: false },
        });

        const ModelDB = models[this._mongoTableName] || model<Interface>(this._mongoTableName, schema);
        return ModelDB;
    }

    // #endregion mongo db
}

