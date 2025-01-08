import { useState, useEffect } from 'react';
import { Campaign } from '@/HardCode/databaseType';
import { CampaignApi, CampaignMemberApi, MilestoneApi } from '@/lib/SmartDB/FrontEnd';
import { pushWarningNotification } from 'smart-db';
import { Milestone } from '@/HardCode/databaseType';

export const useNewDashboardCard = (address: string | null) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

    // Función para obtener todas las campañas
    const fetchCampaigns = async () => {
        try {
            const campaigns: Campaign[] = await CampaignApi.getAllApi_();
            const campaignWithMilestones = await Promise.all(
                campaigns.map(async (campaign) => {
                    const milestones: Milestone[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id });
                    return { ...campaign, milestones };
                })
            );

            setCampaigns(campaignWithMilestones);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            pushWarningNotification('Error', `Error fetching Campaigns: ${err}`);
        }
    };
    // Función para obtener campañas filtradas
    const fetchCampaignsByFilter = async (filters: { category?: string; state?: string; searchTerm?: string; userId?: string | null; isHomePage?: boolean; isAdmin?: boolean }) => {
        try {
            // Construimos los filtros dinámicamente
            const paramsFilter: Record<string, any> = {};
            if (filters.category) paramsFilter.category_id = filters.category;
            if (filters.state) paramsFilter.campaign_status_id = filters.state;
            if (filters.searchTerm) paramsFilter.searchTerm = filters.searchTerm;
            if (filters.userId) paramsFilter.user_id = filters.userId;
            if (filters.isHomePage) paramsFilter.isHomePage = filters.isHomePage;
            if (filters.isAdmin) paramsFilter.isAdmin = filters.isAdmin;

            // Llamada a la API con los filtros
            const filteredCampaigns = await CampaignApi.getByParamsApi_(paramsFilter);
            setFilteredCampaigns(filteredCampaigns);
        } catch (err) {
            console.error('Error fetching campaigns with filters:', err);
            pushWarningNotification('Error', `Error fetching Campaigns with filters: ${err}`);
        }
    };

    // Cargar campañas iniciales al montar el componente
    useEffect(() => {
        fetchCampaigns();
        fetchCampaignsByFilter({ isHomePage: true });
    }, []);

    return {
        campaigns,
        filteredCampaigns,
        fetchCampaigns,
        fetchCampaignsByFilter,
    };
};

/*

/*     const { list: campaignList } = useCampaign();
    const { list: campaignMemberList } = useCampaignMember();
    const { list: milestoneList } = useMilestone(); */

/* 
      {
      id: '9',
      creator_wallet_id: '23',
      title: 'Tech for Tomorrow',
      description: 
        'This campaign is in the countdown phase, preparing to begin fundraising.',
      state_id: '9',
      banner_url: '/images/campaigns/tech_tomorrow_banner.png',
      logo_url: '/images/campaigns/tech_tomorrow_logo.png',
      createdAt: new Date('2025-01-06T14:44:53.000Z'),
      updatedAt: new Date('2025-01-06T14:44:53.000Z'),
      investors: 0,
      goal: 15000n,
      category_id: '1',
      min_request: 7000n,
      website: 'https://techfortomorrow.com',
      facebook: '',
      instagram: '',
      discord: '',
      xs: 'https://twitter.com/tech_tomorrow',
      members_team: [
        CampaignMemberEntity {
          _DB_id: '23',
          campaign_id: '9',
          role: 'Creator',
          editor: true,
          admin: true,
          email: 'user23@example.com',
          wallet_id: '23',
          wallet_address: 'addr_USER23',
          twitter: 'https://twitter.com/user23',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        },
        CampaignMemberEntity {
          _DB_id: '24',
          campaign_id: '9',
          role: 'Admin',
          editor: true,
          admin: true,
          email: 'user24@example.com',
          wallet_id: '24',
          wallet_address: 'addr_USER24',
          twitter: 'https://twitter.com/user24',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        },
        CampaignMemberEntity {
          _DB_id: '25',
          campaign_id: '9',
          role: 'Reviewer',
          editor: true,
          admin: false,
          email: 'user25@example.com',
          wallet_id: '25',
          wallet_address: 'addr_USER25',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        },
        CampaignMemberEntity {
          _DB_id: '26',
          campaign_id: '9',
          role: 'Contributor',
          editor: false,
          admin: false,
          email: 'user26@example.com',
          wallet_id: '26',
          wallet_address: 'addr_USER26',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        }
      ],
      status: '9',
      milestones: [
        MilestoneEntity {
          _DB_id: '5',
          campaign_id: '9',
          milestone_status_id: '1',
          estimate_delivery_days: 25,
          percentage: 40,
          description: 'Initial prototype development.',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        },
        MilestoneEntity {
          _DB_id: '6',
          campaign_id: '9',
          milestone_status_id: '1',
          estimate_delivery_days: 40,
          percentage: 30,
          description: 'Market analysis and scalability research.',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        },
        MilestoneEntity {
          _DB_id: '7',
          campaign_id: '9',
          milestone_status_id: '1',
          estimate_delivery_days: 60,
          percentage: 30,
          description: 'Final product launch preparation.',
          createdAt: new Date('2025-01-06T14:44:53.000Z'),
          updatedAt: new Date('2025-01-06T14:44:53.000Z')
        }
      ]
    },

    {
    "_DB_id": "1",
    "campaign_id": "7",
    "milestone_status_id": "1",
    "estimate_delivery_days": 30,
    "percentage": 40,
    "description": "Develop smart farming prototype.",
    "createdAt": "2025-01-06T14:44:53.758Z",
    "updatedAt": "2025-01-06T14:44:53.758Z"
}
const campaignsa: Campaign[] = campaignList.map((campaign) => ({
    id: campaign._DB_id,
    creator_wallet_id: campaign.creator_wallet_id,
    title: campaign.name,
    description: campaign.description,
    state_id: campaign.campaign_status_id,
    banner_url: campaign.banner_url,
    logo_url: campaign.logo_url,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    investors: campaign.investors,
    goal: campaign.requestedMaxADA,
    category_id: campaign.campaing_category_id,
    min_request: campaign.requestedMinADA,
    website: campaign.website,
    facebook: campaign.facebook,
    instagram: campaign.instagram,
    discord: campaign.discord,
    xs: campaign.twitter,
    members_team: campaignMemberList.filter((member) => member.campaign_id === campaign._DB_id),
    status: campaign.campaign_status_id,
    milestones: milestoneList.filter((milestone) => milestone.campaign_id === campaign._DB_id),
    start_date: campaign.begin_at,
    end_date: campaign.deadline,
}));
*/
