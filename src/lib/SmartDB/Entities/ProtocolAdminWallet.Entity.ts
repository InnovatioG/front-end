import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class ProtocolAdminWalletEntity extends BaseEntity {
    protected static _apiRoute: string = 'protocoladminwallet';
    protected static _className: string = 'ProtocolAdminWallet';

    // #region fields
    @Convertible({ isDB_id: true })
    protocol_id!: string;
    @Convertible({ isDB_id: true })
    wallet_id!: string;
    @Convertible({ isCreatedAt: true })
    created_at!: Date;
    @Convertible({ isUpdatedAt: true })
    updated_at?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        protocol_id: true,
        wallet_id: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
