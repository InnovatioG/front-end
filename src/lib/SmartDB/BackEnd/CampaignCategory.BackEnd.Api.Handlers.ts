import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { CampaignCategoryEntity } from '../Entities/CampaignCategory.Entity';

@BackEndAppliedFor(CampaignCategoryEntity)
export class CampaignCategoryBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = CampaignCategoryEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(CampaignCategoryEntity)
export class CampaignCategoryApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = CampaignCategoryEntity;
    protected static _BackEndApplied = CampaignCategoryBackEndApplied;
}
