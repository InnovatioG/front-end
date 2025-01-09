import { useState, useEffect } from 'react';
import { CampaignApi, CampaignMemberApi, MilestoneApi } from '@/lib/SmartDB/FrontEnd';
import { pushWarningNotification } from 'smart-db';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { MilestoneEntity, CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import type { Campaign, Milestone, MembersTeam } from '@/types/types';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import { set } from 'date-fns';
import { ca } from 'date-fns/locale';
import { CampaignStatus } from '@/utils/constants/status';
export const useNewDashboardCard = (address: string | null) => {
    const { campaignStatus } = useGeneralStore();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [stateFilter, setStateFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [myProposal, setMyProposal] = useState(false);
    const transformToBaseCampaign = async (campaign: CampaignEntity): Promise<Campaign> => {
        const milestonesEntities: MilestoneEntity[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const membersTeamEntities: CampaignMemberEntity[] = await CampaignMemberApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const members_team: MembersTeam[] = membersTeamEntities.map((member) => ({
            id: member._DB_id,
            campaign_id: member.campaign_id,
            name: member.name,
            last_name: member.last_name,
            role: member.role,
            admin: member.admin,
            email: member.email,
            wallet_id: member.wallet_id,
            wallet_address: member.wallet_address,
            website: member.website,
            instagram: member.instagram,
            facebook: member.facebook,
            discord: member.discord,
            twitter: member.twitter,
        }));

        const milestones: Milestone[] = milestonesEntities.map((milestone) => ({
            campaign_id: milestone.campaign_id,
            milestone_status_id: milestone.milestone_status_id,
            estimate_delivery_days: milestone.estimate_delivery_days,
            estimate_delivery_date: milestone.estimate_delivery_date,
            percentage: milestone.percentage,
            description: milestone.description,
            createdAt: milestone.createdAt.toISOString(),
            updatedAt: milestone.updatedAt?.toISOString() || '',
        }));

        return {
            _DB_id: campaign._DB_id,
            creator_wallet_id: campaign.creator_wallet_id,
            name: campaign.name,
            description: campaign.description,
            campaign_status_id: campaign.campaign_status_id,
            banner_url: campaign.banner_url,
            logo_url: campaign.logo_url,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            investors: campaign.investors,
            requestMaxAda: campaign.requestedMaxADA,
            campaing_category_id: campaign.campaing_category_id,
            requestMinAda: campaign.requestedMinADA,
            website: campaign.website,
            facebook: campaign.facebook,
            instagram: campaign.instagram,
            discord: campaign.discord,
            twitter: campaign.twitter,
            milestones,
            members_team,
            begin_at: campaign.begin_at,
            deadline: campaign.deadline,
            cdFundedADA: campaign.cdFundedADA,
            tokenomics_description: campaign.tokenomics_description,
        };
    };

    //! TODO MOMENTANEO

    /* const data: CampaignEntity[] = await CampaignApi.getByParamsApi_({ campaign_status_id: { $gte: 8, $ne: 10 } }, { limit: 10 }); */
    const fetchCampaigns = async () => {
        /* 
        
        */
        try {
            const campaignStatusRequiredList = [
                CampaignStatus.COUNTDOWN,
                CampaignStatus.FUNDRAISING,
                CampaignStatus.ACTIVE,
                CampaignStatus.FAILED,
                CampaignStatus.UNREACHED,
                CampaignStatus.SUCCESS,
            ];

            const campaignStatusRequiered = campaignStatus.filter((status) => campaignStatusRequiredList.includes(status.id_internal));
            const campaignStatusIds = campaignStatusRequiered.map((status) => status.id);
            const filterData = {
                campaign_status_id: { $in: campaignStatusIds },
            };

            const data: CampaignEntity[] = await CampaignApi.getByParamsApi_(filterData, { limit: 10 });

            const campaignWithDetails = await Promise.all(data.map((campaign) => transformToBaseCampaign(campaign)));
            setVisibleCampaigns(campaignWithDetails);
            setCampaigns(campaignWithDetails);
            console.log(campaignWithDetails, 'campaignWithDetails');
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            pushWarningNotification('Error', `Error fetching Campaigns: ${err}`);
        }
    };

    // Función para obtener campañas filtradas
    const fetchCampaignsByFilter = async (filters: { campaing_category_id?: string | null; campaign_status_id?: string | null; name?: string | null }) => {
        try {
            const filterData: Record<string, any> = {};
            if (filters.campaing_category_id) filterData.campaing_category_id = filters.campaing_category_id;
            if (filters.campaign_status_id) filterData.campaign_status_id = filters.campaign_status_id;
            const data: CampaignEntity[] = await CampaignApi.getByParamsApi_(filterData, { limit: 10 });
            const campaignWithDetails = await Promise.all(data.map((campaign) => transformToBaseCampaign(campaign)));
            setVisibleCampaigns(campaignWithDetails);
        } catch (err) {
            console.error('Error fetching campaigns with filters:', err);
            pushWarningNotification('Error', `Error fetching Campaigns with filters: ${err}`);
        }
    };

    // Cargar campañas iniciales al montar el componente
    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        if (stateFilter === null && categoryFilter === null) return;
        fetchCampaignsByFilter({ campaing_category_id: categoryFilter, campaign_status_id: stateFilter, name: searchTerm });
    }, [stateFilter, categoryFilter, searchTerm]);

    return {
        campaigns,
        filteredCampaigns,
        fetchCampaigns,
        fetchCampaignsByFilter,
        stateFilter,
        setStateFilter,
        categoryFilter,
        setCategoryFilter,
        visibleCampaigns,
        setVisibleCampaigns,
        searchTerm,
        setSearchTerm,
    };
};
