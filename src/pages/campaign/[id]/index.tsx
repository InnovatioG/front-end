import CampaignDashCreation from '@/components/CampaignDashboard/Sections/CampaignHeader/CampaignDash';
import CampaignHeader from '@/components/CampaignDashboard/Sections/CampaignHeader/CampaignHeader';
import ProjectContainer from '@/components/CampaignId/Sections/projectContainer/ProjectContainer';
import GeneralError from '@/components/General/Elements/Errors/GeneralError';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import CampaignButtonContainer from './campainButtonsContainer';
import styles from './campainPagelayout.module.scss';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { set } from 'date-fns';
import { pushWarningNotification } from 'smart-db';
import { useCampaignId } from '@/hooks/useProjectDetail';

interface CampaignVisualizationProps {
    // Define props here
}

const CampaignVisualization: React.FC<CampaignVisualizationProps> = (props) => {
    const router = useRouter();
    const { id } = router.query;
    const { campaign, isLoading, setIsLoading, setIsAdmin, isAdmin } = useCampaignIdStore();
    const { fetchCampaigns } = useCampaignId();

    useEffect(() => {
        if (id) {
            const campaignIds = Array.isArray(id) ? id : [id];
            fetchCampaigns(campaignIds);
        }
    }, []);

    if (isLoading === true) {
        return <LoadingPage />;
    }

    return (
        <main className={styles.layout}>
            {campaign._DB_id !== undefined ? (
                <div className={styles.campaignContainerCreator}>
                    <CampaignHeader />
                    <CampaignDashCreation />
                    <ProjectContainer />
                </div>
            ) : (
                <GeneralError message="Project not found" />
            )}

            <CampaignButtonContainer />
        </main>
    );
};

export default CampaignVisualization;

/*
    useEffect(() => {
        setIsLoading(true);
        setEditionMode(false);
 
        if (id) {
            const campaign_id = Number(id);
            const campaign: any = JSON.campaigns.find((camp: any) => camp.id === campaign_id);
            const user: any = JSON.users.find((user: any) => user.wallet_address === session?.user?.address);
 
            if (campaign) {
                setCampaign({
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
 
*/
