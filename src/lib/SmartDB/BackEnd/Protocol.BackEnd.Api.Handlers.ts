import { NextApiResponse } from 'next';
import { User } from 'next-auth';
import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseEntity,
    BaseSmartDBBackEndApiHandlers,
    BaseSmartDBBackEndApplied,
    BaseSmartDBBackEndMethods,
    NextApiRequestAuthenticated,
    console_error,
    console_log,
    showData,
} from 'smart-db/backEnd';
import { ProtocolEntity } from '../Entities/Protocol.Entity';
import { CampaignCategoryEntity, CampaignStatusEntity, MilestoneStatusEntity, SubmissionStatusEntity } from '../Entities';
import CampaignCategory from '@/components/Admin/CampaignCategory/CampaignCategory';

import database from '../../../HardCode/database.json';
import { MilestoneStatusBackEndApplied } from './MilestoneStatus.BackEnd.Api.Handlers';
import { sub } from 'date-fns';
import { SubmissionStatusApiHandlers } from './SubmissionStatus.BackEnd.Api.Handlers';
import { MilestoneSubmissionBackEndApplied } from './MilestoneSubmission.BackEnd.Api.Handlers';

@BackEndAppliedFor(ProtocolEntity)
export class ProtocolBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = ProtocolEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    private static claveValorCategories: Map<number, number> = new Map();
    private static claveValorStates: Map<number, number> = new Map();
    private static claveValorContracts: Map<number, number> = new Map();
    private static claveValorVizualization: Map<number, number> = new Map();
    private static claveValorMilestoneStatus: Map<number, number> = new Map();
    private static claveValorSubmissionStatus: Map<number, number> = new Map();

    // #region class methods

    public static async populate() {
        //--------------------------------------
        console_log(1, this._Entity.className(), `populate - Init`);
        console_log(0, this._Entity.className(), `populate - Working on...`);
        //--------------------------------------
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;
        const CampaignContentBackEndApplied = (await import('./CampaignContent.BackEnd.Api.Handlers')).CampaignContentBackEndApplied;
        const CampaignFaqsBackEndApplied = (await import('./CampaignFaqs.BackEnd.Api.Handlers')).CampaignFaqsBackEndApplied;
        const CampaignFundsBackEndApplied = (await import('./CampaignFunds.BackEnd.Api.Handlers')).CampaignFundsBackEndApplied;
        const CampaignMemberBackEndApplied = (await import('./CampaignMember.BackEnd.Api.Handlers')).CampaignMemberBackEndApplied;
        const CampaignSubmissionBackEndApplied = (await import('./CampaignSubmission.BackEnd.Api.Handlers')).CampaignSubmissionBackEndApplied;
        const CustomWalletBackEndApplied = (await import('./CustomWallet.BackEnd.Api.Handlers')).CustomWalletBackEndApplied;
        const MilestoneBackEndApplied = (await import('./Milestone.BackEnd.Api.Handlers')).MilestoneBackEndApplied;
        const MilestoneSubmissionBackEndApplied = (await import('./MilestoneSubmission.BackEnd.Api.Handlers')).MilestoneSubmissionBackEndApplied;
        const ProtocoBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
        const ProtocolAdminWalletBackEndApplied = (await import('./ProtocolAdminWallet.BackEnd.Api.Handlers')).ProtocolAdminWalletBackEndApplied;

        this.populateAll();


        let protocol: ProtocolEntity = new ProtocolEntity();
        //  para protocol, campaing, y campaign funds, quye son smart db tenes que setear estas:
        protocol._creator = 'test creator';
        protocol._NET_address = 'test address';
        protocol._NET_id_CS = 'test CS';
        protocol._isDeployed = false;
        // setea todo el resto de los campos
        protocol.pdMinADA = 1000n;
        protocol = await ProtocoBackEndApplied.create(protocol);
        console_log(-1, this._Entity.className(), `populate - End`);
        //--------------------------------------
        return true;
        //--------------------------------------
    }

    public static async populateAll() {
        await this.populateCategory();
        await this.populateState();
        //await this.populateContract();
        //await this.populateVizualization();
        await this.populateMilestoneStatus();
        await this.populateSubmissionStatus();
    }

    private static async populateCategory() {
        const CampaignCategoryBackEndApplied = (await import('./CampaignCategory.BackEnd.Api.Handlers')).CampaignCategoryBackEndApplied;

        for (const item of database.categories) {
            let category: CampaignCategoryEntity = new CampaignCategoryEntity();
            category.id_internal = item.id;
            category.name = item.name;

            if (! await CampaignCategoryBackEndApplied.checkIfExists_({ id_internal: category.id_internal })) {
              category = await CampaignCategoryBackEndApplied.create(category);
            }
        }

        console_log(-1, 'CampaignCategoryEntity', `populate - End`);
        return true;
    }

    private static async populateState() {
        const CampaignStatusBackEndApplied = (await import('./CampaignStatus.BackEnd.Api.Handlers')).CampaignStatusBackEndApplied;

        for (const item of database.states) {
            let state: CampaignStatusEntity = new CampaignStatusEntity();
            state.id_internal = item.id;
            state.name = item.name;

            if (! await CampaignStatusBackEndApplied.checkIfExists_({ id_internal: state.id_internal })) {
              state = await CampaignStatusBackEndApplied.create(state);
            }
        }

        console_log(-1, 'CampaignStateEntity', `populate - End`);
        return true;
    }

    //private static async populateContract() {
    //    const CampaignContractBackEndApplied = (await import('./CampaignContract.BackEnd.Api.Handlers')).CampaignContractBackEndApplied;
    //
    //    for (const item of database.contracts) {
    //        let contract: CampaignContractEntity = new CampaignContractEntity();
    //        contract.name = item.name;
    //
    //        contract = await CampaignContractBackEndApplied.create(contract);
    //
    //        this.claveValorContracts.set(item.id, contract.id);
    //    }
    //
    //    console_log(-1, 'CampaignContractEntity', `populate - End`);
    //    return true;
    //}
    //
    //private static async populateVizualization() {
    //    const CampaignVizualizationBackEndApplied = (await import('./CampaignVizualization.BackEnd.Api.Handlers')).CampaignVizualizationBackEndApplied;
    //
    //    for (const item of database.vizualization) {
    //        let vizualization: CampaignVizualizationEntity = new CampaignVizualizationEntity();
    //        vizualization.name = item.name;
    //
    //        vizualization = await CampaignVizualizationBackEndApplied.create(vizualization);
    //
    //        this.claveValorVizualization.set(item.id, vizualization.id);
    //    }
    //
    //    console_log(-1, 'CampaignVizualizationEntity', `populate - End`);
    //    return true;
    //}

    private static async populateMilestoneStatus() {
        const MilestoneStatusBackEndApplied = (await import('./MilestoneStatus.BackEnd.Api.Handlers')).MilestoneStatusBackEndApplied;

        for (const item of database.milestone_status) {
            let milestoneStatus: MilestoneStatusEntity = new MilestoneStatusEntity();
            milestoneStatus.id_internal = item.id;
            milestoneStatus.name = item.name;

            if (!await MilestoneSubmissionBackEndApplied.checkIfExists_({ id_internal: milestoneStatus.id_internal })) {
                milestoneStatus = await MilestoneStatusBackEndApplied.create(milestoneStatus);
            }
        }

        console_log(-1, 'CampaignMilestoneStatusEntity', `populate - End`);
        return true;
    }

    private static async populateSubmissionStatus() {
        const SubmissionStatusBackEndApplied = (await import('./SubmissionStatus.BackEnd.Api.Handlers')).SubmissionStatusBackEndApplied;

        for (const item of database.submission_status) {
            let submissionStatus: SubmissionStatusEntity = new SubmissionStatusEntity();
            submissionStatus.id_internal = item.id_submission_status;
            submissionStatus.name = item.name;

            if (!await SubmissionStatusBackEndApplied.checkIfExists_({ id_internal: submissionStatus.id_internal })) {
                submissionStatus = await SubmissionStatusBackEndApplied.create(submissionStatus);
            }
        }

        console_log(-1, 'CampaignSubmissionStatusEntity', `populate - End`);
        return true;
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

    protected static _ApiHandlers: string[] = ['tx', 'populate'];

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
                await this._BackEndApplied.populate();
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

    // #endregion custom api handlers
}
