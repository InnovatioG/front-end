import { } from 'lucid-cardano';
import 'reflect-metadata';
import { BaseSmartDBEntity, Convertible, asSmartDBEntity } from 'smart-db';

export interface ProtocolDatum {
    pdProtocolVersion: number;
    pdAdmins: string[];
    pdTokenAdminPolicy_CS: string;
    pdMinADA: bigint;
}

@asSmartDBEntity()
export class ProtocolEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'protocol';
    protected static _className: string = 'Protocol';

    protected static _plutusDataIsSubType = true;
    protected static _is_NET_id_Unique = true;
    _NET_id_TN: string = 'protocol_id';

    // #region fields
    @Convertible({ isForDatum: true })
    pdProtocolVersion!: number;
    @Convertible({ isForDatum: true, type: String })
    pdAdmins!: string[];
    @Convertible({ isForDatum: true })
    pdTokenAdminPolicy_CS!: string;
    @Convertible({ isForDatum: true })
    pdMinADA!: bigint;
    @Convertible({ type: String })
    contracts!: string[];
    @Convertible({ isCreatedAt: true })
    created_at!: Date;
    @Convertible({ isUpdatedAt: true })
    updated_at?: Date;

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
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
