import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { MilestoneSubmissionEntity } from '../Entities/MilestoneSubmission.Entity';

@BackEndAppliedFor(MilestoneSubmissionEntity)
export class MilestoneSubmissionBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = MilestoneSubmissionEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(MilestoneSubmissionEntity)
export class MilestoneSubmissionApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = MilestoneSubmissionEntity;
    protected static _BackEndApplied = MilestoneSubmissionBackEndApplied;
}
