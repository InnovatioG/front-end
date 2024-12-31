import { type Address, type PaymentKeyHash, type StakeKeyHash } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CustomWalletEntity extends BaseEntity {
    protected static _apiRoute: string = 'customwallet';
    protected static _className: string = 'CustomWallet';

    // #region fields
    @Convertible()
    createdBy!: string;
    @Convertible()
    lastConnection!: Date;
    @Convertible()
    walletUsed!: string;
    @Convertible()
    walletValidatedWithSignedToken!: boolean;
    @Convertible()
    paymentPkh!: PaymentKeyHash;
    @Convertible()
    stakePkh!: StakeKeyHash;
    @Convertible()
    name!: string;
    @Convertible()
    email?: string;
    @Convertible()
    validatedEmail?: string;
    @Convertible()
    testnetAddress!: Address;
    @Convertible()
    mainnetAddress!: Address;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        createdBy: true,
        lastConnection: true,
        walletUsed: true,
        walletValidatedWithSignedToken: true,
        paymentPkh: true,
        stakePkh: true,
        name: true,
        email: true,
        validatedEmail: true,
        testnetAddress: true,
        mainnetAddress: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
