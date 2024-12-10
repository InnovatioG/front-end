import 'reflect-metadata';
import { Convertible, BaseSmartDBEntity, asSmartDBEntity } from 'smart-db';
import {  } from 'lucid-cardano';

@asSmartDBEntity()
export class ProtocolEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'protocol';
    protected static _className: string = 'Protocol';

    protected static _plutusDataIsSubType = false;
    protected static _is_NET_id_Unique = false;
    _NET_id_TN: string = 'ProtocolID';

    // #region fields
    @Convertible( { isForDatum: true,  } )
    pdProtocolVersion!: string;
    @Convertible( { isForDatum: true,  } )
    pdAdmins!: [String];
    @Convertible( { isForDatum: true,  } )
    pdTokenAdminPolicy_CS!: string;
    @Convertible( { isForDatum: true,  } )
    pdMinADA!: string;
    @Convertible()
    contracts!: [String];
    @Convertible()
    createAt!:  Date ;
    @Convertible()
    updateAt?:  Date ;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
          pdProtocolVersion: true,
          pdAdmins: true,
          pdTokenAdminPolicy_CS: true,
          pdMinADA: true,
          contracts: true,
          createAt: true,
          updateAt: true,
    };

    // #endregion db
}


