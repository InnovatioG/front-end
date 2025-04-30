import { useWalletActions } from 'smart-db';
import styles from './WalletConnectorModal.module.scss';
import WalletInformationModal from './WalletInformationModal/WalletInformationModal';
import { WalletSelectorModal } from './WalletSelectorModal/WalletSelectorModal';

const WalletConnectorModal: React.FC = () => {
    const { walletStore } = useWalletActions();

    return <div className={styles.container}>{walletStore.isConnected ? <WalletInformationModal /> : <WalletSelectorModal />}</div>;
};

export default WalletConnectorModal;
