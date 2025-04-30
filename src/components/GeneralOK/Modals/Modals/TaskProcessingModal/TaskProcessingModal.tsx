import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';
import { useModal } from '@/contexts/ModalContext';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { CLOSE, useAppStore } from 'smart-db';
import styles from './TaskProcessingModal.module.scss';
import SuccessIcon from '@/components/GeneralOK/Controls/SuccessIcon/SuccessIcon';
import FailedIcon from '@/components/GeneralOK/Controls/FailedIcon/FailedIcon';

export interface TaskProcessingModalProps {
    onNewTask?: () => Promise<void>;
    onFinishTask?: () => Promise<void>;
    onTryAgainTask?: () => Promise<void>;
    showNewTaskButton?: boolean;
    showViewTaskButton?: boolean;
    showTryAgainTaskButton?: boolean;
    nameForNewTaskButton?: string;
    nameForTryAgainButton?: string;
    nameForFinishButton?: string;
    othersButtonsWhenConfirmed?: React.ReactNode;
    othersButtonsWhenFailed?: React.ReactNode;
}

const TaskProcessingModal: React.FC = (props: TaskProcessingModalProps) => {
    //--------------------------------------
    const { closeModal, modalData } = useModal();
    //--------------------------------------
    const appStore = useAppStore();
    const router = useRouter();
    //-------------------------------------
    const data = modalData as TaskProcessingModalProps;
    //--------------------------------------
    const onNewTask = data?.onNewTask !== undefined ? data?.onNewTask : props?.onNewTask !== undefined ? props?.onNewTask : undefined;
    const onFinishTask =
        data?.onFinishTask !== undefined
            ? data?.onFinishTask
            : props?.onFinishTask !== undefined
            ? props?.onFinishTask
            : () => {
                  appStore.setShowProcessingTask(false);
              };
    const onTryAgainTask = data?.onTryAgainTask !== undefined ? data?.onTryAgainTask : props?.onTryAgainTask !== undefined ? props?.onTryAgainTask : undefined;
    const showNewTaskButton = data?.showNewTaskButton !== undefined ? data?.showNewTaskButton : props?.showNewTaskButton !== undefined ? props?.showNewTaskButton : false;
    const showViewTasksButton = data?.showViewTaskButton !== undefined ? data?.showViewTaskButton : props?.showViewTaskButton !== undefined ? props?.showViewTaskButton : false;
    const showTryAgainTaskButton =
        data?.showTryAgainTaskButton !== undefined ? data?.showTryAgainTaskButton : props?.showTryAgainTaskButton !== undefined ? props?.showTryAgainTaskButton : false;
    const nameForNewTaskButton =
        data?.nameForNewTaskButton !== undefined ? data?.nameForNewTaskButton : props?.nameForNewTaskButton !== undefined ? props?.nameForNewTaskButton : 'New Task';
    const nameForTryAgainButton =
        data?.nameForTryAgainButton !== undefined ? data?.nameForTryAgainButton : props?.nameForTryAgainButton !== undefined ? props?.nameForTryAgainButton : 'Try Again';
    const nameForFinishButton =
        data?.nameForFinishButton !== undefined ? data?.nameForFinishButton : props?.nameForFinishButton !== undefined ? props?.nameForFinishButton : 'Close';
    const othersButtonsWhenConfirmed =
        data?.othersButtonsWhenConfirmed !== undefined
            ? data?.othersButtonsWhenConfirmed
            : props?.othersButtonsWhenConfirmed !== undefined
            ? props?.othersButtonsWhenConfirmed
            : null;
    const othersButtonsWhenFailed =
        data?.othersButtonsWhenFailed !== undefined ? data?.othersButtonsWhenFailed : props?.othersButtonsWhenFailed !== undefined ? props?.othersButtonsWhenFailed : null;
    //--------------------------------------
    useEffect(() => {
        if (appStore.showProcessingTask === false) {
            closeModal();
        }
    }, [appStore.showProcessingTask, closeModal]);
    //--------------------------------------
    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            {appStore.isProcessingTask ? (
                <>
                    <header className={styles.headerModal}>
                        <LoaderDots />
                        <h2 className={styles.titleModal}>PROCESSING YOUR OPERATION</h2>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>{appStore.processingTaskMessage}</p>
                        </div>
                    </div>
                </>
            ) : appStore.isConfirmedTask ? (
                <>
                    <header className={styles.headerModal}>
                        <SuccessIcon />
                        <h2 className={styles.titleModal}>CONGRATULATIONS</h2>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>We are thrilled to inform you that your recent operation has been completed successfully!</p>
                            {/* <p className={styles.text}>What do you want to do next?</p> */}
                        </div>
                        <div className={styles.btnGroup}>
                            {showNewTaskButton ? (
                                <BtnGeneral
                                    text={nameForNewTaskButton}
                                    onClick={() => {
                                        onNewTask?.();
                                    }}
                                    classNameStyle="fillb"
                                />
                            ) : null}
                            {othersButtonsWhenConfirmed !== undefined ? othersButtonsWhenConfirmed : null}
                            {/* {showViewTransactionsButton === true && (
                                <BtnGeneral
                                    text={'View Transactions'}
                                    onClick={async () => {
                                        setShowProcessingTx(false);
                                        await router.push({
                                            pathname: ROUTES.PORTFOLIO,
                                            query: { Task: TASK.TRANSACTIONS },
                                        });
                                    }}
                                />
                            )} */}
                            <BtnGeneral text={nameForFinishButton} onClick={() => onFinishTask?.()} />
                        </div>
                    </div>
                </>
            ) : appStore.isFaildedTask ? (
                <>
                    <header className={styles.headerModal}>
                        <FailedIcon />
                        <h2 className={styles.titleModal}>SOMETHING WENT WRONG</h2>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>We are very sorry to inform you that your recent operation has failed! You can try again!</p>
                            <p className={styles.text}>{appStore.processingTxMessage}</p>
                        </div>
                        <div className={styles.btnGroup}>
                            {showTryAgainTaskButton && <BtnGeneral text={nameForTryAgainButton} onClick={() => onTryAgainTask?.()} />}
                            {othersButtonsWhenFailed !== undefined ? othersButtonsWhenFailed : null}
                            <BtnGeneral text={nameForFinishButton} onClick={() => onFinishTask?.()} />
                        </div>
                    </div>
                </>
            ) : null}
        </article>
    );
};

export default TaskProcessingModal;
