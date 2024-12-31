import { BackEndApiHandlersFor, BackEndAppliedFor, BaseBackEndApiHandlers, BaseBackEndApplied, BaseBackEndMethods } from 'smart-db/backEnd';
import { ProtocolAdminWalletEntity } from '../Entities/ProtocolAdminWallet.Entity';

@BackEndAppliedFor(ProtocolAdminWalletEntity)
export class ProtocolAdminWalletBackEndApplied extends BaseBackEndApplied {
    protected static _Entity = ProtocolAdminWalletEntity;
    protected static _BackEndMethods = BaseBackEndMethods;
}

@BackEndApiHandlersFor(ProtocolAdminWalletEntity)
export class ProtocolAdminWalletApiHandlers extends BaseBackEndApiHandlers {
    protected static _Entity = ProtocolAdminWalletEntity;
    protected static _BackEndApplied = ProtocolAdminWalletBackEndApplied;
}
