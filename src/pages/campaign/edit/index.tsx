import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import CampaignHeader from '@/components/campaign/campaignHeader/CampaignHeader';
import styles from "../[id]/campainPagelayout.module.scss";
import CampaignDashCreation from '@/components/campaign/campaignHeader/CampaignDash';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ProjectEditionContainer from '@/components/campaign/creator/projectEditionContainer/ProjectEditionContainer';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { usePathname } from 'next/navigation';

import ButtonSaveDraftContainer from '@/components/campaign/creator/projectEditionContainer/GeneralbuttonContainer';
//! TODO DO MIDDLEWARE CHECK IF IS ADMIN FOR EDITING CAMPAIGN

interface CampaignByIndexProps {
    // Define props aquí si es necesario
}

const CampaignByIndex: React.FC<CampaignByIndexProps> = (props) => {
    const router = useRouter();
    const { id, menuview } = router.query;

    console.log(menuview)

    const { setProject, project, editionMode, setIsLoading, isLoading, setMenuView } = useProjectDetailStore();

    useEffect(() => {
        setIsLoading(true);

        if (id) {
            const campaignId = Number(id);
            const campaign = JSON.find((camp) => camp.id === campaignId);

            if (campaign) {
                setProject(campaign);
            }

            if (menuview) {
                setMenuView(menuview);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [id, setProject]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <main className={styles.layout}>
            {project.id !== 0 ? (
                <div className={styles.campaignContainerCreator}>
                    <CampaignHeader />
                    <CampaignDashCreation styles={styles} />
                    <ProjectEditionContainer />
                    <ButtonSaveDraftContainer />
                </div>
            ) : (
                <p>Campaign not found</p>
            )}
        </main>
    );
}

export default CampaignByIndex;