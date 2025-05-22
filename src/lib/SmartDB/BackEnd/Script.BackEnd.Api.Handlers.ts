import { SCRIPT_VERSION, TxEnums } from '@/utils/constants/on-chain';
import { Address, Assets, TxBuilder } from '@lucid-evolution/lucid';
import { NextApiResponse } from 'next';
import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    CS,
    LucidToolsBackEnd,
    Maybe,
    NextApiRequestAuthenticated,
    OptionsGetOne,
    TRANSACTION_STATUS_CREATED,
    TimeBackEnd,
    TransactionBackEndApplied,
    TransactionDatum,
    TransactionEntity,
    TransactionRedeemer,
    WalletTxParams,
    addAssets,
    calculateMinAdaOfUTxO,
    console_error,
    console_log,
    convertMillisToTime,
    getTxRedeemersDetailsAndResources,
    isEmulator,
    isFrontEndEnvironment,
    isNullOrBlank,
    objToCborHex,
    optionsGetMinimal,
    sanitizeForDatabase,
    showData,
    yup,
    yupValidateOptionsGetOne
} from 'smart-db/backEnd';
import { AddScriptTxParams, CampaignAddScriptsTxParams, ProtocolAddScriptsTxParams } from '../Commons/Params';
import { CampaignEntity, ProtocolEntity } from '../Entities';
import { ScriptPolicyRedeemerMintID } from '../Entities/Redeemers/Script.Redeemer';
import { ScriptDatum, ScriptEntity } from '../Entities/Script.Entity';
import { CampaignBackEndApplied } from './Campaign.BackEnd.Api.Handlers';
import { ProtocolBackEndApplied } from './Protocol.BackEnd.Api.Handlers';

@BackEndAppliedFor(ScriptEntity)
export class ScriptBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = ScriptEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    // #region class methods

    public static async getByHash(hash: string, optionsGet?: OptionsGetOne, restricFilter?: Record<string, any>): Promise<ScriptEntity | undefined> {
        if (isNullOrBlank(hash)) {
            throw `getByHash: script hash not defined`;
        }
        if (isFrontEndEnvironment()) {
            //return await this.getByHashApi(hash, optionsGet);
            throw `Can't run this method in the Browser`;
        }
        //----------------------------
        console_log(1, this._Entity.className(), `getByHash - Init`);
        //----------------------------
        const script = await this.getOneByParams_<ScriptEntity>({ sdScriptHash: hash }, optionsGet, restricFilter);
        //-------------------------
        console_log(-1, this._Entity.className(), `getByHash - OK`);
        //-------------------------
        return script;
    }

    // #endregion class methods

    // #region datum methods

    public static mkNew_ScriptDatum(walletTxParams: WalletTxParams, txParams: AddScriptTxParams): ScriptDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: ScriptDatum = {
            sdVersion: SCRIPT_VERSION,
            sdAdminPaymentPKH: walletTxParams.pkh,
            sdAdminStakePKH: new Maybe<CS>(walletTxParams.stakePkh),
            sdScriptHash: txParams.script_Hash,
        };

        let datum: ScriptDatum = ScriptEntity.mkDatumFromPlainObject(datumPlainObject) as ScriptDatum;

        return datum;
    }

    // #endregion datum methods
}

@BackEndApiHandlersFor(ScriptEntity)
export class ScriptApiHandlers extends BaseSmartDBBackEndApiHandlers {
    protected static _Entity = ScriptEntity;
    protected static _BackEndApplied = ScriptBackEndApplied;

    // #region restrict api handlers

    // #endregion restrict api handlers

    // #region custom api handlers

    protected static _ApiHandlers: string[] = ['by-hash', 'tx'];

