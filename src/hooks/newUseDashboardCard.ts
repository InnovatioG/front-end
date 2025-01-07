/* import { useCallback, useEffect, useState } from 'react';
import { Campaign, Category, State, User } from '@/HardCode/databaseType';
import { useScreenSize } from '@/hooks/useScreenSize';
import { dataBaseService } from '@/HardCode/dataBaseService';
import { useRouter } from 'next/router';
import { useCampaign } from '@/components/Admin/Campaign/useCampaign';
import { useCampaignMember } from '@/components/Admin/CampaignMember/useCampaignMember';
import { useMilestone } from '@/components/Admin/Milestone/useMilestone';
export const useNewDashboardCard = (address: string | null) => {
    const { list: campaignList } = useCampaign();
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
    */ /* 

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

    return {
        campaignList,
        campaignsa,
        milestoneList,
    };
};
 */
