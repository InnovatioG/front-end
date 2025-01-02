import { type Address, type PaymentKeyHash, type StakeKeyHash } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class CustomWalletEntity extends BaseEntity {
    protected static _apiRoute: string = 'customwallet';
    protected static _className: string = 'CustomWallet';

    // #region fields
    @Convertible()
    created_by!: string;
    @Convertible()
    last_connection!: Date;
    @Convertible()
    wallet_used!: string;
    @Convertible()
    wallet_validated_with_signed_token!: boolean;
    @Convertible()
    payment_pkh!: PaymentKeyHash;
    @Convertible()
    stakePkh!: StakeKeyHash;
    @Convertible()
    name!: string;
    @Convertible()
    email?: string;
    @Convertible()
    validated_email?: string;
    @Convertible()
    testnet_address!: Address;
    @Convertible()
    mainnet_address!: Address;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        created_by: true,
        last_connection: true,
        wallet_used: true,
        wallet_validated_with_signed_token: true,
        payment_pkh: true,
        stakePkh: true,
        name: true,
        email: true,
        validated_email: true,
        testnet_address: true,
        mainnet_address: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
