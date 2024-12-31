import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class ProtocolAdminWalletEntity extends BaseEntity {
    protected static _apiRoute: string = 'protocoladminwallet';
    protected static _className: string = 'ProtocolAdminWallet';

    // #region fields
    @Convertible({ isDB_id: true })
    protocolId!: string;
    @Convertible({ isDB_id: true })
    walletId!: string;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        protocolId: true,
        walletId: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
