import { CAMPAIGN_VERSION, EMERGENCY_ADMIN_TOKEN_POLICY_CS, PROTOCOL_VERSION, TxEnums } from '@/utils/constants/on-chain';
import {
    CampaignCategoryDefault,
    CampaignCategoryDefaultNames,
    CampaignStatusDefaultNames,
    MilestoneStatusDefaultNames,
    protocolDefault,
    SubmissionStatusDefaultNames,
} from '@/utils/populate/defaults';
import {
    CampaignDatumStatus_Code_Id_Enums,
    CampaignStatus_Code_Id_Enums,
    MilestoneDatumStatus_Code_Id_Enums,
    MilestoneStatus_Code_Id_Enums,
    SubmissionStatus_Enums,
} from '@/utils/constants/status/status';
import {
    Address,
    applyParamsToScript,
    Assets,
    Data,
    Lucid,
    LucidEvolution,
    MintingPolicy,
    mintingPolicyToId,
    PaymentKeyHash,
    TxBuilder,
    UTxO,
    Validator,
    validatorToAddress,
    validatorToScriptHash,
} from '@lucid-evolution/lucid';
import { NextApiResponse } from 'next';
import { User } from 'next-auth';
import {
    addAssetsList,
    addressToPubKeyHash,
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseEntity,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    calculateMinAdaOfUTxO,
    console_error,
    console_log,
    convertMillisToTime,
    find_TxOutRef_In_UTxOs,
    fixUTxOList,
    getScriptFromJson,
    getTxRedeemersDetailsAndResources,
    isEmulator,
    LUCID_NETWORK_MAINNET_ID,
    LUCID_NETWORK_MAINNET_NAME,
    LUCID_NETWORK_PREVIEW_NAME,
    LucidToolsBackEnd,
    NextApiRequestAuthenticated,
    objToCborHex,
    optionsGetMinimalWithSmartUTxOCompleteFields,
    sanitizeForDatabase,
    showData,
    TimeBackEnd,
    toJson,
    TRANSACTION_STATUS_CREATED,
    TRANSACTION_STATUS_PENDING,
    TransactionBackEndApplied,
    TransactionDatum,
    TransactionEntity,
    TransactionRedeemer,
    TxOutRef,
    WALLET_CREATEDBY_LOGIN,
    WalletBackEndApplied,
    WalletEntity,
    WalletTxParams,
} from 'smart-db/backEnd';
import { ProtocolCreateParams, ProtocolDeployTxParams, ProtocolUpdateTxParams } from '../Commons/Params';
import {
    CampaignCategoryEntity,
    CampaignContentEntity,
    CampaignEntity,
    CampaignFaqsEntity,
    CampaignMemberEntity,
    CampaignMilestoneDatum,
    CampaignStatusEntity,
    CampaignSubmissionEntity,
    MilestoneEntity,
    MilestoneStatusEntity,
    MilestoneSubmissionEntity,
    ProtocolAdminWalletEntity,
    ScriptEntity,
    SubmissionStatusEntity,
} from '../Entities';
import { CampaignFactory, ProtocolDatum, ProtocolEntity } from '../Entities/Protocol.Entity';
import { ProtocolPolicyRedeemerMintID, ProtocolValidatorRedeemerDatumUpdate } from '../Entities/Redeemers/Protocol.Redeemer';

