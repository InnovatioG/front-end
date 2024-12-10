import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseBackEndApiHandlers,
    BaseBackEndApplied,
    BaseBackEndMethods,
} from 'smart-db/backEnd';
import { CampaignFaqsEntity } from '../Entities/CampaignFaqs.Entity';

@BackEndAppliedFor(CampaignFaqsEntity)
export class CampaignFaqsBackEndApplied extends BaseBackEndApplied   {
    protected static _Entity = CampaignFaqsEntity;
    protected static _BackEndMethods = BaseBackEndMethods ;
}

@BackEndApiHandlersFor(CampaignFaqsEntity)
export class CampaignFaqsApiHandlers extends BaseBackEndApiHandlers    {
    protected static _Entity = CampaignFaqsEntity;
    protected static _BackEndApplied = CampaignFaqsBackEndApplied;

}

