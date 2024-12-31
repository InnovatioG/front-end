import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { CampaignMemberEntity } from '../Entities/CampaignMember.Entity';

@BackEndAppliedFor(CampaignMemberEntity)
export class CampaignMemberBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = CampaignMemberEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(CampaignMemberEntity)
export class CampaignMemberApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = CampaignMemberEntity;
    protected static _BackEndApplied = CampaignMemberBackEndApplied;
}
