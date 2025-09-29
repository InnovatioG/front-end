import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';
import { useModal } from '@/contexts/ModalContext';
import { CampaignEntity, MilestoneEntity, MilestoneSubmissionEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, MilestoneApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import {
    getCampaignEX,
    getCurrentMilestoneEXIndex,
    getMilestoneStatus_Db_Id_By_Code_Id,
    getSubmissionStatus_Code_Id_By_Db_Id,
    getSubmissionStatus_Name_By_Db_Id,
} from '@/utils/campaignHelpers';
import { MilestoneStatus_Code_Id_Enums, SubmissionStatus_Enums } from '@/utils/constants/status/status';
import React, { useState } from 'react';
import { useList } from 'smart-db';
import styles from './ViewMilestoneSubmissionModal.module.scss';
import { CampaignEX } from '@/types/types';
import { getOrdinalString } from '@/utils/formats';

interface ViewMilestoneSubmissionModalProps {}

const ViewMilestoneSubmissionModal: React.FC<ViewMilestoneSubmissionModalProps> = ({}) => {
    //--------------------------------------
    const { closeModal, handles, modalData } = useModal();
    //--------------------------------------
    const [campaign, setCampaign] = useState<CampaignEntity | undefined>();
    const [campaignEX, setCampaignEX] = useState<CampaignEX | undefined>();
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number | undefined>(undefined);
    const [submission, setSubmission] = React.useState<MilestoneSubmissionEntity | undefined>(undefined);
    //--------------------------------------
    const loadList = async () => {
        const campaign: CampaignEntity | undefined = await CampaignApi.getByIdApi_(modalData!.campaign_id, { doCallbackAfterLoad: false });
        if (campaign === undefined) {
            throw new Error('Campaign not found');
        }
        setCampaign(campaign);
        const campaignEX = await getCampaignEX(campaign);
        if (campaignEX.milestones === undefined) {
            throw new Error('campaignEX milestones not found');
        }
        setCampaignEX(campaignEX);
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
        return submissions;
    };
    //--------------------------------------
    const { isLoadingList, isLoadedList, list, current, refreshList } = useList<MilestoneSubmissionEntity>({
        nameList: 'MilestoneSubmissions',
        loadList,
        checkDependencies: () => {
            if (modalData === undefined) {
                return false;
            }
            return true;
        },
        dependencies: [modalData],
    });

    //--------------------------------------
    if (isLoadingList) {
        return (
            <article className={styles.modalLayout} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <LoaderDots />
            </article>
        );
    }
    //--------------------------------------
    if (submission === undefined) {
        return (
            <article className={styles.modalLayout} style={{ alignItems: 'center', justifyContent: 'center' }}>
                TODO: no se encontro submission
            </article>
        );
    }
    //--------------------------------------
    const renderContent = () => {
        const status_code_id = getSubmissionStatus_Code_Id_By_Db_Id(submission.submission_status_id);
        switch (status_code_id) {
            case SubmissionStatus_Enums.SUBMITTED:
                return (
                    <>
                        <img src="/img/icons/status/green.svg" alt="green" />
                        <div className={styles.textContainer}>
                            <p>Your milestone has been sent for review. Please wait.</p>
                            <label htmlFor="">Report Proof Of Finalization:</label>
                            <textarea className={styles.textarea2} value={submission.report_proof_of_finalization} maxLength={650} />
                        </div>
                    </>
                );
            case SubmissionStatus_Enums.APPROVED:
                return (
                    <>
                        <img src="/img/icons/status/green.svg" alt="green" />
                        <p>{submission.approved_justification}</p>
                    </>
                );
            case SubmissionStatus_Enums.REJECTED:
                return (
                    <>
                        <img src="/img/icons/status/red.svg" alt="red" />
                        <p>{submission.rejected_justification}</p>
                    </>
                );
            case SubmissionStatus_Enums.FAILED:
                return (
                    <>
                        <img src="/img/icons/status/red.svg" alt="red" />
                        <p>{submission.rejected_justification}</p>
                    </>
                );
            default:
                return <p>Unknown state</p>;
        }
    };
    //--------------------------------------
    return (
        <article className={styles.modalLayout}>
            <h2 className={styles.title}>
                {getOrdinalString((currentMilestoneIndex ?? 0) + 1)} Milestone: {getSubmissionStatus_Name_By_Db_Id(submission.submission_status_id)}
            </h2>
            <div className={styles.messageContainer}>{renderContent()}</div>
            <div className={styles.buttonContainer}>
                <BtnGeneral text="Continue" classNameStyle="fillb" onClick={closeModal} />
            </div>
        </article>
    );
};

export default ViewMilestoneSubmissionModal;
