import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { MilestoneStatusEntity } from '../Entities/MilestoneStatus.Entity';

@BackEndAppliedFor(MilestoneStatusEntity)
export class MilestoneStatusBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = MilestoneStatusEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(MilestoneStatusEntity)
export class MilestoneStatusApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = MilestoneStatusEntity;
    protected static _BackEndApplied = MilestoneStatusBackEndApplied;
}
