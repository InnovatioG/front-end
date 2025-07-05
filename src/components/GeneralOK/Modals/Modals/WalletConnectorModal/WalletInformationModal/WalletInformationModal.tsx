import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { HIDE_ICON, REFRESH_ICON, SHOW_ICON } from '@/utils/constants/images';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
    addAssets,
    CARDANO_WALLETS,
    isEmulator,
    LucidToolsFrontEnd,
    PROYECT_NAME,
    pushSucessNotification,
    toJson,
    TOKEN_ADA_SYMBOL,
    TOKEN_ADA_TICKER,
    useWalletActions,
} from 'smart-db';
import styles from './WalletInformationModal.module.scss';
import Toggle from '@/components/General/Buttons/Toggle/Toggle';
import { Assets, UTxO } from '@lucid-evolution/lucid';

interface WalletInformationModalProps {
    // Define props here
}

const WalletInformationModal: React.FC<WalletInformationModalProps> = (props) => {
    //--------------------------------------
    //  const { closeModal } = useModal();
    const closeModal = undefined;
    //--------------------------------------
    const { session, walletStore, createSignedSession, walletRefresh, walletDisconnect, handleClickToggleAdminMode, handleToggleIsHide } = useWalletActions();
    //--------------------------------------
    const [copySuccess, setCopySuccess] = useState<string | undefined>(undefined);
    const [walletName, setWalletName] = useState<string | undefined>();
    const [icon, setIcon] = useState<string | undefined>();
    const [balance, setBalance] = useState<bigint | undefined>();

    useEffect(() => {
        if (walletStore.isConnected !== true) return;
        const walletInfo = CARDANO_WALLETS.find((wallet) => walletStore.info?.walletName !== undefined && wallet.wallet === walletStore.info?.walletName);
        setWalletName(walletStore.info?.walletName);
        setIcon(walletInfo?.icon.href ?? CARDANO_WALLETS[0].icon.href);
    }, [walletStore.isConnected]);

    useEffect(() => {
        if (walletStore.isWalletDataLoaded !== true) return;
        const fetchedBalance = walletStore.getTotalOfUnit('lovelace', true);
        setBalance(fetchedBalance);
    }, [walletStore.isWalletDataLoaded]);

    const handleCopy = (str: string) => {
        if (!str) return;

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            navigator.clipboard
                .writeText(str)
                .then(() => {
                    console.log(`[COPY] Copied string: \`${str}\``);
                    setCopySuccess(str);
                    setTimeout(() => setCopySuccess(undefined), 2000);
                })
                .catch((err) => {
                    console.error(`[COPY] Failed to copy string: \`${str}\``, err);
                });
        } else {
            console.warn(`[COPY] Clipboard API not available. Cannot copy string: \`${str}\``);
        }
    };

    const handleBtnGetADATx = async () => {
        //--------------------------------------
        const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
        //--------------------------------------
        const amount = 100_000_000_000n;
        //--------------------------------------
        const valueOf_ADA: Assets = { ['lovelace']: BigInt(amount) };
        //--------------------------------------
        const uTxOsAtWallet: UTxO[] = walletTxParams.utxos;
        if (uTxOsAtWallet.length === 0) {
            throw `Invalid uTxOsAtWallet length = 0`;
        }
        //--------------------------------------
        const uTxO: UTxO = uTxOsAtWallet[0];
        //--------------------------------------
        const assets: Assets = ((lucid.config().provider as any).ledger[uTxO.txHash + uTxO.outputIndex].utxo as UTxO).assets as Assets;
        ((lucid.config().provider as any).ledger[uTxO.txHash + uTxO.outputIndex].utxo as UTxO).assets = addAssets(assets, valueOf_ADA);
        //--------------------------------------
        pushSucessNotification(`${PROYECT_NAME}`, `User Get ${TOKEN_ADA_TICKER} Tx`, false);
        //--------------------------------------
        if (isEmulator && emulatorDB !== undefined) {
            // normalmente esto se hace en el submit, pero esta tx es mock y no hay submit
            await LucidToolsFrontEnd.syncEmulatorAfterTx(lucid, emulatorDB);
        }
        //--------------------------------------
        await walletStore.loadWalletData();
        //--------------------------------------
        return true;
    };

    return (
        <article className={styles.container}>
            <div className={styles.layout}>
                <h2 className={styles.title}>Wallet [{walletName}] Information</h2>
                <section className={styles.header}>
                    <div
                        className={styles.headerIcon}
                        onClick={() => {
                            walletRefresh();
                        }}
                    >
                        <svg width="24" height="24" className={styles.icon}>
                            <use href={REFRESH_ICON}></use>
                        </svg>
                        <span>Refresh</span>
                    </div>
                    <div
                        className={styles.headerIcon}
                        onClick={() => {
                            handleToggleIsHide();
                        }}
                    >
                        <svg width="24" height="24" className={styles.icon}>
                            <use href={walletStore.swHideBalance ? HIDE_ICON : SHOW_ICON}></use>
                        </svg>
                        <span>{walletStore.swHideBalance ? 'Hide Balance' : 'Show Balance'}</span>
                    </div>
                    {/* <div className={styles.toogleIcon}>
                        <Toggle
                            isActive={walletStore.info?.isWalletValidatedWithSignedToken || false}
                            onClickToggle={() => {
                                handleClickToggleAdminMode();
                            }}
                            disabled={false}
                            transparent={true}
                        />
                        <span>Admin</span>
                    </div> */}
                </section>
                <div className={styles.inputInformatiopn}>
                    <label htmlFor="">Address</label>
                    <div className={styles.addressContainer}>
                        <div className={styles.iconInput}>
                            {icon && <Image src={icon.toString()} alt="icon" width={34} height={24} />}
                            <div className={styles.dataContainer}>
                                <span className={styles.wallet_address} title={session?.user?.address || ''}>{session?.user?.address || ''}</span>
                            </div>
                        </div>
                        <div onClick={() => handleCopy(session?.user?.address || '')}>
                            {copySuccess === session?.user?.address ? (
                                <Image src="/img/icons/status/green.svg" alt="" height={12} width={15} />
                            ) : (
                                <Image src="/img/icons/modal/copy.svg" alt="" height={12} width={15} />
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.inputInformatiopn}>
                    <label htmlFor="">Payment Pub Key Hash</label>
                    <div className={styles.addressContainer}>
                        <div className={styles.iconInput}>
                            <div className={styles.dataContainer}>
                                <span className={styles.wallet_pkh} title={walletStore.info?.pkh}>{walletStore.info?.pkh}</span>
                            </div>
                        </div>
                        <div onClick={() => handleCopy(walletStore.info?.pkh || '')}>
                            {copySuccess === walletStore.info?.pkh ? (
                                <Image src="/img/icons/status/green.svg" alt="" height={12} width={15} />
                            ) : (
                                <Image src="/img/icons/modal/copy.svg" alt="" height={12} width={15} />
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.inputInformatiopn}>
                    <label htmlFor="">Balance</label>
                    <div className={styles.addressContainer}>
                        <div className={styles.iconInput}>
                            <div className={styles.dataContainer}>
                                <span className={styles.wallet_address}>
                                    {walletStore.swHideBalance === true ? `*** ₳` : `${balance !== undefined ? (balance / 1000000n).toLocaleString() : '...'} ₳`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {walletStore.isCoreTeam() && (
                    <div className={styles.inputInformatiopn}>
                        <label htmlFor="">Core Team</label>
                    </div>
                )}
                <div className={styles.buttonDisconectContainer}>
                    {isEmulator && (
                        <BtnGeneral
                            text="Get TEST ADA"
                            classNameStyle="fillb"
                            onClick={() => {
                                handleBtnGetADATx();
                            }}
                        />
                    )}
                    <BtnGeneral
                        text="Disconect Wallet"
                        classNameStyle="fillb"
                        onClick={() => {
                            walletDisconnect(closeModal);
                        }}
                    />
                </div>
            </div>
        </article>
    );
};

export default WalletInformationModal;
