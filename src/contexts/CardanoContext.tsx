import { getWallet, SimulatedBrowserWallet } from "@/HardCode/simulatedBrowserWallet";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

      /*
      TODO: usar BrowserWallet con meshjs
       */

interface CardanoContextType {
  wallet: SimulatedBrowserWallet | null;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => void;
  address: string | null;
  networkWalletId: number | null;
  isConnectedWallet: boolean;
}

interface StorageWalletInfo {
  address: string;
  walletName: string;
  networkWalletId: number;
  isConnectedWallet: boolean;
}

const CardanoContext = createContext<CardanoContextType | undefined>(undefined);

export const CardanoProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

  const [wallet, setWallet] = useState<SimulatedBrowserWallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [networkWalletId, setNetworkWalletId] = useState<number | null>(null);
  const [isConnectedWallet, setIsConnectedWallet] = useState<boolean>(false);

  const disconnectWallet = () => {
    setAddress(null);
    setNetworkWalletId(null);
    setIsConnectedWallet(false);
    setWallet(null);
    localStorage.removeItem('walletInfo');
  };

  const connectWallet = async (walletName: string) => {
    try {
      const wallet = await getWallet(walletName);
      const address = await wallet.getAddress();
      const networkWalletId = await wallet.getNetworkId();
      setAddress(address);
      setNetworkWalletId(networkWalletId);
      setIsConnectedWallet(true);
      setWallet(wallet);

      const walletInfo: StorageWalletInfo = {
        address,
        walletName,
        networkWalletId,
        isConnectedWallet: true,
      };

      localStorage.setItem('walletInfo', JSON.stringify(walletInfo));
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      disconnectWallet();
    }
  };



  useEffect(() => {
    const storedWalletInfo = localStorage.getItem('walletInfo');
    if (storedWalletInfo) {
      const walletInfo: StorageWalletInfo = JSON.parse(storedWalletInfo);
      connectWallet(walletInfo.walletName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    wallet,
    connectWallet,
    disconnectWallet,
    address,
    networkWalletId,
    isConnectedWallet
  };

  return (
    <CardanoContext.Provider value={contextValue}>
      {children}
    </CardanoContext.Provider>
  );
};

export const useCardano = () => {
  const context = useContext(CardanoContext);
  if (context === undefined) {
    throw new Error('useCardano must be used within a CardanoProvider');
  }
  return context;
};


