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
import { transformToBaseCampaign } from '@/utils/transformBaseCampaign';
import { useRouter } from 'next/router';
import { useWalletStore } from 'smart-db';
export const useNewDashboardCard = () => {
    const { campaignStatus } = useGeneralStore();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const [stateFilter, setStateFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const walletStore = useWalletStore();
    const address = walletStore.info?.address || '';
    const pathName = useRouter().pathname;

    const fetchCampaigns = async (page = 1) => {
        setCampaignsLoading(true);
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

            const filterDataManage = {
                creator_wallet_id: address,
            };

            let data: CampaignEntity[] = [];
            const offset = (page - 1) * itemsPerPage;

            if (pathName === '/campaign/manage') {
                data = await CampaignApi.getByParamsApi_(filterDataManage, { limit: 10 });
            } else if (pathName === '/campaigns') {
                data = await CampaignApi.getByParamsApi_(filterData, { limit: 40 });
            } else {
                data = await CampaignApi.getByParamsApi_(filterData, { limit: 10 });
            }

            const campaignWithDetails = await Promise.all(data.map((campaign) => transformToBaseCampaign(campaign)));
            setVisibleCampaigns(campaignWithDetails);
            setCampaigns(campaignWithDetails);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            pushWarningNotification('Error', `Error fetching Campaigns: ${err}`);
        }
        setCampaignsLoading(false);
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
        if (address === '') return;
        fetchCampaigns();
    }, [address]);

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
        setCampaignsLoading,
        campaignsLoading,
    };
};
