import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import CampaignHeader from '@/components/campaign/campaignHeader/CampaignHeader';
import styles from "../[id]/campainPagelayout.module.scss";
import CampaignDashCreation from '@/components/campaign/campaignHeader/CampaignDash';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ProjectEditionContainer from '@/components/campaign/creator/projectEditionContainer/ProjectEditionContainer';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useSession } from 'next-auth/react';
import ButtonSaveDraftContainer from '@/components/campaign/creator/projectEditionContainer/GeneralbuttonContainer';
import GeneralError from '@/components/errors/GeneralError';

interface CampaignByIndexProps {
    // Define props aquí si es necesario
}

const errorMessages = {
    notFound: "Campaign not found",
    noPermission: "You do not have permission to edit this campaign.",
};

const CampaignByIndex: React.FC<CampaignByIndexProps> = (props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { id, menuview } = router.query;

    const { setProject, project, setIsLoading, isLoading, setMenuView, fetchAdaPrice } = useProjectDetailStore();
    const [error, setError] = useState<string | null>(null);

    const fetchCampaign = () => {
        setIsLoading(true);
        fetchAdaPrice();

        if (id) {
            const campaignId = Number(id);
            const campaign = JSON.campaigns.find((camp) => camp.id === campaignId);

            if (campaign) {
                const user = JSON.users.find(user => user.wallet_address === session?.user?.address);
                if (user && user.id === campaign.user_id) {
                    setProject(campaign);
                    setError(null);
                } else {
                    setError(errorMessages.noPermission);
                }
            } else {
                setError(errorMessages.notFound);
            }

            if (menuview) {
                setMenuView(menuview);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    };

    useEffect(() => {
        fetchCampaign();
    }, [id, setProject, fetchAdaPrice, setIsLoading, setMenuView, menuview, session]);


    if (isLoading) {
        return <LoadingPage />;
    }

    if (error) {
        return <GeneralError message={error} />;
    }

    return (
        <main className={styles.layout}>
            <div className={styles.campaignContainerCreator}>
                <CampaignHeader />
                <CampaignDashCreation styles={styles} />
                <ProjectEditionContainer />
                <ButtonSaveDraftContainer />
            </div>
        </main>
    );
}

export default CampaignByIndex;