@BackEndAppliedFor(ProtocolEntity)
export class ProtocolBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = ProtocolEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    // #region class methods

    public static async createWithScripts(lucid: LucidEvolution, params: ProtocolCreateParams): Promise<ProtocolEntity> {
        //--------------------------------------
        const uTxO: UTxO = params.uTxO;
        //--------------------------------------
        let protocolFactory;
        try {
            const configJsonObject = JSON.parse(params.configJson);
            //--------------------------------------
            protocolFactory = {
                ...configJsonObject,
                fdpProtocolPolicyID_Pre_CborHex: getScriptFromJson(configJsonObject.fdpProtocolPolicyID_Pre_CborHex),
                fdpProtocolValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpProtocolValidator_Pre_CborHex),
                fdpScriptPolicyID_Pre_CborHex: getScriptFromJson(configJsonObject.fdpScriptPolicyID_Pre_CborHex),
                fdpScriptValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpScriptValidator_Pre_CborHex),
                fdpCampaignPolicy_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignPolicy_Pre_CborHex),
                fdpCampaignValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignValidator_Pre_CborHex),
                fdpCampaignFundsPolicyID_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignFundsPolicyID_Pre_CborHex),
                fdpCampaignFundsValidator_Pre_CborHex: getScriptFromJson(configJsonObject.fdpCampaignFundsValidator_Pre_CborHex),
            };
        } catch (error) {
            throw 'Invalid config json file ' + error;
        }
        //--------------------------------------
        const protocol_TxHash = uTxO.txHash;
        const protocol_TxOutputIndex = uTxO.outputIndex;
        //--------------------------------------
        // Protocol Policy
        const ParamsSchemaProtocolPolicyID = Data.Tuple([Data.Bytes(), Data.Integer()]);
        type ParamsProtocolPolicy = Data.Static<typeof ParamsSchemaProtocolPolicyID>;
        //--------------------------------------
        const fdpProtocolPolicyID_Params = {
            protocol_TxHash,
            protocol_TxOutputIndex: BigInt(protocol_TxOutputIndex),
        };
        //--------------------------------------
        const fdpProtocolPolicyID_Script: MintingPolicy = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsProtocolPolicy>(
                protocolFactory.fdpProtocolPolicyID_Pre_CborHex.script,
                [fdpProtocolPolicyID_Params.protocol_TxHash, fdpProtocolPolicyID_Params.protocol_TxOutputIndex],
                ParamsSchemaProtocolPolicyID as unknown as ParamsProtocolPolicy
            ),
        };
        //--------------------------------------
        const fdpProtocolPolicyID_CS = mintingPolicyToId(fdpProtocolPolicyID_Script);
        console.log(`fdpProtocolPolicyID_CS ${fdpProtocolPolicyID_CS}`);
        //--------------------------------------
        // Protocol Validator
        const ParamsSchemaProtocolValidator = Data.Tuple([Data.Bytes(), Data.Bytes()]);
        type ParamsProtocolValidator = Data.Static<typeof ParamsSchemaProtocolValidator>;
        //--------------------------------------
        const fdpProtocolValidator_Params = {
            protocolPolicyID_CS: fdpProtocolPolicyID_CS,
            tokenEmergencyAdminPolicy_CS: EMERGENCY_ADMIN_TOKEN_POLICY_CS,
        };
        //--------------------------------------
        const fdpProtocolValidator_Script: Validator = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsProtocolValidator>(
                protocolFactory.fdpProtocolValidator_Pre_CborHex.script,
                [fdpProtocolValidator_Params.protocolPolicyID_CS, fdpProtocolValidator_Params.tokenEmergencyAdminPolicy_CS],
                ParamsSchemaProtocolValidator as unknown as ParamsProtocolValidator
            ),
        };
        //--------------------------------------
        const fdpProtocolValidator_Hash = validatorToScriptHash(fdpProtocolValidator_Script);
        console.log(`fdpProtocolValidator_Hash ${fdpProtocolValidator_Hash}`);
        //--------------------------------------
        const fdpProtocolValidator_AddressTestnet = validatorToAddress(LUCID_NETWORK_PREVIEW_NAME, fdpProtocolValidator_Script);
        console.log(`fdpProtocolValidator_AddressTestnet ${fdpProtocolValidator_AddressTestnet}`);
        const fdpProtocolValidator_AddressMainnet = validatorToAddress(LUCID_NETWORK_MAINNET_NAME, fdpProtocolValidator_Script);
        console.log(`fdpProtocolValidator_AddressMainnet ${fdpProtocolValidator_AddressMainnet}`);
        //--------------------------------------
        // Script Policy
        const ParamsSchemaScriptPolicyID = Data.Tuple([Data.Bytes()]);
        type ParamsScriptPolicy = Data.Static<typeof ParamsSchemaScriptPolicyID>;
        //--------------------------------------
        const fdpScriptPolicyID_Params = {
            protocolPolicyID_CS: fdpProtocolPolicyID_CS,
        };
        //--------------------------------------
        const fdpScriptPolicyID_Script: MintingPolicy = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsScriptPolicy>(
                protocolFactory.fdpScriptPolicyID_Pre_CborHex.script,
                [fdpScriptPolicyID_Params.protocolPolicyID_CS],
                ParamsSchemaScriptPolicyID as unknown as ParamsScriptPolicy
            ),
        };
        //--------------------------------------
        const fdpScriptPolicyID_CS = mintingPolicyToId(fdpScriptPolicyID_Script);
        console.log(`fdpScriptPolicyID_CS ${fdpScriptPolicyID_CS}`);
        //--------------------------------------
        // Script Validator
        const ParamsSchemaScriptValidator = Data.Tuple([Data.Bytes(), Data.Bytes()]);
        type ParamsScriptValidator = Data.Static<typeof ParamsSchemaScriptValidator>;
        //--------------------------------------
        const fdpScriptValidator_Params = {
            protocolPolicyID_CS: fdpProtocolPolicyID_CS,
            scriptPolicyID_CS: fdpScriptPolicyID_CS,
        };
        //--------------------------------------
        const fdpScriptValidator_Script: Validator = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsScriptValidator>(
                protocolFactory.fdpScriptValidator_Pre_CborHex.script,
                [fdpScriptValidator_Params.protocolPolicyID_CS, fdpScriptValidator_Params.scriptPolicyID_CS],
                ParamsSchemaScriptValidator as unknown as ParamsScriptValidator
            ),
        };
        //--------------------------------------
        const fdpScriptValidator_Hash = validatorToScriptHash(fdpScriptValidator_Script);
        console.log(`fdpScriptValidator_Hash ${fdpScriptValidator_Hash}`);
        //--------------------------------------
        const fdpScriptValidator_AddressTestnet = validatorToAddress(LUCID_NETWORK_PREVIEW_NAME, fdpScriptValidator_Script);
        console.log(`fdpScriptValidator_AddressTestnet ${fdpScriptValidator_AddressTestnet}`);
        const fdpScriptValidator_AddressMainnet = validatorToAddress(LUCID_NETWORK_MAINNET_NAME, fdpScriptValidator_Script);
        console.log(`fdpScriptValidator_AddressMainnet ${fdpScriptValidator_AddressMainnet}`);
        //--------------------------------------
        const campaignFactory: CampaignFactory = {
            name: params.name,
            fdpCampaignVersion: protocolFactory.fdpCampaignVersion,
            fdpCampaignPolicy_Pre_CborHex: protocolFactory.fdpCampaignPolicy_Pre_CborHex,
            fdpCampaignValidator_Pre_CborHex: protocolFactory.fdpCampaignValidator_Pre_CborHex,
            fdpCampaignFundsPolicyID_Pre_CborHex: protocolFactory.fdpCampaignFundsPolicyID_Pre_CborHex,
            fdpCampaignFundsValidator_Pre_CborHex: protocolFactory.fdpCampaignFundsValidator_Pre_CborHex,
        };
        const protocol: ProtocolEntity = new ProtocolEntity({
            name: params.name,
            fdpProtocolVersion: protocolFactory.fdpProtocolVersion,
            fdpScriptVersion: protocolFactory.fdpScriptVersion,
            fdpProtocolPolicyID_CS,
            fdpProtocolPolicyID_Script,
            fdpProtocolPolicyID_Params,
            fdpProtocolValidator_AddressMainnet,
            fdpProtocolValidator_AddressTestnet,
            fdpProtocolValidator_Script,
            fdpProtocolValidator_Hash,
            fdpProtocolValidator_Params,
            fdpScriptPolicyID_CS,
            fdpScriptPolicyID_Script,
            fdpScriptPolicyID_Params,
            fdpScriptValidator_AddressMainnet,
            fdpScriptValidator_AddressTestnet,
            fdpScriptValidator_Script,
            fdpScriptValidator_Hash,
            fdpScriptValidator_Params,
            fdpCampaignFactories: [campaignFactory],
            // _NET_address: 'use getNet_Address()',
            // _NET_id_CS: 'use getNET_id_CS()',
            _isDeployed: false,
        });
        protocol._creator = params!.creator;
        const protocol_ = await this.create(protocol);
        //--------------------------------------
        await this._BackEndMethods.createHook<ProtocolEntity>(ProtocolEntity, protocol.getNet_Address(), protocol.fdpProtocolPolicyID_CS);
        await this._BackEndMethods.createHook<ScriptEntity>(ScriptEntity, protocol.getNet_Script_Validator_Address(), protocol.fdpScriptPolicyID_CS);
        //--------------------------------------
        return protocol_;
    }

    // #region populate

    public static async populate(lucid: LucidEvolution, walletTxParams: WalletTxParams): Promise<boolean> {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populate - Init`);
        //--------------------------------------
        await this.populateAll(lucid, walletTxParams);
        //--------------------------------------
        console_log(0, this._Entity.className(), `populate - End`);
        //--------------------------------------
        return true;
        //--------------------------------------
    }

    public static async populateAll(lucid: LucidEvolution, walletTxParams: WalletTxParams) {
        const wallet = await this.populateUser(walletTxParams);
        const protocol = await this.populateProtocol(lucid, walletTxParams, wallet);
        await this.populateCampaignStatus();
        await this.populateCampaignCategory();
        await this.populateMilestoneStatus();
        await this.populateSubmissionStatus();
        // await this.populateCampaigns(lucid, walletTxParams, protocol, wallet);
    }

    private static async populateUser(walletTxParams: WalletTxParams): Promise<WalletEntity> {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateUser - INIT`);
        //--------------------------------------
        let wallet: WalletEntity | undefined;
        if (!(await WalletBackEndApplied.checkIfExists_({ paymentPKH: walletTxParams.pkh }))) {
            //-------------------------
            const createdBy = WALLET_CREATEDBY_LOGIN;
            const lastConnection = new Date();
            const walletName = 'eternl'; // walletTxParams.walletNameOrSeedOrKey;
            const walletValidatedWithSignedToken = false; //walletTxParams.isWalletValidatedWithSignedToken;
            //--------------------
            const paymentPKH = walletTxParams.pkh;
            const stakePKH = walletTxParams.stakePkh;
            //--------------------------------------
            let testnet_address,
                mainnet_address = undefined;
            //--------------------------------------
            if (process.env.NEXT_PUBLIC_CARDANO_NET === LUCID_NETWORK_MAINNET_NAME) {
                mainnet_address = walletTxParams.address;
            } else {
                testnet_address = walletTxParams.address;
            }
            //--------------------------------------
            wallet = new WalletEntity({
                createdBy,
                lastConnection,
                walletName,
                walletValidatedWithSignedToken: walletValidatedWithSignedToken,
                paymentPKH,
                stakePKH,
                name: 'populated',
                email: '',
                isCoreTeam: true,
                testnet_address,
                mainnet_address,
            });
            //--------------------
            wallet = await WalletBackEndApplied.create(wallet);
            //--------------------
        } else {
            wallet = await WalletBackEndApplied.getOneByParams_({ paymentPKH: walletTxParams.pkh });
        }
        if (wallet === undefined) {
            throw 'Wallet not found';
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateUser - OK`);
        //--------------------------------------
        return wallet;
    }

    private static async populateProtocol(lucid: LucidEvolution, walletTxParams: WalletTxParams, wallet: WalletEntity): Promise<ProtocolEntity> {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateProtocol - INIT`);
        //--------------------------------------
        // const ProtocoBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
        const ProtocolAdminWalletBackEndApplied = (await import('./ProtocolAdminWallet.BackEnd.Api.Handlers')).ProtocolAdminWalletBackEndApplied;
        //--------------------------------------
        if (walletTxParams.utxos.length === 0) {
            throw 'You need at least one utxo to be used to mint Protocol ID';
        }
        const uTxO = walletTxParams.utxos[0];
        //--------------------------------------
        let protocol: ProtocolEntity | undefined = undefined;
        //--------------------------------------
        if (!(await this.checkIfExists_({ name: protocolDefault.name }))) {
            protocol = await this.createWithScripts(lucid, { name: protocolDefault.name, configJson: toJson(protocolDefault.deployJson), uTxO, creator: wallet.paymentPKH });
        } else {
            protocol = await this.getOneByParams_({ name: protocolDefault.name });
        }
        if (protocol === undefined) {
            throw 'Protocol not found';
        }
        //--------------------------------------
        if (!(await ProtocolAdminWalletBackEndApplied.checkIfExists_({ protocol_id: protocol._DB_id, wallet_id: wallet._DB_id }))) {
            console_log(0, this._Entity.className(), `populateProtocolAdminWallet`);
            let protocolAdminWallet: ProtocolAdminWalletEntity = new ProtocolAdminWalletEntity({ protocol_id: protocol._DB_id, wallet_id: wallet._DB_id });
            await ProtocolAdminWalletBackEndApplied.create(protocolAdminWallet);
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateProtocol - OK`);
        //--------------------------------------
        return protocol;
    }

    private static async populateCampaignStatus() {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateCampaignStatus - INIT`);
        //--------------------------------------
        const CampaignStatusBackEndApplied = (await import('./CampaignStatus.BackEnd.Api.Handlers')).CampaignStatusBackEndApplied;
        //--------------------------------------
        const campaignStatuses = Object.values(CampaignStatus_Code_Id_Enums).filter((value) => typeof value === 'number') as CampaignStatus_Code_Id_Enums[];
        //--------------------------------------
        for (const status of campaignStatuses) {
            console.log(`State: ${status}, Description: ${CampaignStatusDefaultNames[status]}`);
            let campaignStatus: CampaignStatusEntity = new CampaignStatusEntity();
            campaignStatus.code_id = status;
            campaignStatus.name = CampaignStatusDefaultNames[status];
            if (!(await CampaignStatusBackEndApplied.checkIfExists_({ code_id: campaignStatus.code_id }))) {
                campaignStatus = await CampaignStatusBackEndApplied.create(campaignStatus);
            }
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateCampaignStatus - OK`);
        //--------------------------------------
        return true;
    }

    private static async populateMilestoneStatus() {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateMilestoneStatus - Init`);
        //--------------------------------------
        const MilestoneStatusBackEndApplied = (await import('./MilestoneStatus.BackEnd.Api.Handlers')).MilestoneStatusBackEndApplied;
        //--------------------------------------
        const milestoneStatuses = Object.values(MilestoneStatus_Code_Id_Enums).filter((value) => typeof value === 'number') as MilestoneStatus_Code_Id_Enums[];
        //--------------------------------------
        for (const status of milestoneStatuses) {
            console.log(`State: ${status}, Description: ${MilestoneStatusDefaultNames[status]}`);
            let milestoneStatus: MilestoneStatusEntity = new MilestoneStatusEntity();
            milestoneStatus.code_id = status;
            milestoneStatus.name = MilestoneStatusDefaultNames[status];
            if (!(await MilestoneStatusBackEndApplied.checkIfExists_({ code_id: milestoneStatus.code_id }))) {
                milestoneStatus = await MilestoneStatusBackEndApplied.create(milestoneStatus);
            }
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateMilestoneStatus - OK`);
        //--------------------------------------
        return true;
    }

    private static async populateCampaignCategory() {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateCampaignCategory - INIT`);
        //--------------------------------------
        const CampaignCategoryBackEndApplied = (await import('./CampaignCategory.BackEnd.Api.Handlers')).CampaignCategoryBackEndApplied;
        //--------------------------------------
        const campaignCategories = Object.values(CampaignCategoryDefault).filter((value) => typeof value === 'number') as CampaignCategoryDefault[];
        //--------------------------------------
        for (const category of campaignCategories) {
            console.log(`Category: ${category}, Description: ${CampaignCategoryDefaultNames[category]}`);
            let campaignCategory: CampaignCategoryEntity = new CampaignCategoryEntity();
            campaignCategory.name = CampaignCategoryDefaultNames[category];
            if (!(await CampaignCategoryBackEndApplied.checkIfExists_({ name: campaignCategory.name }))) {
                campaignCategory = await CampaignCategoryBackEndApplied.create(campaignCategory);
            }
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateCampaignCategory - OK`);
        //--------------------------------------
        return true;
    }

    private static async populateSubmissionStatus() {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateSubmissionStatus - Init`);
        //--------------------------------------
        const SubmissionStatusBackEndApplied = (await import('./SubmissionStatus.BackEnd.Api.Handlers')).SubmissionStatusBackEndApplied;
        //--------------------------------------
        const submissionStatuses = Object.values(SubmissionStatus_Enums).filter((value) => typeof value === 'number') as SubmissionStatus_Enums[];
        //--------------------------------------
        for (const status of submissionStatuses) {
            console.log(`State: ${status}, Description: ${SubmissionStatusDefaultNames[status]}`);
            let submissionStatus: SubmissionStatusEntity = new SubmissionStatusEntity();
            submissionStatus.code_id = status;
            submissionStatus.name = SubmissionStatusDefaultNames[status];
            if (!(await SubmissionStatusBackEndApplied.checkIfExists_({ code_id: submissionStatus.code_id }))) {
                submissionStatus = await SubmissionStatusBackEndApplied.create(submissionStatus);
            }
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateSubmissionStatus - OK`);
        //--------------------------------------
        return true;
    }

    private static async populateCampaigns(lucid: LucidEvolution, walletTxParams: WalletTxParams, protocol: ProtocolEntity, wallet: WalletEntity): Promise<boolean> {
        console_log(0, this._Entity.className(), `populateCampaigns - INIT`);
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;
        const campaignsData = protocolDefault.campaignsPopulateJson.campaigns;
        let campaign: CampaignEntity | undefined;
        for (const campaignData of campaignsData) {
            try {
                // Check if campaign already exists
                const existingCampaign = await CampaignBackEndApplied.getOneByParams_({ name: campaignData.name });
                if (existingCampaign) {
                    console.log(`Campaign ${campaignData.name} already exists, skipping...`);
                    continue;
                }

                campaign = undefined;

                // Get campaign's wallets
                const campaignWallets = await this.getOrCreateCampaignWallets(campaignData);

                // Fetch reference IDs
                const categoryId = await this.getCampaign_Category_DB_Id(campaignData.campaign_category_id_as_string);
                const code_id = await this.getCampaign_Status_DB_id(campaignData.campaign_status_id_as_string);

                // Create campaign
                campaign = await this.createCampaign(campaignData, categoryId, code_id, campaignWallets);

                // Create related records
                await this.createCampaignContents(campaign._DB_id, campaignData.contents);
                await this.createCampaignFaqs(campaign._DB_id, campaignData.faqs);
                await this.createCampaignMembers(campaign._DB_id, campaignData.members, campaignWallets);
                await this.createCampaignSubmissions(campaign._DB_id, campaignData.submissions, campaignWallets);
                await this.createCampaignMilestones(campaign._DB_id, campaignData.milestones, campaignWallets);
            } catch (error) {
                console.error(`Error populating campaign ${campaignData.name}:`, error);
                if (campaign) {
                    console.error(`Rolling back changes for campaign ${campaignData.name}...`);
                    await this.rollbackCampaign(campaign._DB_id);
                }
            }
        }

        console_log(0, this._Entity.className(), `populateCampaigns - OK`);
        return true;
    }

    private static async rollbackCampaign(campaignId: string): Promise<void> {
        try {
            console.log(`Rolling back campaign ${campaignId} and all related entities...`);

            // Delete all related entities first (due to foreign key constraints)
            const MilestoneSubmissionBackEndApplied = (await import('./MilestoneSubmission.BackEnd.Api.Handlers')).MilestoneSubmissionBackEndApplied;
            const MilestoneBackEndApplied = (await import('./Milestone.BackEnd.Api.Handlers')).MilestoneBackEndApplied;
            const CampaignSubmissionBackEndApplied = (await import('./CampaignSubmission.BackEnd.Api.Handlers')).CampaignSubmissionBackEndApplied;
            const CampaignMemberBackEndApplied = (await import('./CampaignMember.BackEnd.Api.Handlers')).CampaignMemberBackEndApplied;
            const CampaignFaqsBackEndApplied = (await import('./CampaignFaqs.BackEnd.Api.Handlers')).CampaignFaqsBackEndApplied;
            const CampaignContentBackEndApplied = (await import('./CampaignContent.BackEnd.Api.Handlers')).CampaignContentBackEndApplied;
            const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;

            // Get all milestones to delete their submissions
            const milestones = await MilestoneBackEndApplied.getByParams_({ campaign_id: campaignId });
            for (const milestone of milestones) {
                // Delete milestone submissions
                await MilestoneSubmissionBackEndApplied.deleteByParams_({ milestone_id: milestone._DB_id });
            }

            // Delete milestones
            await MilestoneBackEndApplied.deleteByParams_({ campaign_id: campaignId });

            // Delete campaign submissions
            await CampaignSubmissionBackEndApplied.deleteByParams_({ campaign_id: campaignId });

            // Delete campaign members
            await CampaignMemberBackEndApplied.deleteByParams_({ campaign_id: campaignId });

            // Delete campaign FAQs
            await CampaignFaqsBackEndApplied.deleteByParams_({ campaign_id: campaignId });

            // Delete campaign contents
            await CampaignContentBackEndApplied.deleteByParams_({ campaign_id: campaignId });

            // Finally delete the campaign itself
            await CampaignBackEndApplied.deleteById_(campaignId);

            console.log(`Successfully rolled back campaign ${campaignId} and all related entities`);
        } catch (error) {
            console.error(`Error during rollback of campaign ${campaignId}:`, error);
            throw error; // Re-throw to let caller know rollback failed
        }
    }

    private static async getCampaign_Category_DB_Id(categoryName: string): Promise<string> {
        const CampaignCategoryBackEndApplied = (await import('./CampaignCategory.BackEnd.Api.Handlers')).CampaignCategoryBackEndApplied;

        // Get enum value from category name
        const code_id = CampaignCategoryDefault[categoryName as keyof typeof CampaignCategoryDefault];
        if (code_id === undefined) {
            throw new Error(`Invalid category name: ${categoryName}`);
        }
        const categoryNameOk = CampaignCategoryDefaultNames[code_id as keyof typeof CampaignCategoryDefaultNames];
        if (categoryNameOk === undefined) {
            throw new Error(`Invalid category name: ${categoryName}`);
        }

        // Query by code_id
        const category = await CampaignCategoryBackEndApplied.getOneByParams_({ name: categoryNameOk });
        if (!category) {
            throw new Error(`Category not found for name: ${categoryNameOk}`);
        }

        return category._DB_id;
    }

    private static async getCampaign_Status_DB_id(statusName: string): Promise<string> {
        const CampaignStatusBackEndApplied = (await import('./CampaignStatus.BackEnd.Api.Handlers')).CampaignStatusBackEndApplied;

        // Get enum value from status name
        const code_id = CampaignStatus_Code_Id_Enums[statusName as keyof typeof CampaignStatus_Code_Id_Enums];
        if (code_id === undefined) {
            throw new Error(`Invalid status name: ${statusName}`);
        }

        // Query by code_id
        const status = await CampaignStatusBackEndApplied.getOneByParams_({ code_id: code_id });
        if (!status) {
            throw new Error(`Status not found for code_id: ${code_id}`);
        }

        return status._DB_id;
    }

    private static async getMilestone_Status_DB_id(statusName: string): Promise<string> {
        const MilestoneStatusBackEndApplied = (await import('./MilestoneStatus.BackEnd.Api.Handlers')).MilestoneStatusBackEndApplied;

        // Get enum value from status name
        const code_id = MilestoneStatus_Code_Id_Enums[statusName as keyof typeof MilestoneStatus_Code_Id_Enums];
        if (code_id === undefined) {
            throw new Error(`Invalid milestone status name: ${statusName}`);
        }

        // Query by code_id
        const status = await MilestoneStatusBackEndApplied.getOneByParams_({ code_id: code_id });
        if (!status) {
            throw new Error(`Milestone status not found for code_id: ${code_id}`);
        }

        return status._DB_id;
    }

    private static async getSubmission_Status_DB_id(statusName: string): Promise<string> {
        const SubmissionStatusBackEndApplied = (await import('./SubmissionStatus.BackEnd.Api.Handlers')).SubmissionStatusBackEndApplied;

        // Get enum value from status name
        const code_id = SubmissionStatus_Enums[statusName as keyof typeof SubmissionStatus_Enums];
        if (code_id === undefined) {
            throw new Error(`Invalid submission status name: ${statusName}`);
        }

        // Query by code_id
        const status = await SubmissionStatusBackEndApplied.getOneByParams_({ code_id: code_id });
        if (!status) {
            throw new Error(`Submission status not found for code_id: ${code_id}`);
        }

        return status._DB_id;
    }

    private static async getCampaignAdmins(campaignData: any, wallets: Record<string, WalletEntity>): Promise<string[]> {
        // Get all members marked as admin including creator
        const adminMembers = campaignData.members.filter((m: any) => m.admin === true);
        const adminWallets = adminMembers.map((m: any) => wallets[m.wallet_id_as_string]);

        // Get unique paymentPKH values
        return [...new Set(adminWallets.map((w: any) => w.paymentPKH as string))] as string[];
    }

    private static async getOrCreateCampaignWallets(campaignData: any): Promise<Record<string, WalletEntity>> {
        // const WalletBackEndApplied = (await import('./CustomWallet.BackEnd.Api.Handlers')).CustomWalletBackEndApplied;
        const wallets: Record<string, WalletEntity> = {};
        // Get unique wallet IDs from campaign data
        const walletIds = new Set<string>(
            [
                campaignData.creator_wallet_id_as_string,
                ...campaignData.members.map((m: any) => m.wallet_id_as_string),
                ...campaignData.submissions.map((s: any) => [s.submitted_by_wallet_id_as_string, s.revised_by_wallet_id_as_string]).flat(),
                // Milestone submissions
                ...campaignData.milestones
                    .map((m: any) => (m.submissions || []).map((s: any) => [s.submitted_by_wallet_id_as_string, s.revised_by_wallet_id_as_string]).flat())
                    .flat(),
            ].filter((id) => id)
        ); // Remove undefined/null
        for (const walletId of walletIds) {
            let wallet = await WalletBackEndApplied.getOneByParams_<WalletEntity>({ name: walletId });
            // Find first occurrence of this wallet in members array to get data
            const memberData = campaignData.members.find((m: any) => m.wallet_id_as_string === walletId);
            if (!wallet) {
                wallet = new WalletEntity({
                    createdBy: 'POPULATE',
                    lastConnection: new Date(),
                    walletName: 'eternl',
                    walletValidatedWithSignedToken: false,
                    paymentPKH: memberData?.paymentPKH || `pkh_${walletId}`, // Placeholder
                    stakePKH: memberData?.stakePKH || `stake_${walletId}`, // Placeholder
                    name: walletId,
                    email: memberData?.email || `${walletId.toLowerCase()}@example.com`,
                    testnet_address: memberData?.testnet_address || `addr_test_${walletId}`, // Placeholder
                    mainnet_address: memberData?.mainnet_address || `addr_${walletId}`, // Placeholder
                });

                wallet = await WalletBackEndApplied.create<WalletEntity>(wallet);
            }
            wallets[walletId] = wallet;
        }
        return wallets;
    }

    private static async createCampaign(campaignData: any, categoryId: string, code_id: string, wallets: Record<string, WalletEntity>): Promise<CampaignEntity> {
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;

        const currentDate = new Date();

        const getCampaignDeployedStatus = (statusStr: string): boolean => {
            // First get the numeric status ID
            const code_id = CampaignStatus_Code_Id_Enums[statusStr as keyof typeof CampaignStatus_Code_Id_Enums];

            return [
                CampaignStatus_Code_Id_Enums.CONTRACT_STARTED,
                CampaignStatus_Code_Id_Enums.COUNTDOWN,
                CampaignStatus_Code_Id_Enums.FUNDRAISING,
                CampaignStatus_Code_Id_Enums.FINISHING,
                CampaignStatus_Code_Id_Enums.ACTIVE,
                CampaignStatus_Code_Id_Enums.SUCCESS,
                CampaignStatus_Code_Id_Enums.FAILED,
                CampaignStatus_Code_Id_Enums.UNREACHED,
            ].includes(code_id);
        };

        const getCampaignActiveStatus = (statusStr: string): boolean => {
            const code_id = CampaignStatus_Code_Id_Enums[statusStr as keyof typeof CampaignStatus_Code_Id_Enums];

            return [CampaignStatus_Code_Id_Enums.ACTIVE, CampaignStatus_Code_Id_Enums.SUCCESS, CampaignStatus_Code_Id_Enums.FAILED].includes(code_id);
        };

        const getCampaignDatumStatus = (statusStr: string): CampaignDatumStatus_Code_Id_Enums => {
            const code_id = CampaignStatus_Code_Id_Enums[statusStr as keyof typeof CampaignStatus_Code_Id_Enums];

            // Map Campaign Status to Datum Status
            switch (code_id) {
                case CampaignStatus_Code_Id_Enums.NOT_STARTED:
                case CampaignStatus_Code_Id_Enums.CREATED:
                case CampaignStatus_Code_Id_Enums.SUBMITTED:
                case CampaignStatus_Code_Id_Enums.REJECTED:
                case CampaignStatus_Code_Id_Enums.APPROVED:
                case CampaignStatus_Code_Id_Enums.CONTRACT_CREATED:
                case CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED:
                case CampaignStatus_Code_Id_Enums.CONTRACT_STARTED:
                    return CampaignDatumStatus_Code_Id_Enums.CsCreated;
                case CampaignStatus_Code_Id_Enums.COUNTDOWN:
                case CampaignStatus_Code_Id_Enums.FUNDRAISING:
                case CampaignStatus_Code_Id_Enums.FINISHING:
                    return CampaignDatumStatus_Code_Id_Enums.CsInitialized;
                case CampaignStatus_Code_Id_Enums.ACTIVE:
                case CampaignStatus_Code_Id_Enums.SUCCESS:
                    return CampaignDatumStatus_Code_Id_Enums.CsReached;
                case CampaignStatus_Code_Id_Enums.UNREACHED:
                    return CampaignDatumStatus_Code_Id_Enums.CsNotReached;
                case CampaignStatus_Code_Id_Enums.FAILED:
                    return CampaignDatumStatus_Code_Id_Enums.CsFailedMilestone;
                default:
                    throw new Error(`Invalid campaign status: ${statusStr}`);
            }
        };

        const getMilestoneDatumStatus = (statusStr: string): MilestoneDatumStatus_Code_Id_Enums => {
            const code_id = MilestoneStatus_Code_Id_Enums[statusStr as keyof typeof MilestoneStatus_Code_Id_Enums];

            // Map Milestone Status to Datum Status
            switch (code_id) {
                case MilestoneStatus_Code_Id_Enums.NOT_STARTED:
                case MilestoneStatus_Code_Id_Enums.STARTED:
                case MilestoneStatus_Code_Id_Enums.SUBMITTED:
                case MilestoneStatus_Code_Id_Enums.REJECTED:
                    return MilestoneDatumStatus_Code_Id_Enums.MsCreated;
                case MilestoneStatus_Code_Id_Enums.COLLECT:
                    return MilestoneDatumStatus_Code_Id_Enums.MsSuccess;
                case MilestoneStatus_Code_Id_Enums.FINISHED:
                    return MilestoneDatumStatus_Code_Id_Enums.MsSuccess;
                case MilestoneStatus_Code_Id_Enums.FAILED:
                    return MilestoneDatumStatus_Code_Id_Enums.MsFailed;
                default:
                    throw new Error(`Invalid milestone status: ${statusStr}`);
            }
        };

        const getDatumsMilestone = (milestones: any[]): CampaignMilestoneDatum[] => {
            return milestones.map((m) => ({
                cmPerncentage: m.perncentage,
                cmStatus: getMilestoneDatumStatus(m.milestone_status_id_as_string),
            }));
        };

        // In createCampaign:
        const isDeployed = getCampaignDeployedStatus(campaignData.campaign_status_id_as_string);
        const isActiveOrBeyond = getCampaignActiveStatus(campaignData.campaign_status_id_as_string);

        // Calculate dates for started campaigns
        let dateFields = {};
        if (isDeployed) {
            const beginAtDate = new Date(currentDate.getTime() + campaignData.begin_at_days * 24 * 60 * 60 * 1000);
            const deadlineDate = new Date(currentDate.getTime() + campaignData.deadline_days * 24 * 60 * 60 * 1000);

            dateFields = {
                cdBegin_at: BigInt(beginAtDate.getTime()),
                cdDeadline: BigInt(deadlineDate.getTime()),
                begin_at: beginAtDate,
                deadline: deadlineDate,
                campaign_deployed_date: currentDate,
            };
        }

        // Add activation date for active campaigns
        if (isActiveOrBeyond) {
            dateFields = {
                ...dateFields,
                campaign_actived_date: currentDate,
            };
        }

        const campaign = new CampaignEntity({
            _isDeployed: isDeployed,

            campaign_category_id: categoryId,
            campaign_status_id: code_id,
            creator_wallet_id: wallets[campaignData.creator_wallet_id_as_string]._DB_id,

            name: campaignData.name,
            description: campaignData.description,

            // Always set these days
            begin_at_days: campaignData.begin_at_days,
            deadline_days: campaignData.deadline_days,

            // Add calculated date fields if applicable
            ...dateFields,

            mint_CampaignToken: campaignData.mint_CampaignToken,
            campaignToken_CS: campaignData.campaignToken_CS,
            campaignToken_TN: campaignData.campaignToken_TN,
            campaignToken_PriceADA: BigInt(campaignData.campaignToken_PriceADA || 0),
            requestedMaxADA: BigInt(campaignData.requestedMaxADA || 0),
            requestedMinADA: BigInt(campaignData.requestedMinADA || 0),

            // Datum
            cdCampaignVersion: isDeployed ? CAMPAIGN_VERSION : 0,
            cdCampaignPolicy_CS: isDeployed ? campaignData.campaignPolicy_CS || 'test CS' : '',
            cdCampaignFundsPolicyID_CS: isDeployed ? campaignData.campaignFundsPolicyID_CS || 'test CS' : '',
            cdAdmins: isDeployed ? await this.getCampaignAdmins(campaignData, wallets) : [],
            cdTokenAdminPolicy_CS: isDeployed ? campaignData.tokenAdminPolicy_CS || 'test CS' : '',
            cdMint_CampaignToken: isDeployed ? campaignData.mint_CampaignToken : false,
            cdCampaignToken_CS: isDeployed ? campaignData.campaignToken_CS || 'test CS' : '',
            cdCampaignToken_TN: isDeployed ? campaignData.campaignToken_TN || 'test TN' : '',
            cdCampaignToken_PriceADA: isDeployed ? BigInt(campaignData.campaignToken_PriceADA || 0) : BigInt(0),
            cdRequestedMaxADA: isDeployed ? BigInt(campaignData.requestedMaxADA || 0) : BigInt(0),
            cdRequestedMinADA: isDeployed ? BigInt(campaignData.requestedMinADA || 0) : BigInt(0),
            cdFundedADA: isDeployed ? BigInt(campaignData.fundedADA || 0) : BigInt(0),
            cdCollectedADA: isDeployed ? BigInt(campaignData.collectedADA || 0) : BigInt(0),
            cdStatus: isDeployed ? getCampaignDatumStatus(campaignData.campaign_status_id_as_string) : 0,
            cdMilestones: isDeployed ? getDatumsMilestone(campaignData.milestones) : [],
            cdFundsCount: isDeployed ? BigInt(campaignData.fundsCount || 0) : BigInt(0),
            cdFundsIndex: isDeployed ? BigInt(campaignData.fundsIndex || 0) : BigInt(0),
            cdMinADA: isDeployed ? BigInt(campaignData.cdMinADA || 0) : BigInt(0),

            // Campaign details
            logo_url: campaignData.logo_url,
            banner_url: campaignData.banner_url,

            website: campaignData.website,
            instagram: campaignData.instagram,
            twitter: campaignData.twitter,
            discord: campaignData.discord,
            facebook: campaignData.facebook,

            visualizations: campaignData.visualizations,
            investors: campaignData.investors,
            tokenomics_max_supply: BigInt(campaignData.tokenomics_max_supply || 0),
            tokenomics_for_campaign: BigInt(campaignData.tokenomics_max_supply || 0),
            tokenomics_description: campaignData.tokenomics_description,
            featured: campaignData.featured,
            archived: campaignData.archived,
        });

        return await CampaignBackEndApplied.create(campaign);
    }

    private static async createCampaignContents(campaignId: string, contents: any[]): Promise<void> {
        const CampaignContentBackEndApplied = (await import('./CampaignContent.BackEnd.Api.Handlers')).CampaignContentBackEndApplied;

        for (const contentData of contents) {
            const content = new CampaignContentEntity({
                campaign_id: campaignId,
                name: contentData.name,
                description: contentData.description,
                order: contentData.order,
            });

            await CampaignContentBackEndApplied.create(content);
        }
    }

    private static async createCampaignFaqs(campaignId: string, faqs: any[]): Promise<void> {
        const CampaignFaqsBackEndApplied = (await import('./CampaignFaqs.BackEnd.Api.Handlers')).CampaignFaqsBackEndApplied;

        for (const faqData of faqs) {
            const faq = new CampaignFaqsEntity({
                campaign_id: campaignId,
                question: faqData.question,
                answer: faqData.answer,
                order: faqData.order,
            });

            await CampaignFaqsBackEndApplied.create(faq);
        }
    }

    private static async createCampaignMembers(campaignId: string, members: any[], wallets: Record<string, WalletEntity>): Promise<void> {
        const CampaignMemberBackEndApplied = (await import('./CampaignMember.BackEnd.Api.Handlers')).CampaignMemberBackEndApplied;
        let order = 0;
        for (const memberData of members) {
            const member = new CampaignMemberEntity({
                campaign_id: campaignId,
                wallet_id: wallets[memberData.wallet_id_as_string]._DB_id,
                role: memberData.role,
                description: memberData.description,
                editor: memberData.editor || false,
                admin: memberData.admin || false,
                name: memberData.name || wallets[memberData.wallet_id_as_string].name || memberData.wallet_id_as_string || '',
                last_name: memberData.last_name || '',
                email: memberData.email || wallets[memberData.wallet_id_as_string].email || '',
                wallet_address: memberData.wallet_address || wallets[memberData.wallet_id_as_string].mainnet_address || '',
                website: memberData.socials?.website,
                instagram: memberData.socials?.instagram,
                twitter: memberData.socials?.twitter,
                discord: memberData.socials?.discord,
                linkedin: memberData.socials?.linkedin,
                facebook: memberData.socials?.facebook,
                order: order++,
            });

            await CampaignMemberBackEndApplied.create(member);
        }
    }

    private static async createCampaignSubmissions(campaignId: string, submissionsData: any[], wallets: Record<string, WalletEntity>): Promise<void> {
        const CampaignSubmissionBackEndApplied = (await import('./CampaignSubmission.BackEnd.Api.Handlers')).CampaignSubmissionBackEndApplied;

        for (const submissionData of submissionsData) {
            const submission = new CampaignSubmissionEntity({
                campaign_id: campaignId,
                submission_status_id: await this.getSubmission_Status_DB_id(submissionData.submission_status_id_as_string),
                submitted_by_wallet_id: wallets[submissionData.submitted_by_wallet_id_as_string]._DB_id,
                revised_by_wallet_id: submissionData.revised_by_wallet_id_as_string ? wallets[submissionData.revised_by_wallet_id_as_string]._DB_id : undefined,
                approved_justification: submissionData.approved_justification,
                rejected_justification: submissionData.rejected_justification,
            });

            await CampaignSubmissionBackEndApplied.create(submission);
        }
    }

    private static async createCampaignMilestones(campaignId: string, milestonesData: any[], campaignWallets: Record<string, WalletEntity>) {
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;
        const CampaignStatusBackEndApplied = (await import('./CampaignStatus.BackEnd.Api.Handlers')).CampaignStatusBackEndApplied;
        const MilestoneBackEndApplied = (await import('./Milestone.BackEnd.Api.Handlers')).MilestoneBackEndApplied;
        const MilestoneSubmissionBackEndApplied = (await import('./MilestoneSubmission.BackEnd.Api.Handlers')).MilestoneSubmissionBackEndApplied;

        // Check if campaign is active
        const campaign = await CampaignBackEndApplied.getById_<CampaignEntity>(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        // Get campaign status string from ID
        const statusEntity = await CampaignStatusBackEndApplied.getById_<CampaignStatusEntity>(campaign.campaign_status_id);
        if (!statusEntity) {
            throw new Error('Campaign status not found');
        }

        const getCampaignActiveStatus = (code_id: number): boolean => {
            return [CampaignStatus_Code_Id_Enums.ACTIVE, CampaignStatus_Code_Id_Enums.SUCCESS, CampaignStatus_Code_Id_Enums.FAILED].includes(code_id);
        };

        const isActive = getCampaignActiveStatus(statusEntity.code_id);

        const currentDate = new Date();

        let milestoneIndex = 0;
        for (const milestoneData of milestonesData) {
            milestoneIndex++;
            // Calculate milestone date if campaign is active
            let estimateDeliveryDate;
            if (isActive) {
                estimateDeliveryDate = new Date(currentDate.getTime() + milestoneData.estimatedDeliveryDays * 24 * 60 * 60 * 1000);
            }

            // Create milestone
            const milestone = new MilestoneEntity({
                campaign_id: campaignId,
                milestone_status_id: await this.getMilestone_Status_DB_id(milestoneData.milestone_status_id_as_string),
                estimate_delivery_days: milestoneData.estimatedDeliveryDays,
                estimate_delivery_date: estimateDeliveryDate,
                percentage: milestoneData.perncentage,
                description: milestoneData.description,
                order: milestoneIndex,
            });

            const createdMilestone = await MilestoneBackEndApplied.create(milestone);

            // Create milestone submissions if any
            if (milestoneData.submissions && milestoneData.submissions.length > 0) {
                for (const submissionData of milestoneData.submissions) {
                    const submission = new MilestoneSubmissionEntity({
                        milestone_id: createdMilestone._DB_id,
                        submission_status_id: await this.getSubmission_Status_DB_id(submissionData.submission_status_id_as_string),
                        submitted_by_wallet_id: campaignWallets[submissionData.submitted_by_wallet_id_as_string]._DB_id,
                        report_proof_of_finalization: submissionData.ReportProofOfFinalization,
                        revised_by_wallet_id: submissionData.revised_by_wallet_id_as_string ? campaignWallets[submissionData.revised_by_wallet_id_as_string]._DB_id : undefined,
                        approved_justification: submissionData.approved_justification,
                        rejected_justification: submissionData.rejected_justification,
                    });

                    await MilestoneSubmissionBackEndApplied.create(submission);
                }
            }
        }
    }

    // #endregion populate

    private static sortDatum(datum: ProtocolDatum) {
        datum.pdAdmins = datum.pdAdmins.sort((a: PaymentKeyHash, b: PaymentKeyHash) => {
            if (a < b) return -1;
            return 1;
        });
    }

    public static mkNew_ProtocolDatum(protocol: ProtocolEntity, txParams: ProtocolDeployTxParams, mindAda: bigint): ProtocolDatum {
        // usado para que los campos del datum tengan las clases y tipos bien
        // txParams trae los campos pero estan plain, no son clases ni tipos

        const datumPlainObject: ProtocolDatum = {
            pdProtocolVersion: PROTOCOL_VERSION,
            pdAdmins: txParams.pdAdmins,
            pdTokenAdminPolicy_CS: txParams.pdTokenAdminPolicy_CS,
            pdMinADA: mindAda,
        };

        let datum: ProtocolDatum = ProtocolEntity.mkDatumFromPlainObject(datumPlainObject) as ProtocolDatum;

        this.sortDatum(datum);

        return datum;
    }

    public static mkUpdated_ProtocolDatum_With_NormalChanges(protocolDatum_In: ProtocolDatum, txParams: ProtocolUpdateTxParams): ProtocolDatum {
        const datumPlainObject: ProtocolDatum = {
            ...JSON.parse(toJson(protocolDatum_In)),
            pdAdmins: txParams.pdAdmins,
            pdTokenAdminPolicy_CS: txParams.pdTokenAdminPolicy_CS,
        };
        let datum: any = ProtocolEntity.mkDatumFromPlainObject(datumPlainObject) as ProtocolDatum;
        this.sortDatum(datum);
        return datum;
    }

    // #endregion class methods
}

@BackEndApiHandlersFor(ProtocolEntity)
export class ProtocolApiHandlers extends BaseSmartDBBackEndApiHandlers {
    protected static _Entity = ProtocolEntity;
    protected static _BackEndApplied = ProtocolBackEndApplied;

    // #region restrict api handlers

    public static async restricFilter(user: User | undefined) {
        //----------------------------
        console_log(1, this._Entity.className(), `restricFilter - Init`);
        //----------------------------
        // let restricFilter: any = await super.restricFilter(user);
        // //-------------------
        // if (user === undefined || user.iswallet_validated_with_signed_token === false) {
        //     restricFilter = { showInSite: true };
        // } else {
        //     if (user.isCoreTeam === false) {
        //         restricFilter.$or.push({ fdAdmins: { $in: [user.pkh] } });
        //         //const ProtocolBackEnd_ = (await import('./protocolBackEnd')).ProtocolBackEnd;
        //         const isProtocolAdmin = await ProtocolBackEndApplied.isAdmin(user.pkh);
        //         if (isProtocolAdmin === true) {
        //             const protocols = await ProtocolBackEndApplied.getByAdmin(user.pkh, { fieldsForSelect: { _id: true }, loadRelations: {} });
        //             const protocol_ids = protocols.map((protocol) => protocol._DB_id);
        //             restricFilter.$or.push({ protocol_id: { $in: protocol_ids } });
        //         }
        //     } else {
        //         restricFilter = {};
        //     }
        // }
        let restricFilter = {};
        //----------------------------
        console_log(-1, this._Entity.className(), `restricFilter - OK`);
        //----------------------------
        return restricFilter;
        //-------------------
    }

    public static async restricCreate(user: User | undefined) {
        //-------------------
        // if (user === undefined) {
        //     throw `Can't create ${this._Entity.className()} if not logged`;
        // }
        // //-------------------
        // if (user.iswallet_validated_with_signed_token === false) {
        //     throw `Can't create ${this._Entity.className()} if not logged in Admin Mode`;
        // }
        // //-------------------
        // if (!(user.isCoreTeam || user.isMAYZHolder)) {
        //     throw `Can't create ${this._Entity.className()} if not core team or MAYZ Holder`;
        // }
        //-------------------
    }

    public static async restricUpdate<T extends BaseEntity>(instance: T, user: User | undefined) {
        //-------------------
        // if (user === undefined) {
        //     throw `Can't update ${this._Entity.className()} if not logged`;
        // }
        // //-------------------
        // if (user.iswallet_validated_with_signed_token === false) {
        //     throw `Can't update ${this._Entity.className()} if not logged in Admin Mode`;
        // }
        // //-------------------
        // const fundInstance = instance as unknown as FundEntity;
        // //-------------------
        // if (!(user.isCoreTeam || fundInstance.isAdmin(user.pkh) || fundInstance.isCreator(user.pkh))) {
        //     throw `Can't update ${this._Entity.className()} if not core team, creator or admin`;
        // }
        //-------------------
    }

    public static async restricDelete<T extends BaseEntity>(instance: T, user: User | undefined) {
        //-------------------
        // if (user === undefined) {
        //     throw `Can't delete ${this._Entity.className()} if not logged`;
        // }
        // //-------------------
        // if (user.iswallet_validated_with_signed_token === false) {
        //     throw `Can't delete ${this._Entity.className()} if not logged in Admin Mode`;
        // }
        // //-------------------
        // const fundInstance = instance as unknown as FundEntity;
        // //-------------------
        // if (fundInstance._isDeployed === true) {
        //     throw `Can't delete deployed ${this._Entity.className()}`;
        // }
        // //-------------------
        // if (!(user.isCoreTeam || fundInstance.isAdmin(user.pkh) || fundInstance.isCreator(user.pkh))) {
        //     throw `Can't delete ${this._Entity.className()} if not core team, creator or admin`;
        // }
        //-------------------
    }

    // public static async validateCreateData(data: any) {
    //     //-------------------
    //     let validatedData = await super.validateCreateData(data);
    //     //-------------------
    //     let formSchema = yup.object().shape({
    //         fdpFundVersion: yup.number().required(),
    //         protocol_id: yup.string().required().label(`Protocol ID`),
    //     });
    //     //-------------------
    //     validatedData = await formSchema.validate(validatedData, { stripUnknown: false });
    //     //-------------------
    //     return validatedData;
    // }

    // #endregion restrict api handlers

    // #region custom api handlers

    protected static _ApiHandlers: string[] = ['tx', 'populate', 'createWithScripts'];

    protected static async executeApiHandlers(command: string, req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        const { query } = req.query;
        //--------------------
        if (this._ApiHandlers.includes(command) && query !== undefined) {
            if (query[0] === 'tx') {
                if (query.length === 2) {
                    if (query[1] === 'deploy-tx') {
                        return await this.protocolDeployTxApiHandler(req, res);
                    } else if (query[1] === 'update-tx') {
                        return await this.protocolUpdateTxApiHandler(req, res);
                    }
                }
                return res.status(405).json({ error: 'Wrong Api route' });
            } else if (query[0] === 'populate') {
                return await this.populateApiHandler(req, res);
            } else if (query[1] === 'createWithScripts') {
                return await this.createWithScriptsApiHandlers(req, res);
            } else {
                console_error(0, this._Entity.className(), `executeApiHandlers - Error: Api Handler function not found`);
                return res.status(500).json({ error: 'Api Handler function not found ' });
            }
        } else {
            console_error(0, this._Entity.className(), `executeApiHandlers - Error: Wrong Custom Api route`);
            return res.status(405).json({ error: 'Wrong Custom Api route ' });
        }
    }

    public static async populateApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        if (req.method === 'POST') {
            //-------------------------
            console_log(1, this._Entity.className(), `populateApiHandler - POST - Init`);
            console_log(0, this._Entity.className(), `query: ${showData(req.query)}`);
            console_log(0, this._Entity.className(), `body: ${showData(req.body)}`);
            //-------------------------
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams }: { walletTxParams: WalletTxParams } = sanitizedBody;
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                await this._BackEndApplied.populate(lucid, walletTxParams);
                //-------------------------
                console_log(-1, this._Entity.className(), `populateApiHandler - POST - OK`);
                //-------------------------
                return res.status(200).json({ result: true });
            } catch (error) {
                console_error(-1, this._Entity.className(), `populateApiHandler - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while fetching the ${this._Entity.className()}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `populateApiHandler - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async createWithScriptsApiHandlers(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `createWithScriptsApiHandlers - POST - Init`);
            console_log(0, this._Entity.className(), `query: ${showData(req.query)}`);
            console_log(0, this._Entity.className(), `body: ${showData(req.body)}`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, params }: { walletTxParams: WalletTxParams; params: ProtocolCreateParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `createWithScriptsApiHandlers - params: ${showData(params)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                const protocol = await this._BackEndApplied.createWithScripts(lucid, params);
                //--------------------------------------
                console_log(-1, this._Entity.className(), `createWithScriptsApiHandlers - POST - OK`);
                //--------------------------------------
                return res.status(200).json({ id: protocol._DB_id });
                //--------------------------------------
            } catch (error) {
                console_error(-1, this._Entity.className(), `createWithScriptsApiHandlers - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.apiRoute()} createWithScriptsApiHandlers: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `createWithScriptsApiHandlers - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    // #region transactions

    public static async protocolDeployTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        //--------------------
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Deploy Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: ProtocolDeployTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Deploy Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const protocol = await this._BackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, { fieldsForSelect: {} });
                if (protocol === undefined) {
                    throw `Invalid protocol id`;
                }
                //--------------------------------------
                const protocolPolicyID_Script = protocol.fdpProtocolPolicyID_Script;
                //--------------------------------------
                const protocolPolicyID_AC_Lucid = protocol.getNet_id_AC_Lucid();
                //--------------------------------------
                const protocolValidator_Address: Address = protocol.getNet_Address();
                //--------------------------------------
                const protocolID_TxOutRef = new TxOutRef(
                    (protocol.fdpProtocolPolicyID_Params as any).protocol_TxHash,
                    Number((protocol.fdpProtocolPolicyID_Params as any).protocol_TxOutputIndex)
                );
                //--------------------------------------
                const uTxOsAtWallet = walletTxParams.utxos; // await lucid.utxosAt(params.address);
                const protocolID_UTxO = find_TxOutRef_In_UTxOs(protocolID_TxOutRef, uTxOsAtWallet);
                if (protocolID_UTxO === undefined) {
                    throw "Can't find UTxO (" + toJson(protocolID_TxOutRef) + ') for Mint ProtocolID';
                }
                //--------------------------------------
                const valueFor_Mint_ProtocolID: Assets = { [protocolPolicyID_AC_Lucid]: 1n };
                console_log(0, this._Entity.className(), `Deploy Tx - valueFor_Mint_ProtocolID: ${showData(valueFor_Mint_ProtocolID)}`);
                //--------------------------------------
                const protocolDatum_Out_ForCalcMinADA = this._BackEndApplied.mkNew_ProtocolDatum(protocol, txParams, 0n);
                const protocolDatum_Out_Hex_ForCalcMinADA = ProtocolEntity.datumToCborHex(protocolDatum_Out_ForCalcMinADA);
                //--------------------------------------
                let valueFor_ProtocolDatum_Out: Assets = valueFor_Mint_ProtocolID;
                const minADA_For_ProtocolDatum = calculateMinAdaOfUTxO({ datum: protocolDatum_Out_Hex_ForCalcMinADA, assets: valueFor_ProtocolDatum_Out });
                const value_MinAda_For_ProtocolDatum: Assets = { lovelace: minADA_For_ProtocolDatum };
                valueFor_ProtocolDatum_Out = addAssetsList([value_MinAda_For_ProtocolDatum, valueFor_ProtocolDatum_Out]);
                console_log(0, this._Entity.className(), `Deploy Tx - valueFor_ProtocolDatum_Out: ${showData(valueFor_ProtocolDatum_Out, false)}`);
                //--------------------------------------
                const protocolDatum_Out = this._BackEndApplied.mkNew_ProtocolDatum(protocol, txParams, minADA_For_ProtocolDatum);
                console_log(0, this._Entity.className(), `Deploy Tx - protocolDatum_Out: ${showData(protocolDatum_Out, false)}`);
                const protocolDatum_Out_Hex = ProtocolEntity.datumToCborHex(protocolDatum_Out);
                console_log(0, this._Entity.className(), `Deploy Tx - protocolDatum_Out_Hex: ${showData(protocolDatum_Out_Hex, false)}`);
                //--------------------------------------
                const protocolPolicyRedeemerMintID = new ProtocolPolicyRedeemerMintID(); // new Array()
                console_log(0, this._Entity.className(), `Deploy Tx - protocolPolicyRedeemerMintID: ${showData(protocolPolicyRedeemerMintID, false)}`);
                const protocolPolicyRedeemerMintID_Hex = objToCborHex(protocolPolicyRedeemerMintID);
                console_log(0, this._Entity.className(), `Deploy Tx - protocolPolicyRedeemerMintID_Hex: ${showData(protocolPolicyRedeemerMintID_Hex, false)}`);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                //--------------------------------------
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Deploy Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)} `
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                //--------------------------------------
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.PROTOCOL_DEPLOY,
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
                        .collectFrom([protocolID_UTxO])
                        .attach.MintingPolicy(protocolPolicyID_Script)
                        .mintAssets(valueFor_Mint_ProtocolID, protocolPolicyRedeemerMintID_Hex)
                        .pay.ToAddressWithData(protocolValidator_Address, { kind: 'inline', value: protocolDatum_Out_Hex }, valueFor_ProtocolDatum_Out)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    //--------------------------------------
                    const txCborHex = txComplete.toCBOR();
                    //--------------------------------------
                    const txHash = txComplete.toHash();
                    //--------------------------------------
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Deploy Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionProtocolPolicyRedeemerMintID: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'mint',
                        redeemerObj: protocolPolicyRedeemerMintID,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionProtocolDatum_Out: TransactionDatum = {
                        address: protocolValidator_Address,
                        datumType: ProtocolEntity.className(),
                        datumObj: protocolDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { protocol_id: protocol._DB_id },
                        redeemers: { protocolPolicyRedeemerMintID: transactionProtocolPolicyRedeemerMintID },
                        datums: { protocolDatum_Out: transactionProtocolDatum_Out },
                        reading_UTxOs: [],
                        consuming_UTxOs: [protocolID_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Deploy Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Deploy Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Deploy Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Deploy Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    public static async protocolUpdateTxApiHandler(req: NextApiRequestAuthenticated, res: NextApiResponse) {
        if (req.method === 'POST') {
            console_log(1, this._Entity.className(), `Update Tx - POST - Init`);
            try {
                //-------------------------
                const sanitizedBody = sanitizeForDatabase(req.body);
                //-------------------------
                const { walletTxParams, txParams }: { walletTxParams: WalletTxParams; txParams: ProtocolUpdateTxParams } = sanitizedBody;
                //--------------------------------------
                console_log(0, this._Entity.className(), `Update Tx - txParams: ${showData(txParams)}`);
                //--------------------------------------
                const { lucid } = await LucidToolsBackEnd.prepareLucidBackEndForTx(walletTxParams);
                //--------------------------------------
                walletTxParams.utxos = fixUTxOList(walletTxParams?.utxos ?? []);
                //--------------------------------------
                const protocol = await this._BackEndApplied.getById_<ProtocolEntity>(txParams.protocol_id, {
                    ...optionsGetMinimalWithSmartUTxOCompleteFields,
                    fieldsForSelect: {},
                });
                if (protocol === undefined) throw `Invalid protocol id`;
                //--------------------------------------
                const protocol_SmartUTxO = protocol.smartUTxO;
                if (!protocol_SmartUTxO) throw `Can't find Protocol UTxO`;
                const protocol_UTxO = protocol_SmartUTxO.getUTxO();
                const valueFor_ProtocolDatum_Out = protocol_SmartUTxO.assets;
                //--------------------------------------
                const protocolValidator_Address: Address = protocol.getNet_Address();
                const protocolValidator_Script = protocol.fdpProtocolValidator_Script;
                //--------------------------------------
                const protocolDatum_In = protocol.getMyDatum() as ProtocolDatum;
                console_log(0, this._Entity.className(), `Update Tx - protocolDatum_In: ${showData(protocolDatum_In, false)}`);
                const protocolDatum_In_Hex = ProtocolEntity.datumToCborHex(protocolDatum_In);
                //--------------------------------------
                const protocolDatum_Out = this._BackEndApplied.mkUpdated_ProtocolDatum_With_NormalChanges(protocolDatum_In, txParams);
                console_log(0, this._Entity.className(), `Update Tx - protocolDatum_Out: ${showData(protocolDatum_Out, false)}`);
                const protocolDatum_Out_Hex = ProtocolEntity.datumToCborHex(protocolDatum_Out);
                //--------------------------------------
                const protocolValidatorRedeemerDatumUpdate = new ProtocolValidatorRedeemerDatumUpdate();
                const protocolValidatorRedeemerDatumUpdate_Hex = objToCborHex(protocolValidatorRedeemerDatumUpdate);
                //--------------------------------------
                const { from, until } = await TimeBackEnd.getTxTimeRange(lucid);
                const flomSlot = lucid.unixTimeToSlot(from);
                const untilSlot = lucid.unixTimeToSlot(until);
                //--------------------------------------
                console_log(
                    0,
                    this._Entity.className(),
                    `Update Tx - currentSlot: ${lucid.currentSlot()} - fromSlot ${flomSlot} to ${untilSlot} - from UnixTime ${from} to ${until} - from Date ${convertMillisToTime(
                        from
                    )} to ${convertMillisToTime(until)}`
                );
                //--------------------------------------
                let transaction: TransactionEntity | undefined = undefined;
                try {
                    const transaction_ = new TransactionEntity({
                        paymentPKH: walletTxParams.pkh,
                        date: new Date(from),
                        type: TxEnums.PROTOCOL_UPDATE,
                        status: TRANSACTION_STATUS_CREATED,
                        reading_UTxOs: [],
                        consuming_UTxOs: [],
                        valid_from: from,
                        valid_until: until,
                    });
                    transaction = await TransactionBackEndApplied.create(transaction_);
                    //--------------------------------------
                    let tx: TxBuilder = lucid.newTx();
                    tx = tx
                        .collectFrom([protocol_UTxO], protocolValidatorRedeemerDatumUpdate_Hex)
                        .pay.ToAddressWithData(protocolValidator_Address, { kind: 'inline', value: protocolDatum_Out_Hex }, valueFor_ProtocolDatum_Out)
                        .attach.SpendingValidator(protocolValidator_Script)
                        .addSigner(walletTxParams.address)
                        .validFrom(from)
                        .validTo(until);
                    //--------------------------------------
                    const txComplete = await tx.complete();
                    const txCborHex = txComplete.toCBOR();
                    const txHash = txComplete.toHash();
                    const resources = getTxRedeemersDetailsAndResources(txComplete);
                    //--------------------------------------
                    console_log(0, this._Entity.className(), `Update Tx - Tx Resources: ${showData({ redeemers: resources.redeemersLogs, tx: resources.tx })}`);
                    //--------------------------------------
                    const transactionProtocolValidatorRedeemerDatumUpdate: TransactionRedeemer = {
                        tx_index: 0,
                        purpose: 'spend',
                        redeemerObj: protocolValidatorRedeemerDatumUpdate,
                        unit_mem: resources.redeemers[0]?.MEM,
                        unit_steps: resources.redeemers[0]?.CPU,
                    };
                    const transactionProtocolDatum_In: TransactionDatum = {
                        address: protocolValidator_Address,
                        datumType: ProtocolEntity.className(),
                        datumObj: protocolDatum_In,
                    };
                    const transactionProtocolDatum_Out: TransactionDatum = {
                        address: protocolValidator_Address,
                        datumType: ProtocolEntity.className(),
                        datumObj: protocolDatum_Out,
                    };
                    //--------------------------------------
                    await TransactionBackEndApplied.setPendingTransaction(transaction, {
                        hash: txHash,
                        ids: { protocol_id: protocol._DB_id },
                        redeemers: { protocolValidatorRedeemerDatumUpdate: transactionProtocolValidatorRedeemerDatumUpdate },
                        datums: { protocolDatum_In: transactionProtocolDatum_In, protocolDatum_Out: transactionProtocolDatum_Out },
                        reading_UTxOs: [],
                        consuming_UTxOs: [protocol_UTxO],
                        unit_mem: resources.tx[0]?.MEM,
                        unit_steps: resources.tx[0]?.CPU,
                        fee: resources.tx[0]?.FEE,
                        size: resources.tx[0]?.SIZE,
                        CBORHex: txCborHex,
                    });
                    //--------------------------------------
                    console_log(-1, this._Entity.className(), `Update Tx - txCborHex: ${showData(txCborHex)}`);
                    return res.status(200).json({ txHash, txCborHex });
                } catch (error) {
                    if (transaction !== undefined) {
                        await TransactionBackEndApplied.setFailedTransaction(transaction, { error, walletInfo: walletTxParams, txInfo: txParams });
                    }
                    throw error;
                }
            } catch (error) {
                console_error(-1, this._Entity.className(), `Update Tx - Error: ${error}`);
                return res.status(500).json({ error: `An error occurred while creating the ${this._Entity.className()} Update Tx: ${error}` });
            }
        } else {
            console_error(-1, this._Entity.className(), `Update Tx - Error: Method not allowed`);
            return res.status(405).json({ error: `Method not allowed` });
        }
    }

    // #endregion transactions

    // #endregion custom api handlers
}
