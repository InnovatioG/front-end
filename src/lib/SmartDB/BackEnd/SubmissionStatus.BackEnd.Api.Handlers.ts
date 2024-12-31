import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { SubmissionStatusEntity } from '../Entities/SubmissionStatus.Entity';

@BackEndAppliedFor(SubmissionStatusEntity)
export class SubmissionStatusBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = SubmissionStatusEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(SubmissionStatusEntity)
export class SubmissionStatusApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = SubmissionStatusEntity;
    protected static _BackEndApplied = SubmissionStatusBackEndApplied;
}
