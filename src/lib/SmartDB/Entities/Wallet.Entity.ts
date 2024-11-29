import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class WalletEntity extends BaseEntity {
    protected static _apiRoute: string = 'wallets';
    protected static _className: string = 'Wallet';

    @Convertible()
    id!: number;

    @Convertible()
    createdBy!: string;

    @Convertible()
    lastConnection!: Date;

    @Convertible()
    walletUsed!: string;

    @Convertible()
    walletValidatedWithSignedToken!: boolean;

    @Convertible()
    paymentPKH!: string;

    @Convertible()
    stakePKH!: string;

    @Convertible()
    name!: string;

    @Convertible()
    email!: string;

    @Convertible()
    validatedEmail!: boolean;

    @Convertible()
    testnetAddress!: string;

    @Convertible()
    mainnetAddress!: string;

    @Convertible()
    createdAt!: Date;

    @Convertible()
    updatedAt!: Date;
}
