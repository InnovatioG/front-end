import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CardanoWallet, useWalletActions } from 'smart-db';

interface CardanoContextType {
    wallet: CardanoWallet | null;
    connectWallet: (wallet: CardanoWallet) => Promise<void>;
    disconnectWallet: () => void;
    address: string | null;
    network: string | null;
    isConnectedWallet: boolean;
}

const CardanoContext = createContext<CardanoContextType | undefined>(undefined);

export const CardanoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wallet, setWallet] = useState<CardanoWallet | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [network, setNetwork] = useState<string | null>(null);
    const [isConnectedWallet, setIsConnectedWallet] = useState<boolean>(false);

    const { status, walletStore, createSignedSession, walletConnect, walletFromSeedConnect, walletFromKeyConnect, walletInstall, walletSelected, walletDisconnect } =
        useWalletActions();

    const disconnectWallet = () => {
        walletDisconnect();
    };

    const connectWallet = async (wallet: CardanoWallet) => {
        try {
            await walletConnect(wallet, createSignedSession, true, false, true);
        } catch (err) {
            console.error('Failed to connect wallet:', err);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            if (walletStore.isConnected === true && walletStore.info !== undefined) {
                const address = walletStore.info.address;
                const network = walletStore.info.network;
                setAddress(address);
                setNetwork(network);
                setIsConnectedWallet(true);
                setWallet(wallet);

                localStorage.setItem('walletInfo', JSON.stringify(walletStore.info));
            } else {
                setAddress(null);
                setNetwork(null);
                setIsConnectedWallet(false);
                setWallet(null);
                localStorage.removeItem('walletInfo');
            }
        };
        fetch();
    }, [walletStore.isConnected, walletStore.info]);

    const contextValue = {
        wallet,
        connectWallet,
        disconnectWallet,
        address,
        network,
        isConnectedWallet,
    };

    return <CardanoContext.Provider value={contextValue}>{children}</CardanoContext.Provider>;
};

export const useCardano = () => {
    const context = useContext(CardanoContext);
    if (context === undefined) {
        throw new Error('useCardano must be used within a CardanoProvider');
    }
    return context;
};
