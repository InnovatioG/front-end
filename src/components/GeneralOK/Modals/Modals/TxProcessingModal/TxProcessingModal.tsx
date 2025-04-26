import { useModal } from '@/contexts/ModalContext';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import styles from './TxProcessingModal.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useRouter } from 'next/router';
import { CLOSE, CopyButton, formatHash, OpenInNewTabButton, useAppStore } from 'smart-db';
import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';
import FailedIcon from '@/components/GeneralOK/Controls/FailedIcon/FailedIcon';
import SuccessIcon from '@/components/GeneralOK/Controls/SuccessIcon/SuccessIcon';

interface TxProcessingModalProps {
    // Define props here
}

export interface TxProcessingModalData {
    onNewTx?: () => Promise<void>;
    onFinishTx?: () => Promise<void>;
    onTryAgainTx?: () => Promise<void>;
    showNewTxButton?: boolean;
    showViewTxButton?: boolean;
    showTryAgainTxButton?: boolean;
    nameForNewTxButton?: string;
    nameForTryAgainButton?: string;
    nameForFinishButton?: string;
    othersButtonsWhenConfirmed?: React.ReactNode;
    othersButtonsWhenFailed?: React.ReactNode;
}

const TxProcessingModal: React.FC = (props: TxProcessingModalData) => {
    //--------------------------------------
    const { closeModal, modalData } = useModal();
    //--------------------------------------
    const appStore = useAppStore();
    const router = useRouter();
    //-------------------------------------
    const data = modalData as TxProcessingModalData;
    //--------------------------------------
    const onNewTx = data?.onNewTx !== undefined ? data?.onNewTx : props?.onNewTx !== undefined ? props?.onNewTx : undefined;
    const onFinishTx =
        data?.onFinishTx !== undefined
            ? data?.onFinishTx
            : props?.onFinishTx !== undefined
            ? props?.onFinishTx
            : () => {
                  appStore.setShowProcessingTx(false);
              };
    const onTryAgainTx = data?.onTryAgainTx !== undefined ? data?.onTryAgainTx : props?.onTryAgainTx !== undefined ? props?.onTryAgainTx : undefined;
    const showNewTransactionButton = data?.showNewTxButton !== undefined ? data?.showNewTxButton : props?.showNewTxButton !== undefined ? props?.showNewTxButton : false;
    const showViewTransactionsButton = data?.showViewTxButton !== undefined ? data?.showViewTxButton : props?.showViewTxButton !== undefined ? props?.showViewTxButton : false;
    const showTryAgainTransactionButton =
        data?.showTryAgainTxButton !== undefined ? data?.showTryAgainTxButton : props?.showTryAgainTxButton !== undefined ? props?.showTryAgainTxButton : false;
    const nameForNewTransactionButton =
        data?.nameForNewTxButton !== undefined ? data?.nameForNewTxButton : props?.nameForNewTxButton !== undefined ? props?.nameForNewTxButton : 'New Transaction';
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
        if (appStore.showProcessingTx === false) {
            closeModal();
        }
    }, [appStore.showProcessingTx, closeModal]);
    //--------------------------------------
    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            {appStore.isProcessingTx ? (
                <>
                    <header className={styles.headerModal}>
                        <LoaderDots />
                        <h2 className={styles.titleModal}>PROCESSING YOUR TRANSACTION</h2>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>{appStore.processingTxMessage}</p>
                            {appStore.processingTxHash !== undefined && appStore.processingTxHash !== '' ? (
                                <div className={styles.txHash}>
                                    <p className={styles.hash}>Tx Hash: {formatHash(appStore.processingTxHash)}</p>
                                    <CopyButton content={appStore.processingTxHash} />
                                    <OpenInNewTabButton
                                        url={appStore.siteSettings !== undefined ? `${appStore.siteSettings.getblockfrost_url_explorer_tx(appStore.processingTxHash)}` : ``}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            ) : appStore.isConfirmedTx ? (
                <>
                    <header className={styles.headerModal}>
                        <SuccessIcon />
                        <h2 className={styles.titleModal}>CONGRATULATIONS</h2>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>We are thrilled to inform you that your recent transaction has been completed successfully!</p>
                            {appStore.processingTxHash !== undefined && appStore.processingTxHash !== '' ? (
                                <div className={styles.txHash}>
                                    <p className={styles.hash}>Tx Hash: {formatHash(appStore.processingTxHash)}</p>
                                    <CopyButton content={appStore.processingTxHash} />
                                    <OpenInNewTabButton
                                        url={appStore.siteSettings !== undefined ? `${appStore.siteSettings.getblockfrost_url_explorer_tx(appStore.processingTxHash)}` : ``}
                                    />
                                </div>
                            ) : null}
                            <p className={styles.text}>What do you want to do next?</p>
                        </div>
                        <div className={styles.btnGroup}>
                            {showNewTransactionButton ? (
                                <BtnGeneral
                                    text={nameForNewTransactionButton}
                                    onClick={() => {
                                        onNewTx?.();
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
                            <BtnGeneral text={nameForFinishButton} onClick={() => onFinishTx?.()} />
                        </div>
                    </div>
                </>
            ) : appStore.isFaildedTx ? (
                <>
                    <header className={styles.headerModal}>
                        <FailedIcon />
                        <h2 className={styles.titleModal}>SOMETHING WENT WRONG</h2>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>We are very sorry to inform you that your recent transaction has failed! You can try again!</p>
                            <p className={styles.text}>{appStore.processingTxMessage}</p>
                        </div>
                        <div className={styles.btnGroup}>
                            {showTryAgainTransactionButton && <BtnGeneral text={nameForTryAgainButton} onClick={() => onTryAgainTx?.()} />}
                            {othersButtonsWhenFailed !== undefined ? othersButtonsWhenFailed : null}
                            <BtnGeneral text={nameForFinishButton} onClick={() => onFinishTx?.()} />
                        </div>
                    </div>
                </>
            ) : null}
        </article>
    );
};

export default TxProcessingModal;
