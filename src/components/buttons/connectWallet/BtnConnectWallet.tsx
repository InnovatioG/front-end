import { useCardano } from '@/contexts/CardanoContext';
import { useModal } from '@/contexts/ModalContext';
import { formatAddress } from '@/utils/formats';
import { ADA, WALLET_ICON } from '@/utils/images';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './BtnConnectWallet.module.scss';
import { useWalletStore } from 'smart-db';

interface BtnConnectProps {
    type: 'mobile' | 'primary' | 'secondary';
    width?: number;
}

interface SubComponentProps {
    openModal: () => void;
    address: string | null;
    disconnect: () => void;
    width?: number;
}

interface SecondarySubComponentProps {
    openModal: () => void;
    address: string | null;
    width?: number;
}

const BtnConnectMobile: React.FC<SubComponentProps> = ({ openModal, address, disconnect }) => {
    const walletStore = useWalletStore();

    const [showDisconnect, setShowDisconnect] = useState<boolean>(false);

    const handleClick = () => {
        if (walletStore.isConnected !== true) {
            openModal();
        } else {
            setShowDisconnect(!showDisconnect);
        }
    };

    return (
        <button className={`${styles.btnConnectMob} ${address !== null ? styles.connected : ''}`} onClick={handleClick}>
            <svg width="20" height="20" className={styles.icon}>
                <use href={WALLET_ICON}></use>
            </svg>
            {showDisconnect && address !== null && (
                <p className={styles.btnDisconnect} onClick={disconnect}>
                    Disconnect
                </p>
            )}
        </button>
    );
};

const BtnConnectPrimary: React.FC<SubComponentProps> = ({ openModal, address, disconnect, width }) => {
    const walletStore = useWalletStore();

    const [showDisconnect, setShowDisconnect] = useState<boolean>(false);

    const handleClick = () => {
        if (walletStore.isConnected !== true) {
            openModal();
        } else {
            setShowDisconnect(!showDisconnect);
        }
    };
    return (
        <button className={`${styles.BtnConnectPrimary} ${address !== null ? styles.connected : ''}`} onClick={handleClick} style={width ? { width: `${width}px` } : undefined}>
            {address === null ? (
                <p className={styles.text}>Connect wallet</p>
            ) : (
                <>
                    <Image width={22} height={22} src={ADA} alt="ada-logo" />
                    <p className={styles.text}>{formatAddress(address)}</p>
                </>
            )}
            {showDisconnect && address !== null && (
                <p className={styles.btnDisconnect} onClick={disconnect} style={width ? { width: `${width}px` } : undefined}>
                    Disconnect
                </p>
            )}
        </button>
    );
};

const BtnConnectSecondary: React.FC<SecondarySubComponentProps> = ({ openModal, address, width }) => {
    const walletStore = useWalletStore();

    const [showDisconnect, setShowDisconnect] = useState<boolean>(false);

    const handleClick = () => {
        if (walletStore.isConnected !== true) {
            openModal();
        } else {
            setShowDisconnect(!showDisconnect);
        }

    };

    return (
        <button className={`${styles.BtnConnectSecondary} ${address !== null ? styles.connected : ''}`} onClick={handleClick} style={width ? { width: `${width}px` } : undefined}>
            {address === null ? (
                <p className={styles.text}>Connect wallet</p>
            ) : (
                <>
                    <Image width={22} height={22} src={ADA} alt="ada-logo" />
                    <p className={styles.text}>{formatAddress(address)}</p>
                </>
            )}
        </button>
    );
};

const BtnConnectWallet: React.FC<BtnConnectProps> = ({ type, width }) => {
    const { openModal } = useModal();
    const { address, disconnectWallet } = useCardano();

    switch (type) {
        case 'mobile':
            return <BtnConnectMobile openModal={() => openModal('walletSelector')} address={address} disconnect={disconnectWallet} />;
        case 'primary':
            return <BtnConnectPrimary openModal={() => openModal('walletSelector')} address={address} disconnect={disconnectWallet} width={width} />;
        case 'secondary':
            return <BtnConnectSecondary openModal={() => openModal('walletSelector')} address={address} width={width} />;
        default:
            return null;
    }
};

export default BtnConnectWallet;
