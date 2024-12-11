import 'reflect-metadata';
import { Convertible, BaseEntity, asEntity } from 'smart-db';
import {  } from 'lucid-cardano';

@asEntity()
export class ProtocolAdminWalletEntity extends BaseEntity {
    protected static _apiRoute: string = 'protocoladminwallet';
    protected static _className: string = 'ProtocolAdminWallet';


    // #region fields
    @Convertible()
    protocolId!: string;
    @Convertible()
    walletId!: string;
    @Convertible()
    createdAt!:  Date ;
    @Convertible()
    updatedAt?:  Date ;

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


