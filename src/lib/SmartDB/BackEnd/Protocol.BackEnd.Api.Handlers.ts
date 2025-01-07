import {
    CampaignCategoryDefault,
    CampaignCategoryDefaultNames,
    CampaignStatusDefaultNames,
    MilestoneStatusDefaultNames,
    protocolDefault,
    SubmissionStatusDefaultNames,
} from '@/utils/constants/populate';
import { CampaignDatumStatus, CampaignStatus, MilestoneDatumStatus, MilestoneStatus, SubmissionStatus } from '@/utils/constants/status';
import { applyParamsToScript, Data, Lucid, MintingPolicy, UTxO, Validator } from 'lucid-cardano';
import { NextApiResponse } from 'next';
import { User } from 'next-auth';
import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseEntity,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    console_error,
    console_log,
    getScriptFromJson,
    LucidLUCID_NETWORK_MAINNET_NAME,
    LucidToolsBackEnd,
    NextApiRequestAuthenticated,
    sanitizeForDatabase,
    showData,
    toJson,
    WALLET_CREATEDBY_LOGIN,
    WalletBackEndApplied,
    WalletEntity,
    WalletTxParams,
} from 'smart-db/backEnd';
import { ProtocolCreateParams } from '../Commons/Params';
import {
    CampaignCategoryEntity,
    CampaignContentEntity,
    CampaignEntity,
    CampaignFaqsEntity,
    CampaignMemberEntity,
    CampaignMilestone,
    CampaignStatusEntity,
    CampaignSubmissionEntity,
    MilestoneEntity,
    MilestoneStatusEntity,
    MilestoneSubmissionEntity,
    ProtocolAdminWalletEntity,
    ScriptEntity,
    SubmissionStatusEntity,
} from '../Entities';
import { CampaignFactory, ProtocolEntity } from '../Entities/Protocol.Entity';
import { CAMPAIGN_VERSION, EMERGENCY_ADMIN_TOKEN_POLICY_CS } from '@/utils/constants/contracts';

