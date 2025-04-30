import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';
import { useModal } from '@/contexts/ModalContext';
import React, { useEffect, useState } from 'react';
import { CLOSE, formatAmountWithUnit, Token_With_Metadata_And_Amount, useAppStore, useTokensStore, useTokensStoreGeneral, useWalletStore } from 'smart-db';
import TokenLogo from 'smart-db/dist/Components/TokenLogoWithCircle/TokenLogoWithCircle';
import styles from './TxUserConfirmationModal.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';

interface TxUserConfirmationModalProps {
    // Define props here
}

export interface TxUserConfirmationModalData {
    title?: string;
    isValidTx: boolean;
    btnTxInvalidName?: string;
    showExtraInfo?: boolean;
    extraInfo?: React.ReactNode;
    onConfirm: () => Promise<void>;
    onCancel: () => Promise<void>;
}

const TxUserConfirmationModal: React.FC<TxUserConfirmationModalProps> = (props) => {
    const { closeModal, modalData } = useModal();
    const data = modalData as TxUserConfirmationModalData;
    const { title, isValidTx, btnTxInvalidName, showExtraInfo, extraInfo, onConfirm, onCancel } = data;
    //--------------------------------------
    const tokensStore = useTokensStore();
    const walletStore = useWalletStore();
    const appStore = useAppStore();
    //--------------------------------------
    const [isConfirming, setIsConfirming] = useState(false);
    //--------------------------------------
    const { isTokensStoreReady, isTokensStoreLoading, setTokensToGet, tokensFromStore } = useTokensStoreGeneral({
        name: 'TxUserConfirmation',
        tokensToGet: undefined,
        conditionInit: () => {
            return true;
        },
        dependenciesInit: [],
        followUp: undefined,
        keepAlive: undefined,
        swAddPrice: true,
        swAddMetadata: true,
        initPriceUpdater: false,
        swHandleCreateJob: true,
    });
    //--------------------------------------
    useEffect(() => {
        //--------------------------------------
        const tokensAll = [...appStore.tokensGiveWithMetadata, ...appStore.tokensGetWithMetadata];
        //--------------------------------------
        setTokensToGet(tokensAll);
        //--------------------------------------
    }, [appStore.tokensGiveWithMetadata, appStore.tokensGetWithMetadata]);
    //--------------------------------------
    useEffect(() => {
        if (isTokensStoreReady === true) {
            const tokensGiveWithMetadata = appStore.tokensGiveWithMetadata.map((token) => {
                const tokenWithMetadata = tokensStore.getTokenPriceAndMetadata(token.CS, token.TN_Hex);
                return { ...tokenWithMetadata, ...token };
            });
            appStore.setTokensGiveWithMetadata(tokensGiveWithMetadata);
            //--------------------------------------
            const tokensGetWithMetadata = appStore.tokensGetWithMetadata.map((token) => {
                const tokenWithMetadata = tokensStore.getTokenPriceAndMetadata(token.CS, token.TN_Hex);
                return { ...tokenWithMetadata, ...token };
            });
            appStore.setTokensGetWithMetadata(tokensGetWithMetadata);
            //--------------------------------------
        }
    }, [isTokensStoreReady]);
    //--------------------------------------
    const onCancelHandle = async () => {
        setIsConfirming(false);
        await onCancel();
    };
    const onConfirmHandle = async () => {
        setIsConfirming(true);
        await onConfirm();
    };

    function formatTicker(ticker: string | undefined): React.ReactNode {
        throw new Error('Function not implemented.');
    }

    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            <header className={styles.headerModal}>
                <h2 className={styles.titleModal}>{title !== undefined ? title : 'YOUR TRANSACTION'}</h2>
                <svg width="45" height="45" className={styles.icon} onClick={() => onCancelHandle()}>
                    <use href={CLOSE.href}></use>
                </svg>
            </header>
            <div className={styles.txContainer}>
                {/* {fund !== undefined && (
                            <div className={styles.fundContainer}>
                                <div className={styles.tokensGroup}>
                                    <InvestUnitSmall investUnitWithDetails={fund.investUnit} />
                                </div>
                                <h3 className={styles.fundName}>
                                    {fund.name} [{hexToStr(fund.fdFundFT_TN_Hex)}]
                                </h3>
                            </div>
                        )} */}
                {((appStore.tokensGiveWithMetadata !== undefined && appStore.tokensGiveWithMetadata.length > 0) || (appStore.tokensGetWithMetadata !== undefined && appStore.tokensGetWithMetadata.length > 0)) && (
                    <div className={styles.txContainerTokenAndInfoPart}>
                        {isTokensStoreLoading === false && appStore.tokensGiveWithMetadata !== undefined && appStore.tokensGiveWithMetadata.length > 0 ? (
                            <div className={styles.tokensSection}>
                                <div className={styles.valueGroup}>
                                    <h3 className={styles.valueTitle}>Tokens you give:</h3>
                                    <div className={`${styles.tokensContainer} ${appStore.tokensGiveWithMetadata.length > 2 && styles.needScroll}`}>
                                        {appStore.tokensGiveWithMetadata.map((token, index) => (
                                            <div className={styles.inputGroup} key={index}>
                                                <div className={styles.token}>
                                                    {isTokensStoreReady === false ? (
                                                        <div className={styles.tokenLogo}>
                                                            <LoaderDots />
                                                        </div>
                                                    ) : (
                                                        <TokenLogo token={token} showBorder={false} />
                                                    )}
                                                    <h3 className={styles.tokenName}>{formatTicker(token.ticker)}</h3>
                                                </div>
                                                <div className={styles.input}>{formatAmountWithUnit(token.amount, '', token.decimals, false, token.decimals)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : isTokensStoreLoading === true && appStore.tokensGiveWithMetadata.length > 0 ? (
                            <div className={styles.tokensSection}>
                                <div className={styles.valueGroup}>
                                    <h3 className={styles.valueTitle}>Tokens you give:</h3>
                                    <LoaderDots />
                                </div>
                            </div>
                        ) : null}
                        {isTokensStoreLoading === false && appStore.tokensGetWithMetadata !== undefined && appStore.tokensGetWithMetadata.length > 0 ? (
                            <div className={styles.tokensSection}>
                                <div className={styles.valueGroup}>
                                    <h3 className={styles.valueTitle}>Tokens you get:</h3>
                                    <div className={`${styles.tokensContainer} ${appStore.tokensGetWithMetadata.length > 2 && styles.needScroll}`}>
                                        {appStore.tokensGetWithMetadata.map((token, index) => (
                                            <div className={styles.inputGroup} key={index}>
                                                <div className={styles.token}>
                                                    {isTokensStoreReady === false ? (
                                                        <div className={styles.tokenLogo}>
                                                            <LoaderDots />
                                                        </div>
                                                    ) : (
                                                        <TokenLogo token={token} showBorder={false} />
                                                    )}
                                                    <h3 className={styles.tokenName}>{formatTicker(token.ticker)}</h3>
                                                </div>
                                                <div className={styles.input}>{formatAmountWithUnit(token.amount, '', token.decimals, false, token.decimals)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : isTokensStoreLoading === true && appStore.tokensGetWithMetadata.length > 0 ? (
                            <div className={styles.tokensSection}>
                                <div className={styles.valueGroup}>
                                    <h3 className={styles.valueTitle}>Tokens you get:</h3>
                                    <LoaderDots />
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
                {showExtraInfo === true && <div className={styles.extraInfo}>{extraInfo}</div>}
                {isTokensStoreLoading === false &&
                    appStore.tokensGiveWithMetadata !== undefined &&
                    appStore.tokensGiveWithMetadata.length === 0 &&
                    appStore.tokensGetWithMetadata !== undefined &&
                    appStore.tokensGetWithMetadata.length === 0 && (
                        <>
                            <div className={styles.infoText}>
                                This transaction does not involve token transfers. It is solely responsible for updating, consuming, or deleting a datum.
                            </div>
                        </>
                    )}
                {/* <div className={styles.infoText}>
                        <p className={styles.textSmall}>
                                Please note, extra {ADA_UI_LETTERS} will be added to cover transaction fees and to secure the UTxO. Final amounts of tokens will be visible on your
                                wallet&lsquo;s transaction confirmation poput.
                            </p> */}
                {/* <p className={styles.textSmall}>When you consume those UTxOs, you will receive the extra {ADA_UI_LETTERS} previously secured within those UTxOs.</p> 
                            </div> */}
                {/* <div className={styles.textQuestion}>Do you want to confirm this Transaction?</div> */}
            </div>
            <div className={styles.btnGroup}>
                {isConfirming === true ? (
                    <BtnGeneral
                        text="PREPARING..."
                        disabled={true}
                        onClick={() => {
                            return;
                        }}
                    >
                        <LoaderDots />
                    </BtnGeneral>
                ) : isValidTx === true || isTokensStoreLoading === true ? (
                    <>
                        <BtnGeneral
                            text="Confirm Transaction"
                            onClick={() => {
                                onConfirmHandle();
                            }}
                            disabled={isTokensStoreReady === false}
                        ></BtnGeneral>
                        <BtnGeneral text="Cancel" onClick={() => onCancelHandle()}></BtnGeneral>
                    </>
                ) : (
                    <BtnGeneral text={btnTxInvalidName !== undefined ? btnTxInvalidName : 'Close'} onClick={() => onCancelHandle()}></BtnGeneral>
                )}
            </div>
        </article>
    );
};

export default TxUserConfirmationModal;
