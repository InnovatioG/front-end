import JSON from '@/HardCode/campaignId.json';
import ButtonSaveDraftContainer from '@/components/CampaignCreation/Elements/GeneralbuttonContainer';
import ProjectEditionContainer from '@/components/CampaignCreation/Elements/ProjectEditionContainer';
import CampaignDashCreation from '@/components/CampaignDashboard/Sections/CampaignHeader/CampaignDash';
import CampaignHeader from '@/components/CampaignDashboard/Sections/CampaignHeader/CampaignHeader';
import GeneralError from '@/components/General/Elements/Errors/GeneralError';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../[id]/campainPagelayout.module.scss';
import { useCampaignId } from '@/hooks/useProjectDetail';

interface CampaignByIndexProps {
    // Define props aquí si es necesario
}

const errorMessages = {
    notFound: 'Campaign not found',
    noPermission: 'You do not have permission to edit this campaign.',
};

const CampaignByIndex: React.FC<CampaignByIndexProps> = (props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { id, menuview } = router.query;
    const { setCampaign, campaign, setIsLoading, isLoading, setMenuView, setEditionMode, } = useCampaignIdStore();
    const [error, setError] = useState<string | null>(null);
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







/* const fetchCampaign = () => {
       setIsLoading(true);
       setEditionMode(true);
       if (id) {
           const campaign_id = Number(id);
           const campaign: any = JSON.campaigns.find((camp) => camp.id === campaign_id);
           if (campaign) {
               const user = JSON.users.find((user) => user.wallet_address === session?.user?.address);
               if (user && user.id === campaign.creator_wallet_id) {
                   setCampaign(campaign);
                   setError(null);
               } else {
                   setError(errorMessages.noPermission);
               }
           } else {
               setError(errorMessages.notFound);
           }

           if (menuview) {
               if (typeof menuview === 'string' && ['Project Detail', 'Resume of the team', 'Roadmap & Milestones', 'Tokenomics', 'Q&A'].includes(menuview)) {
                   setMenuView(menuview as 'Project Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A');
               }
           }
       }

       const timer = setTimeout(() => {
           setIsLoading(false);
       }, 2000);

       return () => clearTimeout(timer);
   }; */
