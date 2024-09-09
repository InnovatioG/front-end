import { useModal } from "@/contexts/ModalContext";
import { WalletSelectorModal } from "./modals/WalletSelectorModal";

export const ModalManager: React.FC = () => {
  const { modalType } = useModal();

  if(!modalType) return null;

  const ModalComponent = {
    walletSelector: WalletSelectorModal,
  }[modalType];

  return <ModalComponent />;
}