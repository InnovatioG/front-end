import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { HandlesEnums } from '@/utils/constants/constants';
import React, { useEffect, useState } from 'react';
import styles from './ManageMilestoneSubmissionModal.module.scss';
import { CampaignEntity, MilestoneSubmissionEntity } from '@/lib/SmartDB/Entities';
import { CampaignEX } from '@/types/types';
import { CampaignApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { getCampaignEX, getCurrentMilestoneEXIndex, getMilestoneStatus_Db_Id_By_Code_Id } from '@/utils/campaignHelpers';
import { getOrdinalString } from '@/utils/formats';
import { MilestoneStatus_Code_Id_Enums } from '@/utils/constants/status/status';

interface ManageMilestoneSubmissionModalProps {}

/* MODAL PARA LOS PROTOCOL MANAGER PARA QUE PUEDAN ACEPTAR O RECHAZARla campaña */

const ManageMilestoneSubmissionModal: React.FC<ManageMilestoneSubmissionModalProps> = ({}) => {
    const { closeModal, handles, modalData } = useModal();
    const [campaign, setCampaign] = useState<CampaignEntity | undefined>();
    const [campaignEX, setCampaignEX] = useState<CampaignEX | undefined>();
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number | undefined>(undefined);
    const [submission, setSubmission] = React.useState<MilestoneSubmissionEntity | undefined>(undefined);

    const [status, setStatus] = useState<'Approve' | 'Reject' | 'Fail' | null>(null);
    const [description, setDescription] = useState('');
    const [isValidEdit, setIsValidEdit] = useState(false);

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
            if (campaignEX.milestones === undefined) {
                throw new Error('campaignEX milestones not found');
            }
            const milestoneIndex = getCurrentMilestoneEXIndex(campaignEX.milestones);
            setCurrentMilestoneIndex(milestoneIndex);
            const milestoneSubmittedId = campaignEX.milestones.find(
                (milestone) =>
                    milestone.milestone.milestone_status_id === getMilestoneStatus_Db_Id_By_Code_Id(MilestoneStatus_Code_Id_Enums.SUBMITTED) ||
                    milestone.milestone.milestone_status_id === getMilestoneStatus_Db_Id_By_Code_Id(MilestoneStatus_Code_Id_Enums.REJECTED) ||
                    milestone.milestone.milestone_status_id === getMilestoneStatus_Db_Id_By_Code_Id(MilestoneStatus_Code_Id_Enums.COLLECT)
            )?.milestone._DB_id;
            if (milestoneSubmittedId === undefined) {
                throw new Error('milestoneSubmittedId not found');
            }
            let submissions: MilestoneSubmissionEntity[] = [];
            submissions = await MilestoneSubmissionApi.getByParamsApi_({ milestone_id: milestoneSubmittedId }, { sort: { updatedAt: -1 } });
            if (submissions.length > 0) {
                setSubmission(submissions[0]);
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
        if (wallet !== undefined && status !== null && description.length > 0) {
            setIsValidEdit(true);
        } else {
            setIsValidEdit(false);
        }
    }, [status, description, wallet]);

    const handleConfirm = async () => {
        // Aquí puedes agregar la lógica para manejar la confirmación
        if (wallet === undefined) return;

        const data = { ...modalData, revised_by_wallet_id: wallet._DB_id, justification: description };

        if (status === 'Approve') {
            console.log(`handleClick: ${HandlesEnums.APPROVE_MILESTONE}`);
            if (handles && handles[HandlesEnums.APPROVE_MILESTONE]) {
                await handles[HandlesEnums.APPROVE_MILESTONE](data);
            } else {
                alert(`No handle ${HandlesEnums.APPROVE_MILESTONE} provided`);
            }
        } else if (status === 'Reject') {
            console.log(`handleClick: ${HandlesEnums.REJECT_MILESTONE}`);
            if (handles && handles[HandlesEnums.REJECT_MILESTONE]) {
                await handles[HandlesEnums.REJECT_MILESTONE](data);
            } else {
                alert(`No handle ${HandlesEnums.REJECT_MILESTONE} provided`);
            }
        } else if (status === 'Fail') {
            console.log(`handleClick: ${HandlesEnums.FAIL_MILESTONE}`);
            if (handles && handles[HandlesEnums.FAIL_MILESTONE]) {
                await handles[HandlesEnums.FAIL_MILESTONE](data);
            } else {
                alert(`No handle ${HandlesEnums.FAIL_MILESTONE} provided`);
            }
        }
        closeModal();
    };

    return (
        <article className={styles.generalContainer}>
            <header className={styles.titleSection}>
                <h3>{getOrdinalString((currentMilestoneIndex ?? 0) + 1)} Milestone Submission</h3>
            </header>
            <div className={styles.buttonStatusContainer}>
                <BtnGeneral classNameStyle={`outlineb ${status === 'Approve' ? 'selected' : ''}`} onClick={() => setStatus('Approve')}>
                    <div className={styles.greenCircle}></div>
                    <span className={`${status === 'Approve' ? `${styles.selected}` : ''}`}>Approve Milestone</span>
                </BtnGeneral>
                <BtnGeneral classNameStyle={`outlineb ${status === 'Reject' ? 'selected' : ''}`} onClick={() => setStatus('Reject')}>
                    <div className={styles.yellowCircle}></div>
                    <span className={`${status === 'Reject' ? `${styles.selected}` : ''}`}>Reject Milestone</span>
                </BtnGeneral>
                <BtnGeneral classNameStyle={`outlineb ${status === 'Fail' ? 'selected' : ''}`} onClick={() => setStatus('Fail')}>
                    <div className={styles.redCircle}></div>
                    <span className={`${status === 'Fail' ? `${styles.selected}` : ''}`}>Fail Milestone</span>
                </BtnGeneral>
            </div>
            <div className={styles.text}>
                <div className={styles.textContainer}>
                    <label htmlFor="">Report Proof Of Finalization</label>
                    <textarea className={styles.textarea} value={submission?.report_proof_of_finalization} maxLength={650} />
                </div>
                <div className={styles.textContainer}>
                    <label htmlFor="">Context and Description</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Send message report about the approbation, rejection or failure of the Milestone."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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

export default ManageMilestoneSubmissionModal;
