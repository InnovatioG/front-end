import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { CampaignEntity, CampaignFundsEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, CampaignFundsApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX } from '@/types/types';
import { getCampaignEX, getCurrentMilestoneEXIndex } from '@/utils/campaignHelpers';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import React, { useEffect, useState } from 'react';
import styles from './InputAmountModal.module.scss';
import { hexToStr, useWalletStore } from 'smart-db';

interface InputAmountModalProps {
    modalType: ModalsEnums.INVEST | ModalsEnums.GETBACK_FUNDS | ModalsEnums.COLLECT_FUNDS | ModalsEnums.WITHDRAW_TOKENS;
    handleType: HandlesEnums.INVEST | HandlesEnums.GETBACK_FUNDS | HandlesEnums.COLLECT_FUNDS | HandlesEnums.WITHDRAW_TOKENS;
}

const InputAmountModal: React.FC<InputAmountModalProps> = ({ modalType, handleType }) => {
    const { closeModal, handles, modalData } = useModal();
    const [isValidEdit, setIsValidEdit] = useState(false);
    const [amountBigInt, setAmountBigInt] = useState(0n);
    const [amountStr, setAmountStr] = useState('0');
    const [campaign, setCampaign] = useState<CampaignEntity | undefined>();
    const [campaignEX, setCampaignEX] = useState<CampaignEX | undefined>();
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number | undefined>(undefined);
    const [campaignFundsMaxAvalaible_ADA_Id, setCampaignFundsMaxAvalaible_ADA_Id] = useState<string | undefined>(undefined);

    const { wallet } = useGeneralStore();
    const walletStore = useWalletStore();

    const informationByType = {
        [ModalsEnums.INVEST]: {
            title: 'Invest',
            subtitle: 'How much do you want to invest?',
        },
        [ModalsEnums.WITHDRAW_TOKENS]: {
            title: 'Withdraw Tokens',
            subtitle: 'How much do you want to withdraw?',
        },
        [ModalsEnums.GETBACK_FUNDS]: {
            title: 'Get Back Funds',
            subtitle: 'How much do you want to get back?',
        },
        [ModalsEnums.COLLECT_FUNDS]: {
            title: 'Collect Funds',
            subtitle: 'How much do you want to collect?',
        },
    };

    const fetchCampaignById = async (id: string) => {
        try {
            const campaign: CampaignEntity | undefined = await CampaignApi.getByIdApi_(id, { doCallbackAfterLoad: true });
            if (campaign === undefined) {
                console.error('Campaign not found');
                return;
            }
            setCampaign(campaign);
            const campaignEX = await getCampaignEX(campaign);
            setCampaignEX(campaignEX);
            const milestoneIndex = getCurrentMilestoneEXIndex(campaignEX.milestones);
            setCurrentMilestoneIndex(milestoneIndex);

            switch (modalType) {
                case ModalsEnums.INVEST:
                    setAmountStr('0');
                    setAmountBigInt(0n);
                    break;
                case ModalsEnums.GETBACK_FUNDS:
                    //--------------------------------------
                    const campaignPolicy_CS = campaign.fdpCampaignPolicy_CS;
                    const campaignTokens_AC_Lucid = campaignPolicy_CS + campaign.cdCampaignToken_TN;
                    //--------------------------------------
                    const tokensAmount = walletStore.getTotalOfUnit(campaignTokens_AC_Lucid, true);
                    //--------------------------------------
                    setAmountStr(`${tokensAmount.toString()} ${hexToStr(campaign.cdCampaignToken_TN)}`);
                    setAmountBigInt(tokensAmount);
                    break;
                case ModalsEnums.COLLECT_FUNDS:
                    //--------------------------------------
                    const campaignLovelaceMaxToCollect = campaign.getAmountLovelaceToCollect();
                    //--------------------------------------
                    const campaignFunds: CampaignFundsEntity[] | undefined = await CampaignFundsApi.getByParamsApi_(
                        { cfdCampaignPolicy_CS: campaign.getNET_id_CS() },
                        {
                            loadRelations: { smartUTxO_id: true },
                        }
                    );
                    //--------------------------------------
                    if (campaignFunds.length === 0) {
                        throw new Error(`Campaign Funds not found`);
                    }
                    //--------------------------------------
                    const campaignFundsMaxAvalaible_ADA_Index = campaignFunds?.reduce(
                        (prev, current, index) => {
                            if (prev.cfdSubtotal_Avalaible_ADA > current.cfdSubtotal_Avalaible_ADA) {
                                return { ...prev, index: prev.index };
                            } else {
                                return { ...current, index };
                            }
                        },
                        { ...campaignFunds[0], index: 0 }
                    ).index;
                    //--------------------------------------
                    setCampaignFundsMaxAvalaible_ADA_Id(campaignFunds[campaignFundsMaxAvalaible_ADA_Index]._DB_id);
                    //--------------------------------------
                    const campaignLovelaceToCollect =
                        campaignLovelaceMaxToCollect < campaignFunds[campaignFundsMaxAvalaible_ADA_Index].cfdSubtotal_Avalaible_ADA
                            ? campaignLovelaceMaxToCollect
                            : campaignFunds[campaignFundsMaxAvalaible_ADA_Index].cfdSubtotal_Avalaible_ADA;
                    //--------------------------------------
                    const campaignADAToCollect = campaignLovelaceToCollect / 1000000n;
                    //--------------------------------------
                    setAmountStr(`${campaignADAToCollect.toLocaleString()} ₳`);
                    setAmountBigInt(campaignLovelaceToCollect);
                    //--------------------------------------
                    break;
            }
        } catch (error) {
            console.error('Error fetching campaign:', error);
        }
    };

    useEffect(() => {
        if (modalData !== undefined && modalData.campaign_id) {
            fetchCampaignById(modalData.campaign_id);
        }
    }, []);

    useEffect(() => {
        if (wallet !== undefined && campaignEX !== undefined && amountBigInt > 0n) {
            if (modalType === ModalsEnums.COLLECT_FUNDS && campaignFundsMaxAvalaible_ADA_Id === undefined) {
                setIsValidEdit(false);
                return;
            }
            setIsValidEdit(true);
        } else {
            setIsValidEdit(false);
        }
    }, [amountBigInt, wallet]);

    const handleClick = async () => {
        console.log(`handleClick: ${handleType}`);
        if (handles && handles[handleType]) {
            let data = { ...modalData, amount: amountBigInt.toString(), campaign_funds_id: campaignFundsMaxAvalaible_ADA_Id };
            await handles[handleType](data);
        } else {
            alert(`No handle ${handleType} provided`);
        }
        // NOTE: no lo cierro, por que se abre otro modal, el de success
        // closeModal();
    };

    //--------------------------------------
    return (
        <article className={styles.modalLayout}>
            <h2 className={styles.title}> {informationByType[modalType].title} </h2>
            <div className={styles.messageContainer}>{informationByType[modalType].subtitle}</div>
            <div className={styles.messageContainer}>{amountStr}</div>
            <div className={styles.buttonContainer}>
                <BtnGeneral text="Cancel" onClick={() => closeModal()} classNameStyle="outlineb" />
                <BtnGeneral text="Accept" onClick={() => handleClick()} classNameStyle="fillb" disabled={!isValidEdit} />
            </div>
        </article>
    );
};

export default InputAmountModal;
