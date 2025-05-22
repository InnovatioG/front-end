import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { CampaignSubmissionEntity } from '../Entities/CampaignSubmission.Entity';

@BackEndAppliedFor(CampaignSubmissionEntity)
export class CampaignSubmissionBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = CampaignSubmissionEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(CampaignSubmissionEntity)
export class CampaignSubmissionApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = CampaignSubmissionEntity;
    protected static _BackEndApplied = CampaignSubmissionBackEndApplied;
}
