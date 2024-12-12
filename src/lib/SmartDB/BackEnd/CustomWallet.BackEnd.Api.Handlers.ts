import {
    BackEndApiHandlersFor,
    BackEndAppliedFor,
    BaseBackEndApiHandlers,
    BaseBackEndApplied,
    BaseBackEndMethods,
} from 'smart-db/backEnd';
import { CustomWalletEntity } from '../Entities/CustomWallet.Entity';

@BackEndAppliedFor(CustomWalletEntity)
export class CustomWalletBackEndApplied extends BaseBackEndApplied   {
    protected static _Entity = CustomWalletEntity;
    protected static _BackEndMethods = BaseBackEndMethods ;
}

@BackEndApiHandlersFor(CustomWalletEntity)
export class CustomWalletApiHandlers extends BaseBackEndApiHandlers    {
    protected static _Entity = CustomWalletEntity;
    protected static _BackEndApplied = CustomWalletBackEndApplied;

}

