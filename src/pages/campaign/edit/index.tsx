import ButtonSaveDraftContainer from '@/components/General/Elements/GeneralButtonContainer/GeneralbuttonContainer';
import ProjectEditionContainer from '@/components/CampaignId/Elements/CampaignEditionContainer/CampaignEditionContainer';
import CampaignDashCreation from '@/components/CampaignDashboard/Sections/CampaignDash/CampaignDash';
import CampaignHeader from '@/components/CampaignDashboard/Sections/CampaignHeader/CampaignHeader';
import GeneralError from '@/components/General/Elements/Errors/GeneralError';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../[id]/campainPagelayout.module.scss';
import { useCampaignId } from '@/hooks/useCampaignDetail';

interface CampaignByIndexProps {
    // Define props aquí si es necesario
}

const errorMessages = {
    notFound: 'Campaign not found',
    noPermission: 'You do not have permission to edit this campaign.',
};

const CampaignByIndex: React.FC<CampaignByIndexProps> = (props) => {
    const router = useRouter();
    const { id } = router.query;
    const { isLoading } = useCampaignIdStore();
    const [error] = useState<string | null>(null);
    const { fetchCampaigns } = useCampaignId();



    useEffect(() => {
        if (id) {
            const campaignIds = Array.isArray(id) ? id : [id];
            fetchCampaigns(campaignIds);

        }

    }, []);

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
                <CampaignDashCreation />
                <ProjectEditionContainer />
                <ButtonSaveDraftContainer />
            </div>
        </main>
    );
};

export default CampaignByIndex;




