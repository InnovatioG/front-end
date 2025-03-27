import { useModal } from '@/contexts/ModalContext';
import React, { Dispatch, SetStateAction } from 'react';
import styles from './TxProcessingModal.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useRouter } from 'next/router';
import { CLOSE, CopyButton, formatHash, OpenInNewTabButton, useAppStore } from 'smart-db';
import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';

interface TxProcessingModalProps {
    // Define props here
}

export interface TxProcessingModalData {
    showProcessingTx: boolean;
    setShowProcessingTx: Dispatch<SetStateAction<boolean>>;
    isProcessingTx: boolean;
    processingTxMessage: string;
    processingTxHash: string;
    isFaildedTx: boolean;
    isConfirmedTx: boolean;
    onNewTx?: () => Promise<void>;
    onFinishTx?: () => Promise<void>;
    onTryAgainTx?: () => Promise<void>;
    showNewTransactionButton?: boolean;
    showViewTransactionsButton?: boolean;
    showTryAgainTransactionButton?: boolean;
    nameForNewTransactionButton?: string;
    nameForTryAgainButton?: string;
    nameForFinishButton?: string;
    othersButtonsWhenConfirmed?: React.ReactNode;
    othersButtonsWhenFailed?: React.ReactNode;
}

const TxProcessingModal: React.FC<TxProcessingModalProps> = (props) => {
    const { closeModal, modalData } = useModal();
    const data = modalData as TxProcessingModalData;
    const {
        showProcessingTx,
        setShowProcessingTx,
        isProcessingTx,
        isFaildedTx,
        isConfirmedTx,
        processingTxMessage,
        processingTxHash,
        othersButtonsWhenConfirmed,
        othersButtonsWhenFailed,
    } = data;
    //--------------------------------------
    const nameForNewTransactionButton = data.nameForNewTransactionButton !== undefined ? data.nameForNewTransactionButton : 'New Transaction';
    const nameForTryAgainButton = data.nameForTryAgainButton !== undefined ? data.nameForTryAgainButton : 'Try Again';
    const nameForFinishButton = data.nameForFinishButton !== undefined ? data.nameForFinishButton : 'Close';
    //--------------------------------------
    const showNewTransactionButton = data.showNewTransactionButton !== undefined ? data.showNewTransactionButton : false;
    const showViewTransactionsButton = data.showViewTransactionsButton !== undefined ? data.showViewTransactionsButton : false;
    const showTryAgainTransactionButton = data.showTryAgainTransactionButton !== undefined ? data.showTryAgainTransactionButton : false;
    //--------------------------------------
    const appStore = useAppStore();
    //--------------------------------------
    const router = useRouter();
    //--------------------------------------

    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            {isProcessingTx ? (
                <>
                    <header className={styles.headerModal}>
                        <LoaderDots />
                        <h2 className={styles.titleModal}>PROCESSING YOUR TRANSACTION</h2>
                        <svg width="45" height="45" className={styles.icon} onClick={() => setShowProcessingTx(false)}>
                            <use href={CLOSE.href}></use>
                        </svg>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>{processingTxMessage}</p>
                            {processingTxHash !== undefined && processingTxHash !== '' ? (
                                <div className={styles.txHash}>
                                    <p className={styles.hash}>Tx Hash: {formatHash(data.processingTxHash)}</p>
                                    <CopyButton content={data.processingTxHash} />
                                    <OpenInNewTabButton
                                        url={appStore.siteSettings !== undefined ? `${appStore.siteSettings.getblockfrost_url_explorer_tx(data.processingTxHash)}` : ``}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            ) : isConfirmedTx ? (
                <>
                    <header className={styles.headerModal}>
                        {/* <SuccessIcon /> */}
                        <h2 className={styles.titleModal}>CONGRATULATIONS</h2>
                        <svg width="45" height="45" className={styles.icon} onClick={() => setShowProcessingTx(false)}>
                            <use href={CLOSE.href}></use>
                        </svg>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>We are thrilled to inform you that your recent transaction on our crypto app has been completed successfully!</p>
                            {processingTxHash !== undefined && processingTxHash !== '' ? (
                                <div className={styles.txHash}>
                                    <p className={styles.hash}>Tx Hash: {formatHash(data.processingTxHash)}</p>
                                    <CopyButton content={data.processingTxHash} />
                                    <OpenInNewTabButton
                                        url={appStore.siteSettings !== undefined ? `${appStore.siteSettings.getblockfrost_url_explorer_tx(data.processingTxHash)}` : ``}
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
                                        data.onNewTx?.();
                                    }}
                                    classNameStyle="fillb"
                                />
                            ) : null}
                            {othersButtonsWhenConfirmed}
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
                            <BtnGeneral text={nameForFinishButton} onClick={() => data.onFinishTx?.()} />
                        </div>
                    </div>
                </>
            ) : isFaildedTx ? (
                <>
                    <header className={styles.headerModal}>
                        {/* <FailedIcon /> */}
                        <h2 className={styles.titleModal}>SOMETHING WENT WRONG</h2>
                        <svg width="45" height="45" className={styles.icon} onClick={() => setShowProcessingTx(false)}>
                            <use href={CLOSE.href}></use>
                        </svg>
                    </header>
                    <div className={styles.txContainer}>
                        <div className={styles.textPart}>
                            <p className={styles.text}>We are very sorry to inform you that your recent transaction has failed! You can try again!</p>
                            <p className={styles.text}>{processingTxMessage}</p>
                        </div>
                        <div className={styles.btnGroup}>
                            {showTryAgainTransactionButton && <BtnGeneral text={nameForTryAgainButton} onClick={() => data.onTryAgainTx?.()} />}
                            {othersButtonsWhenFailed}
                            <BtnGeneral text={nameForFinishButton} onClick={() => data.onFinishTx?.()} />
                        </div>
                    </div>
                </>
            ) : null}
        </article>
    );
};

export default TxProcessingModal;