    protected static async executeApiHandlers(command: string, req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        const { query } = req.query;
        //--------------------
        if (this._ApiHandlers.includes(command) && query !== undefined) {
            if (query[0] === 'by-hash') {
                if (query.length === 2) {
                    req.query = { hash: query[1] };
                } else {
                    req.query = {};
                }
                return await this.getByHashApiHandler(req, res);
            } else if (query[0] === 'tx') {
                if (query.length === 2) {
                    if (query[1] === 'addCampaignScript') {
                        return await this.addCampaignScriptTxApiHandler(req, res);
                    } else if (query[1] === 'addProtocolScript') {
                        return await this.addProtocolScriptTxApiHandler(req, res);
                    }
                }
                return res.status(405).json({ error: `Wrong Api Tx route` });
            } else {
                console_error(-1, this._Entity.className(), `executeApiHandlers - Error: Api Handler function not found`);
                return res.status(500).json({ error: `Api Handler function not found` });
            }
        } else {
            console_error(-1, this._Entity.className(), `executeApiHandlers - Error: Wrong Custom Api route`);
            return res.status(405).json({ error: `Wrong Custom Api route` });
        }
    }

    public static async getByHashApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        if (req.method === 'GET') {
            //-------------------------
            console_log(1, this._Entity.className(), `getByHashApiHandler - GET - Init`);
            console_log(0, this._Entity.className(), `query: ${showData(req.query)}`);
            //-------------------------
            try {
                //-------------------------
                const sanitizedQuery = sanitizeForDatabase(req.query);
                //-------------------------
                const schemaQuery = yup.object().shape({
                    hash: yup.string().required(),
                });
                //-------------------------
                let validatedQuery;
                try {
                    validatedQuery = await schemaQuery.validate(sanitizedQuery);
                } catch (error) {
                    console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${error}`);
                    return res.status(400).json({ error });
                }
                //--------------------------------------
                const { hash } = validatedQuery;
                //-------------------------
                const user = req.user;
                let restricFilter = await this.restricFilter(user);
                //-------------------------
                const script = await this._BackEndApplied.getByHash(hash, undefined, restricFilter);
                //-------------------------
                if (!script) {
                    console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${this._Entity.className()} not found`);
                    return res.status(404).json({ error: `${this._Entity.className()} not found` });
                }
                //-------------------------
                console_log(-1, this._Entity.className(), `getByHashApiHandler - GET - OK`);
                //-------------------------
                return res.status(200).json(script.toPlainObject());
            } catch (error) {
                console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while fetching the ${this._Entity.className()}` });
            }
        } else if (req.method === 'POST') {
            //-------------------------
            console_log(1, this._Entity.className(), `getByHashApiHandler - POST - Init`);
            console_log(0, this._Entity.className(), `query: ${showData(req.query)}`);
            console_log(0, this._Entity.className(), `body: ${showData(req.body)}`);
            //-------------------------
            try {
                //-------------------------
                const sanitizedQuery = sanitizeForDatabase(req.query);
                //-------------------------
                const schemaQuery = yup.object().shape({
                    hash: yup.string().required(),
                });
                //-------------------------
                let validatedQuery;
                try {
                    validatedQuery = await schemaQuery.validate(sanitizedQuery);
                } catch (error) {
                    console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${error}`);
                    return res.status(400).json({ error });
                }
                //--------------------------------------
                const { hash } = validatedQuery;
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const schemaBody = yup.object().shape(yupValidateOptionsGetOne);
                //-------------------------
                let validatedBody;
                try {
                    validatedBody = await schemaBody.validate(sanitizedBody);
                } catch (error) {
                    console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${error}`);
                    return res.status(400).json({ error });
                }
                //-------------------------
                const optionsGet: OptionsGetOne = { ...validatedBody };
                //-------------------------
                const user = req.user;
                let restricFilter = await this.restricFilter(user);
                //-------------------------
                const script = await this._BackEndApplied.getByHash(hash, optionsGet, restricFilter);
                //-------------------------
                if (!script) {
                    console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${this._Entity.className()} not found`);
                    return res.status(404).json({ error: `${this._Entity.className()} not found` });
                }
                //-------------------------
                console_log(-1, this._Entity.className(), `getByHashApiHandler - POST - OK`);
                //-------------------------
                return res.status(200).json(script.toPlainObject());
            } catch (error) {
                console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while fetching the ${this._Entity.className()}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `getByHashApiHandler - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async addProtocolScriptTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Add Protocol Script Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: ProtocolAddScriptsTxParams & AddScriptTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimal,
                    fieldsForSelect: ProtocolEntity.defaultFieldsAddScriptsTxScript,
                });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const scriptsToAdd = [
                    { hash: protocol.fdpProtocolPolicyID_CS, script: protocol.fdpProtocolPolicyID_Script },
                    { hash: protocol.fdpProtocolValidator_Hash, script: protocol.fdpProtocolValidator_Script },
                    { hash: protocol.fdpScriptPolicyID_CS, script: protocol.fdpScriptPolicyID_Script },
                    { hash: protocol.fdpScriptValidator_Hash, script: protocol.fdpScriptValidator_Script },
                ];
                //--------------------------------------
                const scriptRef = scriptsToAdd.find((script) => script.hash === txParams.script_Hash);
                if (scriptRef === undefined) {
                    throw `Invalid script_Hash ${txParams.script_Hash}`;
                }
                //--------------------------------------
                const scriptPolicyID_Script = protocol.fdpScriptPolicyID_Script;
                const scriptPolicyID_CS = protocol.fdpScriptPolicyID_CS;
                //--------------------------------------
                const scriptValidator_Address: Address = protocol.getNet_Script_Validator_Address();
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - scriptValidator_Address: ${showData(scriptValidator_Address)}`);
                //--------------------------------------
                const scriptID_TN_Hex = txParams.script_Hash;
                const scriptID_AC_Lucid = protocol.fdpScriptPolicyID_CS + scriptID_TN_Hex;
                //--------------------------------------
                const valueFor_Mint_ScriptID: Assets = { [scriptID_AC_Lucid]: 1n };
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - valueFor_Mint_ScriptID: ${showData(valueFor_Mint_ScriptID)}`);
                //--------------------------------------
                const scriptDatum_Out_ForCalcMinADA = this._BackEndApplied.mkNew_ScriptDatum(walletTxParams, txParams);
                const scriptDatum_Out_Hex_ForCalcMinADA = ScriptEntity.datumToCborHex(scriptDatum_Out_ForCalcMinADA);
                //--------------------------------------
                let valueFor_ScriptDatum_Out: Assets = valueFor_Mint_ScriptID;
                const minADA_For_ScriptDatum = calculateMinAdaOfUTxO({ datum: scriptDatum_Out_Hex_ForCalcMinADA, assets: valueFor_ScriptDatum_Out, scriptRef: scriptRef.script });
                const value_MinAda_For_ScriptDatum: Assets = { lovelace: minADA_For_ScriptDatum };
                valueFor_ScriptDatum_Out = addAssets(value_MinAda_For_ScriptDatum, valueFor_ScriptDatum_Out);
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - valueFor_ScriptDatum_Out: ${showData(valueFor_ScriptDatum_Out, false)}`);
                //--------------------------------------
                const scriptDatum_Out = this._BackEndApplied.mkNew_ScriptDatum(walletTxParams, txParams);
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - scriptDatum_Out: ${showData(scriptDatum_Out, false)}`);
                const scriptDatum_Out_Hex = ScriptEntity.datumToCborHex(scriptDatum_Out);
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - scriptDatum_Out_Hex: ${showData(scriptDatum_Out_Hex, false)}`);
                //--------------------------------------
                const scriptPolicyRedeemerMintID = new ScriptPolicyRedeemerMintID();
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - scriptPolicyRedeemerMintID: ${showData(scriptPolicyRedeemerMintID, false)}`);
                const scriptPolicyRedeemerMintID_Hex = objToCborHex(scriptPolicyRedeemerMintID);
                console_log(0, this._Entity.className(), `Add Protocol Script Tx - scriptPolicyRedeemerMintID_Hex: ${showData(scriptPolicyRedeemerMintID_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Add Protocol Script Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(from)} to ${convertMillisToTime(
                        until
                    )} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.SCRIPTS_ADD,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .mintAssets(valueFor_Mint_ScriptID, scriptPolicyRedeemerMintID_Hex)
                        .pay.ToAddressWithData(scriptValidator_Address, { kind: 'inline', value: scriptDatum_Out_Hex }, valueFor_ScriptDatum_Out, scriptRef.script)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptScriptPolicyID = await this._BackEndApplied.getByHash(scriptPolicyID_CS);
                    if (scriptScriptPolicyID !== undefined) {
                        console_log(0, this._Entity.className(), `Add Protocol Script Tx - Using Script as Ref: ${scriptPolicyID_CS}`);
                        const smartUTxO = scriptScriptPolicyID.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Script`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Add Protocol Script Tx - Attaching Script: ${scriptPolicyID_CS}`);
                        tx = tx.attach.MintingPolicy(scriptPolicyID_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Add Protocol Script Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionScriptPolicyRedeemerMintID: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'Mint',
                        redeemerObj: scriptPolicyRedeemerMintID,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionScriptDatum_Out: TransactionDatum = {
                        address: scriptValidator_Address,
                        datumType: ScriptEntity.className(),
                        datumObj: scriptDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { protocol_id: protocol._DB_id, script_id: undefined },
                        redeemers: { scriptPolicyRedeemerMintID: transactionScriptPolicyRedeemerMintID },
                        datums: { scriptDatum_Out: transactionScriptDatum_Out },
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Add Protocol Script Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Add Protocol Script Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Add Protocol Script Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Add Protocol Script Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async addCampaignScriptTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Add Campaign Script Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: CampaignAddScriptsTxParams & AddScriptTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                const protocol = await ProtocolBackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, { fieldsForSelect: {} });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const campaign: CampaignEntity | undefined = await CampaignBackEndApplied.getById_(txParams.campaign_id, {
                    ...optionsGetMinimal,
                    fieldsForSelect: CampaignEntity.defaultFieldsAddScriptsTxScript,
                });
                if (campaign === undefined) {
                    throw `Invalid campaign id`;
                }
                //--------------------------------------
                const scriptsToAdd = [
                    { hash: campaign.fdpCampaignPolicy_CS, script: campaign.fdpCampaignPolicy_Script },
                    { hash: campaign.fdpCampaignValidator_Hash, script: campaign.fdpCampaignValidator_Script },
                    { hash: campaign.fdpCampaignFundsPolicyID_CS, script: campaign.fdpCampaignFundsPolicyID_Script },
                    { hash: campaign.fdpCampaignFundsValidator_Hash, script: campaign.fdpCampaignFundsValidator_Script },
                ];
                //--------------------------------------
                const scriptRef = scriptsToAdd.find((script) => script.hash === txParams.script_Hash);
                if (scriptRef === undefined) {
                    throw `Invalid script Hash ${txParams.script_Hash}`;
                }
                //--------------------------------------
                const script = await this._BackEndApplied.getByHash(txParams.script_Hash);
                if (script !== undefined) {
                    throw `Skipping script: ${txParams.script_Hash}, it's already added`;
                }
                //--------------------------------------
                const scriptPolicyID_Script = protocol.fdpScriptPolicyID_Script;
                const scriptPolicyID_CS = protocol.fdpScriptPolicyID_CS;
                //--------------------------------------
                const scriptValidator_Address: Address = protocol.getNet_Script_Validator_Address();
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - scriptValidator_Address: ${showData(scriptValidator_Address)}`);
                //--------------------------------------
                const scriptID_TN_Hex = txParams.script_Hash;
                const scriptID_AC_Lucid = protocol.fdpScriptPolicyID_CS + scriptID_TN_Hex;
                //--------------------------------------
                const valueFor_Mint_ScriptID: Assets = { [scriptID_AC_Lucid]: 1n };
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - valueFor_Mint_ScriptID: ${showData(valueFor_Mint_ScriptID)}`);
                //--------------------------------------
                const scriptDatum_Out_ForCalcMinADA = this._BackEndApplied.mkNew_ScriptDatum(walletTxParams, txParams);
                const scriptDatum_Out_Hex_ForCalcMinADA = ScriptEntity.datumToCborHex(scriptDatum_Out_ForCalcMinADA);
                //--------------------------------------
                let valueFor_ScriptDatum_Out: Assets = valueFor_Mint_ScriptID;
                const minADA_For_ScriptDatum = calculateMinAdaOfUTxO({ datum: scriptDatum_Out_Hex_ForCalcMinADA, assets: valueFor_ScriptDatum_Out, scriptRef: scriptRef.script });
                const value_MinAda_For_ScriptDatum: Assets = { lovelace: minADA_For_ScriptDatum };
                valueFor_ScriptDatum_Out = addAssets(value_MinAda_For_ScriptDatum, valueFor_ScriptDatum_Out);
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - valueFor_ScriptDatum_Out: ${showData(valueFor_ScriptDatum_Out, false)}`);
                //--------------------------------------
                const scriptDatum_Out = this._BackEndApplied.mkNew_ScriptDatum(walletTxParams, txParams);
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - scriptDatum_Out: ${showData(scriptDatum_Out, false)}`);
                const scriptDatum_Out_Hex = ScriptEntity.datumToCborHex(scriptDatum_Out);
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - scriptDatum_Out_Hex: ${showData(scriptDatum_Out_Hex, false)}`);
                //--------------------------------------
                const scriptPolicyRedeemerMintID = new ScriptPolicyRedeemerMintID();
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - scriptPolicyRedeemerMintID: ${showData(scriptPolicyRedeemerMintID, false)}`);
                const scriptPolicyRedeemerMintID_Hex = objToCborHex(scriptPolicyRedeemerMintID);
                console_log(0, this._Entity.className(), `Add Campaign Script Tx - scriptPolicyRedeemerMintID_Hex: ${showData(scriptPolicyRedeemerMintID_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Add Campaign Script Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(from)} to ${convertMillisToTime(
                        until
                    )} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.SCRIPTS_ADD,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    //--------------------------------------
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    //--------------------------------------
                    tx = tx
                        .mintAssets(valueFor_Mint_ScriptID, scriptPolicyRedeemerMintID_Hex)
                        .pay.ToAddressWithData(scriptValidator_Address, { kind: 'inline', value: scriptDatum_Out_Hex }, valueFor_ScriptDatum_Out, scriptRef.script)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const scriptScriptPolicyID = await this._BackEndApplied.getByHash(scriptPolicyID_CS);
                    if (scriptScriptPolicyID !== undefined) {
                        console_log(0, this._Entity.className(), `Add Campaign Script Tx - Using Script as Ref: ${scriptPolicyID_CS}`);
                        const smartUTxO = scriptScriptPolicyID.smartUTxO;
                        if (smartUTxO === undefined) {
                            throw `Can't find smartUTxO in Script`;
                        }
                        const uTxO = smartUTxO.getUTxO();
                        tx = tx.readFrom([uTxO]);
                    } else {
                        console_log(0, this._Entity.className(), `Add Campaign Script Tx - Attaching Script: ${scriptPolicyID_CS}`);
                        tx = tx.attach.MintingPolicy(scriptPolicyID_Script);
                    }
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Add Campaign Script Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionScriptPolicyRedeemerMintID: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'Mint',
                        redeemerObj: scriptPolicyRedeemerMintID,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionScriptDatum_Out: TransactionDatum = {
                        address: scriptValidator_Address,
                        datumType: ScriptEntity.className(),
                        datumObj: scriptDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { protocol_id: protocol._DB_id, campagin_id: campaign._DB_id, script_id: undefined },
                        redeemers: { scriptPolicyRedeemerMintID: transactionScriptPolicyRedeemerMintID },
                        datums: { scriptDatum_Out: transactionScriptDatum_Out },
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Add Campaign Script Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Add Campaign Script Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Add Protocol Script Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Add Campaign Script Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    // #endregion custom api handlers
}
