import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseBackEndApiHandlers,
    BaseBackEndApplied,
    BaseBackEndMethods
} from 'smart-db/backEnd';
import { MilestoneEntity } from '../Entities/Milestone.Entity';

@BackEndAppliedFor(MilestoneEntity)
export class MilestoneBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = MilestoneEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(MilestoneEntity)
export class MilestoneApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = MilestoneEntity;
    protected static _BackEndApplied = MilestoneBackEndApplied;
}
