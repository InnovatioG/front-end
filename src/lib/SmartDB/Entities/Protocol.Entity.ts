import { PROTOCOL_ID_TN } from '@/utils/constants/on-chain';
import { type Script } from '@lucid-evolution/lucid';
import 'reflect-metadata';
import { BaseSmartDBEntity, type CS, Convertible, LUCID_NETWORK_MAINNET_NAME, asSmartDBEntity } from 'smart-db';

export type CampaignFactory = {
    name: string;
    fdpCampaignVersion: number;
    fdpCampaignPolicy_Pre_CborHex: Script;
    fdpCampaignValidator_Pre_CborHex: Script;
    fdpCampaignFundsPolicyID_Pre_CborHex: Script;
    fdpCampaignFundsValidator_Pre_CborHex: Script;
};

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

    protected static _isOnlyDatum = false;

    _NET_id_TN_Str: string = PROTOCOL_ID_TN;

    // #region fields

    @Convertible({ isUnique: true })
    name!: string;

    @Convertible({})
    fdpProtocolVersion!: number;

    @Convertible({})
    fdpScriptVersion!: number;

    @Convertible({ isUnique: true })
    fdpProtocolPolicyID_CS!: CS;

    @Convertible()
    fdpProtocolPolicyID_Script!: Script;

    @Convertible()
    fdpProtocolPolicyID_Params!: object;

    @Convertible()
    fdpProtocolValidator_AddressMainnet!: string;

    @Convertible()
    fdpProtocolValidator_AddressTestnet!: string;

    @Convertible()
    fdpProtocolValidator_Script!: Script;

    @Convertible({ isUnique: true })
    fdpProtocolValidator_Hash!: string;

    @Convertible()
    fdpProtocolValidator_Params!: object;

    @Convertible()
    fdpScriptPolicyID_CS!: CS;

    @Convertible()
    fdpScriptPolicyID_Script!: Script;

    @Convertible()
    fdpScriptPolicyID_Params!: object;

    @Convertible()
    fdpScriptValidator_AddressMainnet!: string;

    @Convertible()
    fdpScriptValidator_AddressTestnet!: string;

    @Convertible()
    fdpScriptValidator_Script!: Script;

    @Convertible()
    fdpScriptValidator_Hash!: string;

    @Convertible()
    fdpScriptValidator_Params!: object;

    @Convertible({ type: Object })
    fdpCampaignFactories!: CampaignFactory[];

    @Convertible({ isForDatum: true })
    pdProtocolVersion!: number;
    @Convertible({ isForDatum: true, type: String })
    pdAdmins!: string[];
    @Convertible({ isForDatum: true })
    pdTokenAdminPolicy_CS!: string;
    @Convertible({ isForDatum: true })
    pdMinADA!: bigint;

    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {
        fdpProtocolPolicyID_Params: false,
        fdpProtocolPolicyID_Script: false,
        fdpProtocolValidator_Params: false,
        fdpProtocolValidator_Script: false,
        fdpScriptPolicyID_Params: false,
        fdpScriptPolicyID_Script: false,
        fdpScriptValidator_Params: false,
        fdpScriptValidator_Script: false,
        fdpCampaignFactories: false,
    };

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        name: true,
        fdpProtocolVersion: true,
        fdpScriptVersion: true,
        fdpProtocolPolicyID_CS: true,
        fdpProtocolPolicyID_Params: false,
        fdpProtocolPolicyID_Script: false,
        fdpProtocolValidator_AddressMainnet: true,
        fdpProtocolValidator_AddressTestnet: true,
        fdpProtocolValidator_Hash: true,
        fdpProtocolValidator_Params: false,
        fdpProtocolValidator_Script: false,
        fdpScriptPolicyID_CS: true,
        fdpScriptPolicyID_Params: false,
        fdpScriptPolicyID_Script: false,
        fdpScriptValidator_AddressMainnet: true,
        fdpScriptValidator_AddressTestnet: true,
        fdpScriptValidator_Hash: true,
        fdpScriptValidator_Params: false,
        fdpScriptValidator_Script: false,
        fdpCampaignFactories: true,
        pdProtocolVersion: true,
        pdAdmins: true,
        pdTokenAdminPolicy_CS: true,
        pdMinADA: true,
        createdAt: true,
        updatedAt: true,
    };

    public static defaultFieldsAddScriptsTxScript: Record<string, boolean> = {
        fdpProtocolPolicyID_CS: true,
        fdpProtocolPolicyID_Script: true,
        fdpProtocolValidator_Hash: true,
        fdpProtocolValidator_Script: true,
        fdpScriptPolicyID_CS: true,
        fdpScriptPolicyID_Script: true,
        fdpScriptValidator_Hash: true,
        fdpScriptValidator_Script: true,
    };

    // #endregion db

    // #region class methods

    public getNet_Address(): string {
        if (process.env.NEXT_PUBLIC_CARDANO_NET === LUCID_NETWORK_MAINNET_NAME) {
            return this.fdpProtocolValidator_AddressMainnet;
        } else {
            return this.fdpProtocolValidator_AddressTestnet;
        }
    }

    public getNET_id_CS(): string {
        return this.fdpProtocolPolicyID_CS;
    }

    public getNet_Script_Validator_Address(): string {
        if (process.env.NEXT_PUBLIC_CARDANO_NET === LUCID_NETWORK_MAINNET_NAME) {
            return this.fdpScriptValidator_AddressMainnet;
        } else {
            return this.fdpScriptValidator_AddressTestnet;
        }
    }

    // #endregion class methods
}
