import { type PaymentKeyHash } from 'lucid-cardano';
import 'reflect-metadata';
import { asSmartDBEntity, BaseSmartDBEntity, Convertible, Maybe, SmartUTxOEntity, StakeCredentialPubKeyHash } from 'smart-db';

export interface ScriptDatum {
    sdVersion: number;
    sdAdminPaymentPKH: PaymentKeyHash;
    sdAdminStakePKH: Maybe<StakeCredentialPubKeyHash>;
    sdScriptHash: string;
}

@asSmartDBEntity()
export class ScriptEntity extends BaseSmartDBEntity {
    protected static _apiRoute: string = 'scripts';
    protected static _className: string = 'Script';
    // protected static _mongoTableName: string = 'Script';

    protected static _plutusDataIndex = 0;
    protected static _is_NET_id_Unique = false;

    // #region fields

    // sobre escribo este campo del base smart db, por que alli no se carga y para el fondo es necesario cargarlo para ver si el fondo esta deployado o no
    @Convertible({ type: String, propertyToFill: 'smartUTxO', relation: 'OneToOne', typeRelation: SmartUTxOEntity, cascadeSave: true, cascadeLoad: true })
    smartUTxO_id!: string | undefined;

    // #endregion fields

    // #region datum

    @Convertible({ isForDatum: true })
    sdVersion!: number;

    @Convertible({ isForDatum: true, type: String })
    sdAdminPaymentPKH!: PaymentKeyHash;

    @Convertible({ isForDatum: true, type: Maybe<StakeCredentialPubKeyHash> })
    sdAdminStakePKH!: Maybe<StakeCredentialPubKeyHash>;

    @Convertible({ isForDatum: true })
    sdScriptHash!: string;

    // #endregion datum

    // #region  db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    // HACK: puse todos los campos para evitar erroress
    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        sdVersion: true,
        sdAdminPaymentPKH: true,
        sdAdminStakePKH: true,
        sdScriptHash: true,
    };

    // #endregion  db

    // #region class methods

    public getNET_id_TN(): string {
        return this.sdScriptHash;
    }

    // #endregion class methods
}
