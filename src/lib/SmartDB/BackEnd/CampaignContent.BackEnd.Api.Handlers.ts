import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseBackEndApiHandlers,
    BaseBackEndApplied,
    BaseBackEndMethods,
} from 'smart-db/backEnd';
import { CampaignContentEntity } from '../Entities/CampaignContent.Entity';

@BackEndAppliedFor(CampaignContentEntity)
export class CampaignContentBackEndApplied extends BaseBackEndApplied   {
    protected static _Entity = CampaignContentEntity;
    protected static _BackEndMethods = BaseBackEndMethods ;
}

@BackEndApiHandlersFor(CampaignContentEntity)
export class CampaignContentApiHandlers extends BaseBackEndApiHandlers    {
    protected static _Entity = CampaignContentEntity;
    protected static _BackEndApplied = CampaignContentBackEndApplied;

}

