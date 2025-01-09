import { useState, useEffect } from 'react';
import { CampaignApi, CampaignMemberApi, MilestoneApi } from '@/lib/SmartDB/FrontEnd';
import { pushWarningNotification } from 'smart-db';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { MilestoneEntity, CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import type { Campaign, Milestone, MembersTeam } from '@/types/types';

export const useNewDashboardCard = (address: string | null) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

    // Función para transformar CampaignEntity a BaseCampaign
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

    // Función para obtener todas las campañas

    //! TODO MOMENTANEO
    const fetchCampaigns = async () => {
        try {
            // Obtener todas las campañas sin filtro
            const data: CampaignEntity[] = await CampaignApi.getByParamsApi_({}, { limit: 100 });

            // Filtrar en el cliente las campañas que cumplen con la condición
            const filteredCampaigns = data.filter((campaign) => {
                const status = parseInt(campaign.campaign_status_id, 10); // Convertir a número si es necesario
                return status >= 8 && status !== 10;
            });

            // Limitar el número de resultados a 10 después de haber filtrado
            const limitedCampaigns = filteredCampaigns.slice(0, 20);
            // Transformar las campañas a un formato adecuado
            const campaignWithDetails = await Promise.all(limitedCampaigns.map((campaign) => transformToBaseCampaign(campaign)));

            setCampaigns(campaignWithDetails);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            pushWarningNotification('Error', `Error fetching Campaigns: ${err}`);
        }
    };

    // Función para obtener campañas filtradas
    const fetchCampaignsByFilter = async (filters: { category?: string; state?: string; searchTerm?: string; userId?: string | null; isHomePage?: boolean; isAdmin?: boolean }) => {
        try {
            const paramsFilter: Record<string, any> = {};
            if (filters.category) paramsFilter.category_id = filters.category;
            if (filters.state) paramsFilter.campaign_status_id = filters.state;
            if (filters.searchTerm) paramsFilter.searchTerm = filters.searchTerm;
            if (filters.userId) paramsFilter.user_id = filters.userId;
            if (filters.isHomePage) paramsFilter.isHomePage = filters.isHomePage;
            if (filters.isAdmin) paramsFilter.isAdmin = filters.isAdmin;

            const filteredData: CampaignEntity[] = await CampaignApi.getByParamsApi_(paramsFilter);
            const campaignMemberList = await CampaignMemberApi.getAllApi_(); // Obtener todos los miembros

            // Transformar datos de CampaignEntity a BaseCampaign con milestones específicos
            const filteredCampaignsWithDetails = await Promise.all(filteredData.map((campaign) => transformToBaseCampaign(campaign)));

            setFilteredCampaigns(filteredCampaignsWithDetails);
        } catch (err) {
            console.error('Error fetching campaigns with filters:', err);
            pushWarningNotification('Error', `Error fetching Campaigns with filters: ${err}`);
        }
    };

    // Cargar campañas iniciales al montar el componente
    useEffect(() => {
        fetchCampaigns();
    }, []);

    return {
        campaigns,
        filteredCampaigns,
        fetchCampaigns,
        fetchCampaignsByFilter,
    };
};