@BackEndAppliedFor(ProtocolEntity)
export class ProtocolBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = ProtocolEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    // #region class methods

    public static async createWithScripts(lucid: Lucid, params: ProtocolCreateParams): Promise<ProtocolEntity> {
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
        const fdpProtocolPolicyID_CS = lucid.utils.mintingPolicyToId(fdpProtocolPolicyID_Script);
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
        const fdpProtocolValidator_Hash = lucid.utils.validatorToScriptHash(fdpProtocolValidator_Script);
        console.log(`fdpProtocolValidator_Hash ${fdpProtocolValidator_Hash}`);
        //--------------------------------------
        lucid.network = 'Preview';
        const fdpProtocolValidator_AddressTestnet = lucid.utils.validatorToAddress(fdpProtocolValidator_Script);
        console.log(`fdpProtocolValidator_AddressTestnet ${fdpProtocolValidator_AddressTestnet}`);
        lucid.network = 'Mainnet';
        const fdpProtocolValidator_AddressMainnet = lucid.utils.validatorToAddress(fdpProtocolValidator_Script);
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
        const fdpScriptPolicyID_CS = lucid.utils.mintingPolicyToId(fdpScriptPolicyID_Script);
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
        const fdpScriptValidator_Hash = lucid.utils.validatorToScriptHash(fdpScriptValidator_Script);
        console.log(`fdpScriptValidator_Hash ${fdpScriptValidator_Hash}`);
        //--------------------------------------
        lucid.network = 'Preview';
        const fdpScriptValidator_AddressTestnet = lucid.utils.validatorToAddress(fdpScriptValidator_Script);
        console.log(`fdpScriptValidator_AddressTestnet ${fdpScriptValidator_AddressTestnet}`);
        lucid.network = 'Mainnet';
        const fdpScriptValidator_AddressMainnet = lucid.utils.validatorToAddress(fdpScriptValidator_Script);
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
        const protocol_ = await this.create(protocol);
        //--------------------------------------
        await this._BackEndMethods.createHook<ProtocolEntity>(ProtocolEntity, protocol.getNet_Address(), protocol.fdpProtocolPolicyID_CS);
        await this._BackEndMethods.createHook<ScriptEntity>(ScriptEntity, protocol.getNet_Script_Validator_Address(), protocol.fdpScriptPolicyID_CS);
        //--------------------------------------
        return protocol_;
    }

    public static async populate(lucid: Lucid, walletTxParams: WalletTxParams): Promise<boolean> {
        //--------------------------------------
        console_log(0, this._Entity.className(), `populate - Init`);
        //--------------------------------------
        await this.populateAll(lucid, walletTxParams);
        //--------------------------------------

        // const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;
        // const CampaignContentBackEndApplied = (await import('./CampaignContent.BackEnd.Api.Handlers')).CampaignContentBackEndApplied;
        // const CampaignFaqsBackEndApplied = (await import('./CampaignFaqs.BackEnd.Api.Handlers')).CampaignFaqsBackEndApplied;
        // const CampaignFundsBackEndApplied = (await import('./CampaignFunds.BackEnd.Api.Handlers')).CampaignFundsBackEndApplied;
        // const CampaignMemberBackEndApplied = (await import('./CampaignMember.BackEnd.Api.Handlers')).CampaignMemberBackEndApplied;
        // const CampaignSubmissionBackEndApplied = (await import('./CampaignSubmission.BackEnd.Api.Handlers')).CampaignSubmissionBackEndApplied;
        // const CustomWalletBackEndApplied = (await import('./CustomWallet.BackEnd.Api.Handlers')).CustomWalletBackEndApplied;
        // const MilestoneBackEndApplied = (await import('./Milestone.BackEnd.Api.Handlers')).MilestoneBackEndApplied;
        // const MilestoneSubmissionBackEndApplied = (await import('./MilestoneSubmission.BackEnd.Api.Handlers')).MilestoneSubmissionBackEndApplied;

        //--------------------------------------
        console_log(0, this._Entity.className(), `populate - End`);
        //--------------------------------------
        return true;
        //--------------------------------------
    }

    public static async populateAll(lucid: Lucid, walletTxParams: WalletTxParams) {
        const wallet = await this.populateUser(walletTxParams);
        const protocol = await this.populateProtocol(lucid, walletTxParams, wallet);
        await this.populateCampaignStatus();
        await this.populateCampaignCategory();
        await this.populateMilestoneStatus();
        await this.populateSubmissionStatus();
        await this.populateCampaigns(lucid, walletTxParams, protocol, wallet);
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
            if (process.env.NEXT_PUBLIC_CARDANO_NET === LucidLUCID_NETWORK_MAINNET_NAME) {
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
                isCoreTeam: false,
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

    private static async populateProtocol(lucid: Lucid, walletTxParams: WalletTxParams, wallet: WalletEntity): Promise<ProtocolEntity> {
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
            protocol = await this.createWithScripts(lucid, { name: protocolDefault.name, configJson: toJson(protocolDefault.configJson), uTxO });
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
        const campaignStatuses = Object.values(CampaignStatus).filter((value) => typeof value === 'number') as CampaignStatus[];
        //--------------------------------------
        for (const status of campaignStatuses) {
            console.log(`State: ${status}, Description: ${CampaignStatusDefaultNames[status]}`);
            let campaignStatus: CampaignStatusEntity = new CampaignStatusEntity();
            campaignStatus.id_internal = status;
            campaignStatus.name = CampaignStatusDefaultNames[status];
            if (!(await CampaignStatusBackEndApplied.checkIfExists_({ id_internal: campaignStatus.id_internal }))) {
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
        const milestoneStatuses = Object.values(MilestoneStatus).filter((value) => typeof value === 'number') as MilestoneStatus[];
        //--------------------------------------
        for (const status of milestoneStatuses) {
            console.log(`State: ${status}, Description: ${MilestoneStatusDefaultNames[status]}`);
            let milestoneStatus: MilestoneStatusEntity = new MilestoneStatusEntity();
            milestoneStatus.id_internal = status;
            milestoneStatus.name = MilestoneStatusDefaultNames[status];
            if (!(await MilestoneStatusBackEndApplied.checkIfExists_({ id_internal: milestoneStatus.id_internal }))) {
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
            campaignCategory.id_internal = category;
            campaignCategory.name = CampaignCategoryDefaultNames[category];
            if (!(await CampaignCategoryBackEndApplied.checkIfExists_({ id_internal: campaignCategory.id_internal }))) {
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
        const submissionStatuses = Object.values(SubmissionStatus).filter((value) => typeof value === 'number') as SubmissionStatus[];
        //--------------------------------------
        for (const status of submissionStatuses) {
            console.log(`State: ${status}, Description: ${SubmissionStatusDefaultNames[status]}`);
            let submissionStatus: SubmissionStatusEntity = new SubmissionStatusEntity();
            submissionStatus.id_internal = status;
            submissionStatus.name = SubmissionStatusDefaultNames[status];
            if (!(await SubmissionStatusBackEndApplied.checkIfExists_({ id_internal: submissionStatus.id_internal }))) {
                submissionStatus = await SubmissionStatusBackEndApplied.create(submissionStatus);
            }
        }
        //--------------------------------------
        console_log(0, this._Entity.className(), `populateSubmissionStatus - OK`);
        //--------------------------------------
        return true;
    }

    private static async populateCampaigns(lucid: Lucid, walletTxParams: WalletTxParams, protocol: ProtocolEntity, wallet: WalletEntity): Promise<boolean> {
        console_log(0, this._Entity.className(), `populateCampaigns - INIT`);
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;
        const campaignsData = protocolDefault.campaignsJson.campaigns;
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
                const categoryId = await this.getCampaignCategoryId(campaignData.campaing_category_id_as_string);
                const statusId = await this.getCampaignStatusId(campaignData.campaign_status_id_as_string);

                // Create campaign
                campaign = await this.createCampaign(campaignData, categoryId, statusId, campaignWallets);

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

    private static async getCampaignCategoryId(categoryName: string): Promise<string> {
        const CampaignCategoryBackEndApplied = (await import('./CampaignCategory.BackEnd.Api.Handlers')).CampaignCategoryBackEndApplied;

        // Get enum value from category name
        const categoryId = CampaignCategoryDefault[categoryName as keyof typeof CampaignCategoryDefault];
        if (categoryId === undefined) {
            throw new Error(`Invalid category name: ${categoryName}`);
        }

        // Query by internal_id
        const category = await CampaignCategoryBackEndApplied.getOneByParams_({ id_internal: categoryId });
        if (!category) {
            throw new Error(`Category not found for internal_id: ${categoryId}`);
        }

        return category._DB_id;
    }

    private static async getCampaignStatusId(statusName: string): Promise<string> {
        const CampaignStatusBackEndApplied = (await import('./CampaignStatus.BackEnd.Api.Handlers')).CampaignStatusBackEndApplied;

        // Get enum value from status name
        const statusId = CampaignStatus[statusName as keyof typeof CampaignStatus];
        if (statusId === undefined) {
            throw new Error(`Invalid status name: ${statusName}`);
        }

        // Query by internal_id
        const status = await CampaignStatusBackEndApplied.getOneByParams_({ id_internal: statusId });
        if (!status) {
            throw new Error(`Status not found for internal_id: ${statusId}`);
        }

        return status._DB_id;
    }

    private static async getMilestoneStatusId(statusName: string): Promise<string> {
        const MilestoneStatusBackEndApplied = (await import('./MilestoneStatus.BackEnd.Api.Handlers')).MilestoneStatusBackEndApplied;

        // Get enum value from status name
        const statusId = MilestoneStatus[statusName as keyof typeof MilestoneStatus];
        if (statusId === undefined) {
            throw new Error(`Invalid milestone status name: ${statusName}`);
        }

        // Query by internal_id
        const status = await MilestoneStatusBackEndApplied.getOneByParams_({ id_internal: statusId });
        if (!status) {
            throw new Error(`Milestone status not found for internal_id: ${statusId}`);
        }

        return status._DB_id;
    }

    private static async getSubmissionStatusId(statusName: string): Promise<string> {
        const SubmissionStatusBackEndApplied = (await import('./SubmissionStatus.BackEnd.Api.Handlers')).SubmissionStatusBackEndApplied;

        // Get enum value from status name
        const statusId = SubmissionStatus[statusName as keyof typeof SubmissionStatus];
        if (statusId === undefined) {
            throw new Error(`Invalid submission status name: ${statusName}`);
        }

        // Query by internal_id
        const status = await SubmissionStatusBackEndApplied.getOneByParams_({ id_internal: statusId });
        if (!status) {
            throw new Error(`Submission status not found for internal_id: ${statusId}`);
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

    private static async createCampaign(campaignData: any, categoryId: string, statusId: string, wallets: Record<string, WalletEntity>): Promise<CampaignEntity> {
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;

        const currentDate = new Date();

        const getCampaignDeployedStatus = (statusStr: string): boolean => {
            // First get the numeric status ID
            const statusId = CampaignStatus[statusStr as keyof typeof CampaignStatus];

            return [
                CampaignStatus.CONTRACT_STARTED,
                CampaignStatus.COUNTDOWN,
                CampaignStatus.FUNDRAISING,
                CampaignStatus.FINISHING,
                CampaignStatus.ACTIVE,
                CampaignStatus.SUCCESS,
                CampaignStatus.FAILED,
                CampaignStatus.UNREACHED,
            ].includes(statusId);
        };

        const getCampaignActiveStatus = (statusStr: string): boolean => {
            const statusId = CampaignStatus[statusStr as keyof typeof CampaignStatus];

            return [CampaignStatus.ACTIVE, CampaignStatus.SUCCESS, CampaignStatus.FAILED].includes(statusId);
        };

        const getCampaignDatumStatus = (statusStr: string): CampaignDatumStatus => {
            const statusId = CampaignStatus[statusStr as keyof typeof CampaignStatus];
            
            // Map Campaign Status to Datum Status
            switch (statusId) {
                case CampaignStatus.NOT_STARTED:
                case CampaignStatus.CREATED:
                case CampaignStatus.SUBMITTED:
                case CampaignStatus.REJECTED:
                case CampaignStatus.APPROVED:
                case CampaignStatus.CONTRACT_CREATED:
                case CampaignStatus.CONTRACT_PUBLISHED:
                case CampaignStatus.CONTRACT_STARTED:
                    return CampaignDatumStatus.CsCreated;
                case CampaignStatus.COUNTDOWN:
                case CampaignStatus.FUNDRAISING:
                case CampaignStatus.FINISHING:
                    return CampaignDatumStatus.CsInitialized;
                case CampaignStatus.ACTIVE:
                case CampaignStatus.SUCCESS:
                    return CampaignDatumStatus.CsReached;
                case CampaignStatus.UNREACHED:
                    return CampaignDatumStatus.CsNotReached;
                case CampaignStatus.FAILED:
                    return CampaignDatumStatus.CsFailedMilestone;
                default:
                    throw new Error(`Invalid campaign status: ${statusStr}`);
            }
        };
        
        const getMilestoneDatumStatus = (statusStr: string): MilestoneDatumStatus => {
            const statusId = MilestoneStatus[statusStr as keyof typeof MilestoneStatus];
            
            // Map Milestone Status to Datum Status
            switch (statusId) {
                case MilestoneStatus.NOT_STARTED:
                case MilestoneStatus.STARTED:
                case MilestoneStatus.SUBMITTED:
                case MilestoneStatus.REJECTED:
                    return MilestoneDatumStatus.MsCreated;
                case MilestoneStatus.FINISHED:
                    return MilestoneDatumStatus.MsSuccess;
                case MilestoneStatus.FAILED:
                    return MilestoneDatumStatus.MsFailed;
                default:
                    throw new Error(`Invalid milestone status: ${statusStr}`);
            }
        };

        const getDatumsMilestone = (milestones: any[]): CampaignMilestone[] => {
            return milestones.map((m) => ({
                cmPerncentage: m.perncentage,
                cmStatus: getMilestoneDatumStatus(m.milestone_status_id_as_string),
            }))
        }

        // In createCampaign:
        const isDeployed = getCampaignDeployedStatus(campaignData.campaign_status_id_as_string);
        const isActiveOrBeyond = getCampaignActiveStatus(campaignData.campaign_status_id_as_string);

        // Calculate dates for started campaigns
        let dateFields = {};
        if (isDeployed) {
            const beginAtDate = new Date(currentDate.getTime() + campaignData.begin_at_days * 24 * 60 * 60 * 1000);
            const deadlineDate = new Date(currentDate.getTime() + campaignData.deadline_days * 24 * 60 * 60 * 1000);

            dateFields = {
                cdbegin_at: BigInt(Math.floor(beginAtDate.getTime() / 1000)),
                cdDeadline: BigInt(Math.floor(deadlineDate.getTime() / 1000)),
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
            isDeployed,

            campaing_category_id: categoryId,
            campaign_status_id: statusId,
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
            cdStatus: isDeployed ? getCampaignDatumStatus(campaignData.campaign_status_id_as_string ): 0,
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
            tokenomics_max_supply: campaignData.tokenomics_max_supply,
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

        for (const memberData of members) {
            const member = new CampaignMemberEntity({
                campaign_id: campaignId,
                wallet_id: wallets[memberData.wallet_id_as_string]._DB_id,
                role: memberData.role,
                description: memberData.description,
                editor: memberData.editor || false,
                admin: memberData.admin || false,
                email: memberData.email || wallets[memberData.wallet_id_as_string].email || '',
                wallet_address: memberData.wallet_address || wallets[memberData.wallet_id_as_string].mainnet_address || '',
                website: memberData.socials?.website,
                instagram: memberData.socials?.instagram,
                twitter: memberData.socials?.twitter,
                discord: memberData.socials?.discord,
                facebook: memberData.socials?.facebook,
            });

            await CampaignMemberBackEndApplied.create(member);
        }
    }

    private static async createCampaignSubmissions(campaignId: string, submissionsData: any[], wallets: Record<string, WalletEntity>): Promise<void> {
        const CampaignSubmissionBackEndApplied = (await import('./CampaignSubmission.BackEnd.Api.Handlers')).CampaignSubmissionBackEndApplied;

        for (const submissionData of submissionsData) {
            const submission = new CampaignSubmissionEntity({
                campaign_id: campaignId,
                submission_status_id: await this.getSubmissionStatusId(submissionData.submission_status_id_as_string),
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

        const getCampaignActiveStatus = (statusId: number): boolean => {
            return [CampaignStatus.ACTIVE, CampaignStatus.SUCCESS, CampaignStatus.FAILED].includes(statusId);
        };

        const isActive = getCampaignActiveStatus(statusEntity.id_internal);

        const currentDate = new Date();

        for (const milestoneData of milestonesData) {
            // Calculate milestone date if campaign is active
            let estimateDeliveryDate;
            if (isActive) {
                estimateDeliveryDate = new Date(currentDate.getTime() + milestoneData.estimatedDeliveryDays * 24 * 60 * 60 * 1000);
            }

            // Create milestone
            const milestone = new MilestoneEntity({
                campaign_id: campaignId,
                milestone_status_id: await this.getMilestoneStatusId(milestoneData.milestone_status_id_as_string),
                estimate_delivery_days: milestoneData.estimatedDeliveryDays,
                estimate_delivery_date: estimateDeliveryDate,
                percentage: milestoneData.perncentage,
                description: milestoneData.description,
            });

            const createdMilestone = await MilestoneBackEndApplied.create(milestone);

            // Create milestone submissions if any
            if (milestoneData.submissions && milestoneData.submissions.length > 0) {
                for (const submissionData of milestoneData.submissions) {
                    const submission = new MilestoneSubmissionEntity({
                        milestone_id: createdMilestone._DB_id,
                        submission_status_id: await this.getSubmissionStatusId(submissionData.submission_status_id_as_string),
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
                    // if (query[1] === 'create-tx') {
                    //     return await this.createTxApiHandler(req, res);
                    // } else if (query[1] === 'claim-tx') {
                    //     return await this.claimTxApiHandler(req, res);
                    // } else if (query[1] === 'update-tx') {
                    //     return await this.updateTxApiHandler(req, res);
                    // }
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

    // #endregion custom api handlers
}
