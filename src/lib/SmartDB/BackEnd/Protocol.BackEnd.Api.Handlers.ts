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

@BackEndAppliedFor(ProtocolEntity)
export class ProtocolBackEndApplied extends BaseSmartDBBackEndApplied {
    protected static _Entity = ProtocolEntity;
    protected static _BackEndMethods = BaseSmartDBBackEndMethods;

    // #region class methods

    public static async populate() {
        //--------------------------------------
        console_log(1, this._Entity.className(), `populate - Init`);
        console_log(0, this._Entity.className(), `populate - Working on...`);
        //--------------------------------------
        const CampaignBackEndApplied = (await import('./Campaign.BackEnd.Api.Handlers')).CampaignBackEndApplied;
        const CampaignCategoryBackEndApplied = (await import('./CampaignCategory.BackEnd.Api.Handlers')).CampaignCategoryBackEndApplied;
        const CampaignContentBackEndApplied = (await import('./CampaignContent.BackEnd.Api.Handlers')).CampaignContentBackEndApplied;
        const CampaignFaqsBackEndApplied = (await import('./CampaignFaqs.BackEnd.Api.Handlers')).CampaignFaqsBackEndApplied;
        const CampaignFundsBackEndApplied = (await import('./CampaignFunds.BackEnd.Api.Handlers')).CampaignFundsBackEndApplied;
        const CampaignMemberBackEndApplied = (await import('./CampaignMember.BackEnd.Api.Handlers')).CampaignMemberBackEndApplied;
        const CampaignStatusBackEndApplied = (await import('./CampaignStatus.BackEnd.Api.Handlers')).CampaignStatusBackEndApplied;
        const CampaignSubmissionBackEndApplied = (await import('./CampaignSubmission.BackEnd.Api.Handlers')).CampaignSubmissionBackEndApplied;
        const CustomWalletBackEndApplied = (await import('./CustomWallet.BackEnd.Api.Handlers')).CustomWalletBackEndApplied;
        const MilestoneBackEndApplied = (await import('./Milestone.BackEnd.Api.Handlers')).MilestoneBackEndApplied;
        const MilestoneStatusBackEndApplied = (await import('./MilestoneStatus.BackEnd.Api.Handlers')).MilestoneStatusBackEndApplied;
        const MilestoneSubmissionBackEndApplied = (await import('./MilestoneSubmission.BackEnd.Api.Handlers')).MilestoneSubmissionBackEndApplied;
        const ProtocoBackEndApplied = (await import('./Protocol.BackEnd.Api.Handlers')).ProtocolBackEndApplied;
        const ProtocolAdminWalletBackEndApplied = (await import('./ProtocolAdminWallet.BackEnd.Api.Handlers')).ProtocolAdminWalletBackEndApplied;
        const SubmissionStatusBackEndApplied = (await import('./SubmissionStatus.BackEnd.Api.Handlers')).SubmissionStatusBackEndApplied;
        //--------------------------------------
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

    protected static _ApiHandlers: string[] = ['tx','populate'];

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
                await this._BackEndApplied.populate()
                //-------------------------
                console_log(-1, this._Entity.className(), `populateApiHandler - POST - OK`);
                //-------------------------
                return res.status(200).json({result: true});
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
