import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';
import { useModal } from '@/contexts/ModalContext';
import { CampaignSubmissionEntity } from '@/lib/SmartDB/Entities';
import { CampaignSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { getSubmissionStatus_Code_Id_By_Db_Id, getSubmissionStatus_Name_By_Db_Id } from '@/utils/campaignHelpers';
import { SubmissionStatus_Enums } from '@/utils/constants/status/status';
import React from 'react';
import { useList } from 'smart-db';
import styles from './ViewCampaignSubmissionModal.module.scss';

interface ViewCampaignSubmissionModalProps {}

const ViewCampaignSubmissionModal: React.FC<ViewCampaignSubmissionModalProps> = ({}) => {
    //--------------------------------------
    const { closeModal, handles, modalData } = useModal();
    //--------------------------------------
    const [submission, setSubmission] = React.useState<CampaignSubmissionEntity | undefined>(undefined);
    //--------------------------------------
    const loadList = async () => {
        let submissions: CampaignSubmissionEntity[] = [];
        if (modalData !== undefined) {
            submissions = await CampaignSubmissionApi.getByParamsApi_({ campaign_id: modalData.campaign_id }, { sort: { updatedAt: -1 } });
            if (submissions.length > 0) {
                setSubmission(submissions[0]);
            }
        }
        return submissions;
    };
    //--------------------------------------
    const { isLoadingList, isLoadedList, list, current, refreshList } = useList<CampaignSubmissionEntity>({
        nameList: 'CampaignSubmissions',
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
                return <p>Your campaign has been sent for review. Please wait.</p>;
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
            <h2 className={styles.title}>Campaign {getSubmissionStatus_Name_By_Db_Id(submission.submission_status_id)}</h2>
            <div className={styles.messageContainer}>{renderContent()}</div>
            <div className={styles.buttonContainer}>
                <BtnGeneral text="Continue" classNameStyle="fillb" onClick={closeModal} />
            </div>
        </article>
    );
};

export default ViewCampaignSubmissionModal;
