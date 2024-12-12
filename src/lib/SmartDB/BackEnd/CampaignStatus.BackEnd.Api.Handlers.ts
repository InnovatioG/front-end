import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseBackEndApiHandlers,
    BaseBackEndApplied,
    BaseBackEndMethods,
} from 'smart-db/backEnd';
import { CampaignStatusEntity } from '../Entities/CampaignStatus.Entity';

@BackEndAppliedFor(CampaignStatusEntity)
export class CampaignStatusBackEndApplied extends BaseBackEndApplied   {
    protected static _Entity = CampaignStatusEntity;
    protected static _BackEndMethods = BaseBackEndMethods ;
}

@BackEndApiHandlersFor(CampaignStatusEntity)
export class CampaignStatusApiHandlers extends BaseBackEndApiHandlers    {
    protected static _Entity = CampaignStatusEntity;
    protected static _BackEndApplied = CampaignStatusBackEndApplied;

}

