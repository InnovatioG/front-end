import { useScreenSize } from "@/hooks/useScreenSize";
import { useCampaignStore } from "@/store/campaign/useCampaignStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ROUTES } from '@/utils/routes';
import { useEffect } from "react";
import { useWalletStore } from "smart-db";
import { useModal } from "@/contexts/ModalContext";

const useNew = () => {
    const screenSize = useScreenSize();
    const router = useRouter();
    const { step, setStep, setUser, isLoading, setCategoryId, setIsLoading, newCampaign } = useCampaignStore();
    const walletStore = useWalletStore();
    const { openModal } = useModal()

    console.log(walletStore.info?.address)


    useEffect(() => {
        if (walletStore.info?.address === undefined) {
            openModal('walletSelector')

        }
    }, [walletStore.info?.address])


    const handleClickBack = () => {
        if (step === 1) {
            router.push(ROUTES.draft);
        } else {
            setStep((step - 1) as 1 | 2 | 3 | 4);
        }
    };


    return {
        step,
        setStep,
        setUser,
        isLoading,
        setCategoryId,
        setIsLoading,
        newCampaign,
        handleClickBack
    }

}



export default useNew