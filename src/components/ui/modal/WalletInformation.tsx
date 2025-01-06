import React, { useState } from 'react';
import styles from "./WalletInformation.module.scss"
import { useSession, signOut } from 'next-auth/react';
import { REFRESH, HIDE, SHOW } from '@/utils/images';
import Image from 'next/image';
import { CARDANO_WALLETS } from 'smart-db';
import Toggle from '../buttons/toggle/Toggle';
import GeneralButtonUI from '../buttons/UI/Button';


interface WalletInformationModalProps {
    // Define props here
}

const WalletInformationModal: React.FC<WalletInformationModalProps> = (props) => {

    const { data: session } = useSession();

    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(true)
    const walletNameOrSeedOrKey = session?.user?.walletNameOrSeedOrKey;
    console.log("walletNameOrSeedOrKey", walletNameOrSeedOrKey);
    const icon = CARDANO_WALLETS.find(wallet => wallet.wallet === walletNameOrSeedOrKey)?.icon;
    const address = session?.user?.address;
    /*     const start = address?.slice(0, 20);
        const end = address?.slice(-1); */


    const handleCopy = () => {
        if (session?.user?.address) {
            navigator.clipboard.writeText(session.user.address)
                .then(() => {
                    setCopySuccess(true);
                    setTimeout(() => {
                        setCopySuccess(false);
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    };


    return (
        <article className={styles.container}>
            <div className={styles.layout}>
                <h2 className={styles.title}>Wallet Information</h2>
                <section className={styles.header}>
                    <div className={styles.headerIcon}>
                        <svg width="24" height="24" className={styles.icon}>
                            <use href={REFRESH}></use>
                        </svg>
                        <span>Refresh</span>
                    </div>
                    <div className={styles.headerIcon} onClick={() => { setShow(!show) }}>
                        <svg width="24" height="24" className={styles.icon}>

                            <use href={show ? HIDE : SHOW}></use>
                        </svg>
                        <span>{show ? "Hide Balance" : "Show Balance"}</span>
                    </div>
                    <div className={styles.headerIcon}>
                        <Toggle isActive={isAdmin} onClickToggle={() => { setIsAdmin(!isAdmin) }} disabled={false} transparent={true} />
                        <span>Admin</span>

                    </div>
                </section>
                <div className={styles.inputInformatiopn}>
                    <label htmlFor="">Address</label>
                    <div className={styles.addressContainer}>
                        <div className={styles.iconInput}>
                            {icon && <img src={icon.toString()} alt="icon" width={34} height={24} />}
                            <div className={styles.dataContainer}>
                                <span className={styles.wallet_address} >
                                    {address}
                                </span>
                            </div>
                        </div>
                        <div onClick={handleCopy}>
                            {copySuccess ? <img src="/img/icons/status/green.svg" alt="" height={12} width={15} /> : <img src="/img/icons/modal/copy.svg" alt="" height={12} width={15} />}
                        </div>

                    </div>
                </div>
                <div className={styles.buttonDisconectContainer}>
                    <GeneralButtonUI text='Disconect Wallet' classNameStyle='fillb' onClick={signOut} />
                </div>
            </div>
        </article>
    );
}

export default WalletInformationModal;