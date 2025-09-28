import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX } from '@/types/types';
import { getCampaignEX, getCurrentMilestoneIndex } from '@/utils/campaignHelpers';
import { HandlesEnums } from '@/utils/constants/constants';
import { getOrdinalString } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './MilestoneSubmissionModal.module.scss';

interface MilestoneSubmissionModalProps {}

/* MODAL PARA LOS CAMPAIGN MANAGER PARA QUE PUEDAN SUBMIT MILESTONE */

const MilestoneSubmissionModal: React.FC<MilestoneSubmissionModalProps> = ({}) => {
    const { closeModal, handles, modalData } = useModal();
    const [report, setReport] = useState('');
    const [isValidEdit, setIsValidEdit] = useState(false);
    const [campaign, setCampaign] = useState<CampaignEntity | undefined>();
    const [campaignEX, setCampaignEX] = useState<CampaignEX | undefined>();
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number | undefined>(undefined);

    const { wallet } = useGeneralStore();

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
            const milestoneIndex = getCurrentMilestoneIndex(campaignEX);
            setCurrentMilestoneIndex(milestoneIndex);
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
        if (wallet !== undefined && campaignEX !== undefined && report.length > 0) {
            setIsValidEdit(true);
        } else {
            setIsValidEdit(false);
        }
    }, [report, wallet]);

    const handleConfirm = async () => {
        // Aquí puedes agregar la lógica para manejar la confirmación
        if (wallet === undefined) return;

        const data = { ...modalData, revised_by_wallet_id: wallet._DB_id, justification: report };

        console.log(`handleClick: ${HandlesEnums.SUBMIT_MILESTONE}`);
        if (handles && handles[HandlesEnums.SUBMIT_MILESTONE]) {
            await handles[HandlesEnums.SUBMIT_MILESTONE](data);
        } else {
            alert(`No handle ${HandlesEnums.SUBMIT_MILESTONE} provided`);
        }

        closeModal();
    };

    return (
        <article className={styles.generalContainer}>
            <header className={styles.titleSection}>
                <h3>{getOrdinalString((currentMilestoneIndex ?? 0) + 1)} Milestone</h3>
            </header>
            <div className={styles.text}>
                <div className={styles.textContainer}>
                    <label htmlFor="">Report Proof Of Finalization</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Describe here the results or conclusions for this milestone. If it was approved, rejected or partially delivered. This report will be stored and visible for campaign stakeholders."
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        maxLength={650}
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <BtnGeneral classNameStyle="outlineb" text="Back" onClick={closeModal} />
                    <BtnGeneral classNameStyle="fillb" text="Confirm" onClick={handleConfirm} disabled={!isValidEdit} />
                </div>
            </div>
        </article>
    );
};

export default MilestoneSubmissionModal;
