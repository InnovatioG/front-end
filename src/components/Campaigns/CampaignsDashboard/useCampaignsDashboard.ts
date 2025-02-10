import { useScreenSize } from '@/hooks/useScreenSize';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '@/utils/constants/routes';
import { pushWarningNotification, useWalletStore } from 'smart-db';
import { CampaignEX } from '@/types/types';
import { CampaignsStatus_Code_Ids_For_Investors, CampaignStatus_Code_Id } from '@/utils/constants/status';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { getCampaignEX } from '@/hooks/useCampaingDetails';

export const useCampaignsDashboard = () => {
    const router = useRouter();
    const pathName = router.pathname;
    const screenSize = useScreenSize();

    const walletStore = useWalletStore();

    const [campaignsLoading, setCampaignsLoading] = useState(true);

    const { campaignStatus, campaignCategories, wallet } = useGeneralStore();

    const [campaignCategoriesFilterd, setCampaignCategoriesFilterd] = useState(campaignCategories);
    const [campaignStatusFilterd, setCampaignStatusFilterd] = useState(campaignStatus);

    const [statusFilter, setStatusFilter] = useState<string>('-1');
    const [categoryFilter, setCategoryFilter] = useState<string>('-1');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [myProposal, setMyProposal] = useState(false);
    const [showMyProposalButton, setShowMyProposalButton] = useState(true);

    const [hasMore, setHasMore] = useState(false);

    const [campaigns, setCampaigns] = useState<CampaignEX[]>([]);

    const handleMyProposalChange = (checked: boolean) => {
        setMyProposal(checked);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const fetchCampaigns = useCallback(async () => {
        // TODO: falta ver quienes son editores o managers, etc, ahora solo uso creator_wallet_id: walletStore.info!.address
        console.log(
            `fetchCampaigns: ${pathName} - ${campaignStatus}- ${myProposal} - ${statusFilter} - ${categoryFilter} - ${searchTerm} - ${walletStore.isConnected} - ${wallet}`
        );

        setCampaignsLoading(true);
        try {
            const limit = pathName === ROUTES.home ? 10 : 20;

            let filterConditions: any[] = [];

            if (pathName === ROUTES.manage) {
                if (!walletStore.isConnected || wallet === undefined) {
                    setCampaigns([]);
                    setCampaignsLoading(false);
                    return;
                }
                if (walletStore.isCoreTeam()) {
                    setShowMyProposalButton(true);
                } else {
                    // en manage para los no core team solo se muestran sus propuestas
                    setShowMyProposalButton(false);
                    filterConditions.push({ creator_wallet_id: wallet._DB_id });
                }
            }

            if (myProposal) {
                if (walletStore.isConnected && wallet !== undefined) {
                    filterConditions.push({ creator_wallet_id: wallet._DB_id });
                } else {
                    setCampaigns([]);
                    setCampaignsLoading(false);
                    return;
                }
            }

            if (statusFilter && statusFilter !== '-1') {
                filterConditions.push({ campaign_status_id: statusFilter });
            }

            if (categoryFilter && categoryFilter !== '-1') {
                filterConditions.push({ campaign_category_id: categoryFilter });
            }

            if (searchTerm) {
                filterConditions.push({ $or: [{ name: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }] });
            }

            if (pathName === ROUTES.home || pathName === ROUTES.campaigns) {
                setShowMyProposalButton(true);

                const campaignStatusIdsForInvestors = campaignStatus
                    .filter((status) => CampaignsStatus_Code_Ids_For_Investors.includes(status.code_id))
                    .map((status) => status._DB_id);

                if (campaignStatusIdsForInvestors.length > 0) {
                    filterConditions.push({ campaign_status_id: { $in: campaignStatusIdsForInvestors } });
                }
            }

            const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

            const data: CampaignEntity[] = await CampaignApi.getByParamsApi_(filter, { limit });
            const count = await CampaignApi.getCountApi_(filter);

            setHasMore(count > limit);
            setCampaigns(await Promise.all(data.map(getCampaignEX)));
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            pushWarningNotification('Error', `Error fetching Campaigns: ${err}`);
        }
        setCampaignsLoading(false);
    }, [
        pathName,
        campaignStatus,
        myProposal,
        statusFilter,
        categoryFilter,
        searchTerm,
        // Solo incluir la billetera si estamos en "manage" o "myProposal"
        ...(pathName === ROUTES.manage || myProposal ? [walletStore.isConnected, wallet] : []),
    ]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    useEffect(() => {
        if (pathName === ROUTES.home || pathName === ROUTES.campaigns) {
            setCampaignStatusFilterd(campaignStatus.filter((status) => CampaignsStatus_Code_Ids_For_Investors.includes(status.code_id)));
        }
    }, [pathName, campaignStatus]);

    return {
        campaignsLoading,
        walletStore,
        searchTerm,
        campaigns,
        hasMore,
        pathName,
        campaignStatus: campaignStatusFilterd,
        statusFilter,
        setStatusFilter,
        campaignCategories: campaignCategoriesFilterd,
        categoryFilter,
        setCategoryFilter,
        handleSearchChange,
        screenSize,
        myProposal,
        handleMyProposalChange,
        showMyProposalButton,
    };
};
