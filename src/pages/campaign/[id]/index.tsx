import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import styles from "./campainPagelayout.module.scss";
import CampaignHeader from '@/components/CampaignDashboard/sections/campaignHeader/CampaignHeader';
import CampaignDashCreation from '@/components/CampaignDashboard/sections/campaignHeader/CampaignDash';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ProjectContainer from '@/components/CampaignId/sections/ProjectContainer';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useSession } from 'next-auth/react';
import CampaignButtonContainer from './campainButtonsContainer';
import GeneralError from '@/components/General/elements/errors/GeneralError';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';


interface CampaignVisualizationProps {
    // Define props here
}

const CampaignVisualization: React.FC<CampaignVisualizationProps> = (props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const { project, setProject, setEditionMode, isLoading, setIsLoading, setIsAdmin, isAdmin } = useProjectDetailStore();
    const { campaignCategories } = useGeneralStore();

    useEffect(() => {
        setIsLoading(true);
        setEditionMode(false);

        if (id) {
            const campaign_id = Number(id);
            const campaign: any = JSON.campaigns.find((camp: any) => camp.id === campaign_id);
            const user: any = JSON.users.find((user: any) => user.wallet_address === session?.user?.address);

            if (campaign) {
                setProject({
                    ...campaign,
                    status: 'status' in campaign ? (campaign as { status: string }).status : 'default status',
                    cdRequestedMaxADA: campaign.cdRequestedMaxADA ?? null,
                    cdCampaignToken_TN: campaign.cdCampaignToken_TN ?? '',
                    members_team: campaign.members_team.map((member: any) => ({
                        ...member,
                        member_manage_founds: member.member_manage_founds ?? false,
                        member_wallet_address: member.member_wallet_address ?? '',
                    })),
                    milestones: campaign.milestones.map((milestone: any) => ({
                        ...milestone,
                        milestone_status: {
                            ...milestone.milestone_status,
                            id: milestone.milestone_status?.id ?? 0, // Asegurarse de que id no sea undefined
                        },
                    })),
                });
                setIsAdmin(campaign.craetor_wallet_id === user?.id);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [id, setProject, setIsAdmin, session?.user?.address]);


    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <main className={styles.layout}>
            {project.id !== 0 ? (
                <div className={styles.campaignContainerCreator}>
                    <CampaignHeader />
                    <CampaignDashCreation />
                    <ProjectContainer />
                </div>
            ) : (
                <GeneralError message='Project not found' />
            )}

            <CampaignButtonContainer />
        </main>
    );
}

export default CampaignVisualization;