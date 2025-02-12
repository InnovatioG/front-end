import { ModalEnums } from '@/utils/constants/constants';
import { ReactNode, useState } from 'react';
import { ModalContext } from './ModalContext';
import ModalTemplate from '@/components/GeneralOK/Modals/ModalTemplate/ModalTemplate';
import WalletConnectorModal from '@/components/GeneralOK/Modals/Modals/WalletConnectorModal/WalletConnectorModal';
import LaunchCampaignModal from '@/components/GeneralOK/Modals/Modals/LaunchCampaignModal/LaunchCampaignModal';
import ContactSupportModal from '@/components/GeneralOK/Modals/Modals/ContactSupportModal/ContactSupportModal';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [activeModal, setActiveModal] = useState<ModalEnums | null>(null);
    const [modalData, setModalData] = useState<Record<string, any> | undefined>(undefined);
    const [dynamicModal, setDynamicModal] = useState<ReactNode | null>(null);

    const openModal = (modal: ModalEnums, data?: Record<string, any>, component?: ReactNode) => {
        setActiveModal(modal);
        setModalData(data || undefined);
        setDynamicModal(component || null);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(undefined);
        setDynamicModal(null);
    };
    // Predefined modals
    const modalComponents: Partial<Record<ModalEnums, JSX.Element>> = {
        [ModalEnums.walletConnect]: <WalletConnectorModal />,
        [ModalEnums.deleteCampaign]: undefined,
        [ModalEnums.submitCampaign]: undefined,
        // [ModalEnums.manageCampaignSubmissions]: <ManageCampaignModal  />,
        // [ModalEnums.viewCampaignSubmissions]: undefined,
        // [ModalEnums.createSmartContracts]: <SingleQuestionModal modalType="createSmartContract" />,
        // [ModalEnums.publishSmartContracts]: <SingleQuestionModal modalType="publishSmartContract" />,
        // [ModalEnums.initializeCampaign]: <SingleQuestionModal modalType="initializeCampaign" />,
        // [ModalEnums.manageCampaignUTXOs]: undefined,
        [ModalEnums.launchCampaign]: <LaunchCampaignModal />,
        // [ModalEnums.validateFundraisingStatus]: <SingleQuestionModal modalType="validateFundraisingStatus" />,
        // [ModalEnums.withdrawTokensFailed]: <SingleQuestionModal modalType="withdrawTokens" />,
        // [ModalEnums.withdrawTokensUnreached]: <SingleQuestionModal modalType="withdrawTokens" />,
        // [ModalEnums.submitMilestone]: <SendReport campaign={modalState.campaign} />,
        // [ModalEnums.manageMilestoneSubmissions]: <ViewReportModal id={modalState.campaign_id!} />,
        // [ModalEnums.viewMilestoneSubmissions]: <ViewReportMilestone submission={modalState.submission} />,
        // [ModalEnums.collectFunds]: <SingleQuestionModal modalType="collect" />,
        [ModalEnums.contactSupport]: <ContactSupportModal />,
    };

    return (
        <ModalContext.Provider
            value={{
                activeModal,
                modalData,
                openModal,
                closeModal,
            }}
        >
            {activeModal !== null && (
                <ModalTemplate active={activeModal}>
                    {/* Use predefined modal if available, otherwise fallback to dynamic modal */}
                    {modalComponents[activeModal] || dynamicModal || <>Modal {activeModal} Not Implemented</>}
                </ModalTemplate>
            )}

            {children}
        </ModalContext.Provider>
    );
};
